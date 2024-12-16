import { ArrowDropDown, ArrowDropUp, InfoOutlined } from '@mui/icons-material';
import {
  Box,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import {
  allValueDatesState,
  brokerUniverseCurrenciesState,
  buyCurrencyState,
  clientApiState,
  existingPaymentIdState,
  fxFetchingSpotRateState,
  pangeaAlertNotificationMessageState,
  paymentBuyCurrencyState,
  paymentExecutionTimingtData,
  paymentSellCurrencyState,
  paymentspotRateDataState,
  sellCurrencyState,
  transactionPaymentState,
  transactionRequestDataState,
  valueDateTypeState,
} from 'atoms';
import { ConfirmCancelDialog } from 'components/modals';
import {
  FeatureFlag,
  PangeaErrorFormHelperText,
  PangeaLoading,
  PangeaTooltip,
  TabPanel,
  TransactionAmountControl,
  TransactionSettlementControl,
} from 'components/shared';
import CustomDatePicker from 'components/shared/CustomDatePicker';
import CutoffCountdown from 'components/shared/CutoffCountdown';
import {
  addDays,
  addMonths,
  differenceInDays,
  format,
  isBefore,
  lastDayOfMonth,
  parse,
  startOfMonth,
} from 'date-fns';
import { useLoading, useWalletAndPaymentHelpers } from 'hooks';
import {
  CreateOrUpdatePaymentArguments,
  FrequencyType,
  MonthlyFreqObj,
  PangeaDateTypeEnum,
  PangeaExecutionTimingEnum,
  PangeaPayment,
  PangeaPaymentInstallment,
  PangeaPaymentStatusEnum,
  formatCurrency,
  generateRrule,
  getDurationBasedOnFrequency,
  getFieldValueFromRrule,
  getFirstBusinessDayOfFollowingWeek,
  getNumberWithOrdinal,
  getOneYearFromToday,
  getProperDateDiffUnit,
  getStartOfToday,
  standardizeDate,
} from 'lib';
import { debounce, isError, isNull, range } from 'lodash';
import { useRouter } from 'next/router';
import {
  ChangeEvent,
  Fragment,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  useRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import { ByWeekday, RRule, Weekday, WeekdayStr } from 'rrule';
import { PangeaColors } from 'styles';
import PaymentGridInstallment from './PaymentGridInstallment';

type PaymentDetailsProps = {
  onCreateOrUpdateTransaction: (
    options: CreateOrUpdatePaymentArguments,
  ) => Promise<void>;
};
export type FreqType =
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'bi-monthly'
  | 'quarter'
  | 'year';
const ensureWeekdayArray = (
  d: Optional<Nullable<ByWeekday | ByWeekday[]>>,
): Optional<number>[] => {
  if (!d) return [];
  if (!Array.isArray(d)) {
    if (typeof d == 'number') {
      return [d];
    }
    if (d instanceof Weekday) {
      return [d.weekday];
    }
    if (typeof d == 'string') {
      return [Weekday.fromStr(d as WeekdayStr).weekday];
    }
  } else if (Array.isArray(d)) {
    return d.map((x) => {
      if (x instanceof Weekday) {
        return x.weekday;
      } else if (typeof x == 'number') {
        return x;
      } else {
        return Weekday.fromStr(x as WeekdayStr).weekday;
      }
    });
  }
  return new Array<number>();
};

const DEFAULT_ROUNDING = 0;

const PaymentDetails = ({
  onCreateOrUpdateTransaction,
}: PaymentDetailsProps): JSX.Element => {
  const setPaymentBuyCurrency = useSetRecoilState(paymentBuyCurrencyState);
  const setPaymentSellCurrency = useSetRecoilState(paymentSellCurrencyState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nextFrequency, setNextFrequency] = useState<FrequencyType | null>(
    null,
  );
  const { getPaymentsV2SpotRate, getExecutableDateFromValueDate } =
    useWalletAndPaymentHelpers();

  const router = useRouter();
  const { id } = router.query;
  const existingTransactionId = useRecoilValue(existingPaymentIdState);
  const Today = useMemo(() => getStartOfToday(), []);
  const fetchingSpotRate = useRecoilValue(fxFetchingSpotRateState);
  const spotRateData = useRecoilValue(paymentspotRateDataState);
  const allValueDates = useRecoilValue(allValueDatesState);
  const [valueDateType, setValueDateType] = useRecoilState(valueDateTypeState);

  const [transactionRequestData, setTransactionRequestData] = useRecoilState(
    transactionRequestDataState,
  );
  const brokerUniverseCurrenciesLoadable = useRecoilValueLoadable(
    brokerUniverseCurrenciesState('sell'),
  );
  const [transactionPayment, setTransactionPayment] = useRecoilState(
    transactionPaymentState,
  );
  const resetSelectedExecutionTiming = useResetRecoilState(
    paymentExecutionTimingtData,
  );
  const resetTransactionRequestData = useResetRecoilState(
    transactionRequestDataState,
  );
  const resetExistingPaymentId = useResetRecoilState(existingPaymentIdState);
  const resetTransactionPayment = useResetRecoilState(transactionPaymentState);
  const resetPaymentSpotRate = useResetRecoilState(paymentspotRateDataState);
  const executionTiming = useRecoilValue(paymentExecutionTimingtData);

  const {
    loadingPromise: editPaymentPromise,
    loadingState: editPaymentLoadingState,
  } = useLoading();
  const api = useRecoilValue(clientApiState);
  const apiHelper = api.getAuthenticatedApiHelper();
  const setPangeaNotification = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );

  const [sellCurrencyDetails, setSellCurrencyDetails] =
    useRecoilState(sellCurrencyState);
  const [buyCurrencyDetails, setBuyCurrencyDetails] =
    useRecoilState(buyCurrencyState);
  const brokerUniverseCurrencies = brokerUniverseCurrenciesLoadable.getValue();
  const isLoadingCurrency =
    brokerUniverseCurrenciesLoadable.state === 'loading';

  const { buy_currency, sell_currency } = brokerUniverseCurrencies
    ? brokerUniverseCurrencies
    : { buy_currency: [], sell_currency: [] };
  const [allBuyCurrencies, allSellCurrencies] = useMemo(
    () => [buy_currency, sell_currency],
    [buy_currency, sell_currency],
  );
  const MinStartDate = useMemo(
    () => standardizeDate(getFirstBusinessDayOfFollowingWeek(Today)),
    [Today],
  );

  const [endChoice, setEndChoice] = useState<string>('by');
  const [endChoiceTabPanel, setEndChoiceTabPanel] = useState<number>(() => {
    const panelId = getFieldValueFromRrule(
      'endChoiceTabPanel',
      transactionRequestData.periodicity,
    ) as number;
    return panelId ? panelId : endChoice == 'by' ? 0 : 1;
  });
  const [occurrences, setOccurrences] = useState(() => {
    return (
      (getFieldValueFromRrule(
        'occurrences',
        transactionRequestData.periodicity,
      ) as number) ?? 1
    );
  });
  const [occuringDates, setOccuringDates] = useState<Date[]>([]);
  const [endBy, setEndBy] = useState<Nullable<Date>>(null);
  const [startDate, setStartDate] = useState<Nullable<Date>>(null);
  const [showOccurrences, setShowOccurrences] = useState<boolean>(false);

  const OneYearFromToday = useMemo(() => getOneYearFromToday(), []);
  const [freq, setFreq] = useState(() => {
    return (
      (getFieldValueFromRrule(
        'freq',
        transactionRequestData.periodicity,
      ) as number) ?? 1
    );
  });
  const [freqMeasure, setFreqMeasure] = useState<FreqType>(() => {
    return (
      (getFieldValueFromRrule(
        'freqMeasure',
        transactionRequestData.periodicity,
      ) as FreqType) ?? 'day'
    );
  });
  const [days, setDays] = useState<
    Nullable<number[] | ByWeekday | ByWeekday[]>
  >(() => {
    return (
      (getFieldValueFromRrule(
        'days',
        transactionRequestData.periodicity,
      ) as number[]) ?? null
    );
  });
  const plural = freq > 1 ? 's' : '';
  const showDayErrorMessage =
    freqMeasure === 'week' && (!days || Object.keys(days).length === 0);

  function handleTabChange(_event: React.SyntheticEvent, newValue: number) {
    setEndChoice(newValue == 0 ? 'by' : 'after');
    setEndChoiceTabPanel(newValue);
  }
  const [monthlyFreq, setMonthlyFreq] = useState<number>(() => {
    return (
      (getFieldValueFromRrule(
        'monthlyFreq',
        transactionRequestData.periodicity,
      ) as number) ?? 1
    );
  });
  const [secondMonthlyFreq, setSecondMonthlyFreq] = useState<number>(() => {
    return (
      (getFieldValueFromRrule(
        'secondMonthlyFreq',
        transactionRequestData.periodicity,
      ) as number) ?? 15
    );
  });
  const debouncedOnCreateOrUpdateTransaction = useMemo(
    () =>
      debounce(
        () => onCreateOrUpdateTransaction({ shouldUpdateBestEx: true }),
        400,
      ),
    [onCreateOrUpdateTransaction],
  );
  const handleDescriptionChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setTransactionRequestData((payload) => {
        return {
          ...payload,
          payment_reference: event.target.value,
        };
      });
    },
    [setTransactionRequestData],
  );

  const handleStartDateChange = useCallback(
    (newValue: Nullable<Date>) => {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
      const rRule: RRule | null =
        transactionRequestData?.periodicity_end_date && newValue
          ? generateRrule(
              endChoiceTabPanel,
              freqMeasure,
              newValue,
              transactionRequestData.periodicity_end_date,
              monthlyFreq,
              secondMonthlyFreq,
              occurrences,
              freq,
              days,
              ensureWeekdayArray,
            )
          : null;
      setTransactionRequestData((payload) => ({
        ...payload,
        periodicity: rRule ? rRule.toString() : null,
        periodicity_start_date: newValue,
        periodicity_end_date: transactionRequestData.periodicity_end_date,
      }));
      if (isNull(newValue)) {
        newValue = MinStartDate;
      }
      setStartDate(newValue);
      if (endBy && isBefore(endBy, newValue)) {
        setEndBy(addDays(newValue, 1));
      }
      onCreateOrUpdateTransaction({
        shouldUpdateBestEx: true,
        newStartDate: newValue,
        newEndDate: endBy ?? addDays(newValue, 1),
      });
    },
    [
      transactionRequestData.periodicity_end_date,
      endChoiceTabPanel,
      freqMeasure,
      monthlyFreq,
      secondMonthlyFreq,
      occurrences,
      freq,
      days,
      setTransactionRequestData,
      endBy,
      onCreateOrUpdateTransaction,
      MinStartDate,
    ],
  );
  const handleEndDateChange = useCallback(
    (date: Nullable<Date>) => {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
      const rRule: RRule | null =
        transactionRequestData?.periodicity_start_date && date
          ? generateRrule(
              endChoiceTabPanel,
              freqMeasure,
              transactionRequestData.periodicity_start_date,
              date,
              monthlyFreq,
              secondMonthlyFreq,
              occurrences,
              freq,
              days,
              ensureWeekdayArray,
            )
          : null;
      setTransactionRequestData((payload) => ({
        ...payload,
        periodicity: rRule ? rRule.toString() : null,
        periodicity_start_date: transactionRequestData.periodicity_start_date,
        periodicity_end_date: date,
      }));
      if (!date) {
        date = OneYearFromToday;
      }
      setEndBy(standardizeDate(date));
      if (startDate) {
        onCreateOrUpdateTransaction({
          shouldUpdateBestEx: true,
          newStartDate: startDate,
          newEndDate: date,
        });
      } else if (transactionRequestData?.periodicity_start_date) {
        onCreateOrUpdateTransaction({
          shouldUpdateBestEx: true,
          newStartDate: transactionRequestData.periodicity_start_date,
          newEndDate: date,
        });
      }
    },
    [
      transactionRequestData.periodicity_start_date,
      endChoiceTabPanel,
      freqMeasure,
      monthlyFreq,
      secondMonthlyFreq,
      occurrences,
      freq,
      days,
      setTransactionRequestData,
      startDate,
      OneYearFromToday,
      onCreateOrUpdateTransaction,
    ],
  );
  const handleValueDateChange = useCallback(
    async (val: Date) => {
      setTransactionRequestData((payload) => {
        return {
          ...payload,
          delivery_date: val,
        };
      });
      await getPaymentsV2SpotRate({
        buy_currency: transactionRequestData.payment_currency,
        sell_currency: transactionRequestData.settlement_currency,
        subscription: true,
        value_date: format(val, 'yyyy-MM-dd'),
      });
      resetSelectedExecutionTiming();
      onCreateOrUpdateTransaction({
        shouldUpdateBestEx: true,
        newValueDate: val,
      });
    },
    [
      setTransactionRequestData,
      getPaymentsV2SpotRate,
      transactionRequestData.payment_currency,
      transactionRequestData.settlement_currency,
      resetSelectedExecutionTiming,
      onCreateOrUpdateTransaction,
    ],
  );

  const handleEndingAfterChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const occurrences = parseInt(e.currentTarget.value);
      if (!isNaN(occurrences)) {
        setOccurrences(occurrences);
        const rRule: RRule | null =
          transactionRequestData?.periodicity_start_date
            ? generateRrule(
                endChoiceTabPanel,
                freqMeasure,
                transactionRequestData.periodicity_start_date,
                null,
                monthlyFreq,
                secondMonthlyFreq,
                occurrences,
                freq,
                days,
                ensureWeekdayArray,
              )
            : null;
        setTransactionRequestData((payload) => ({
          ...payload,
          periodicity: rRule ? rRule.toString() : null,
          periodicity_start_date: transactionRequestData.periodicity_start_date,
          periodicity_end_date: rRule
            ? rRule.all()[rRule.all().length - 1]
            : null,
        }));
        onCreateOrUpdateTransaction({
          shouldUpdateBestEx: true,
          newStartDate:
            transactionRequestData.periodicity_start_date ?? undefined,
          newEndDate: rRule ? rRule.all()[rRule.all().length - 1] : undefined,
        });
      }
    },
    [
      days,
      endChoiceTabPanel,
      freq,
      freqMeasure,
      monthlyFreq,
      secondMonthlyFreq,
      setTransactionRequestData,
      onCreateOrUpdateTransaction,
      transactionRequestData.periodicity_start_date,
    ],
  );
  const getValidatedValueDates = async (dates: Array<Date>) => {
    if (
      !transactionRequestData.settlement_currency ||
      !transactionRequestData.payment_currency
    ) {
      return;
    }

    try {
      const result = await apiHelper.getValidCalendarValueDates({
        sell_currency: transactionRequestData.settlement_currency,
        buy_currency: transactionRequestData.payment_currency,
        dates: dates.map((val) => {
          return format(val, 'yyyy-MM-dd');
        }),
      });
      if (result && !isError(result)) {
        setOccuringDates(
          result.map((val) => {
            return parse(val, 'yyyy-MM-dd', new Date());
          }),
        );
        if (endChoiceTabPanel === 0) {
          setOccurrences(result.length);
        }
      }
    } catch (error) {
      console.error('Failed to validate dates:', error);
    }
  };

  useEffect(() => {
    if (
      freqMeasure === 'week' &&
      (!days || (Array.isArray(days) && days.length === 0))
    ) {
      setTransactionRequestData((payload) => {
        return {
          ...payload,
          periodicity: null,
        };
      });
      setOccuringDates([]);
      return;
    }

    const isRecurring: boolean =
      transactionRequestData.frequency == 'recurring';
    const rRule: RRule | null =
      isRecurring && startDate && endBy
        ? generateRrule(
            endChoiceTabPanel,
            freqMeasure,
            startDate,
            endBy,
            monthlyFreq,
            secondMonthlyFreq,
            occurrences,
            freq,
            days,
            ensureWeekdayArray,
          )
        : null;

    if (rRule) {
      setTransactionRequestData((payload) => {
        return {
          ...payload,
          periodicity: rRule ? rRule.toString() : null,
          periodicity_start_date: rRule ? startDate : null,
          periodicity_end_date: rRule && endChoiceTabPanel === 0 ? endBy : null,
        };
      });
      getValidatedValueDates(rRule.all());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    days,
    endChoiceTabPanel,
    freq,
    freqMeasure,
    monthlyFreq,
    secondMonthlyFreq,
    occurrences,
    endBy,
    startDate,
    transactionRequestData.frequency,
  ]);

  useEffect(() => {
    if (id || existingTransactionId) {
      const paymentId = typeof id === 'string' ? id : existingTransactionId;
      const loadExistingPayment = async () => {
        if (paymentId) {
          const paymentResponse = await apiHelper.getTransactionByIdAsync(
            parseInt(paymentId),
          );
          if (isError(paymentResponse)) {
            setPangeaNotification({
              text: 'Error occurred while loading existing payment',
              severity: 'error',
            });
            return;
          }
          setTransactionPayment(paymentResponse);
          if (paymentResponse.periodicity_start_date) {
            setStartDate(new Date(paymentResponse.periodicity_start_date));
          }
          if (paymentResponse.periodicity_end_date) {
            setEndBy(new Date(paymentResponse.periodicity_end_date));
          }
          if (paymentResponse.periodicity) {
            const rrule: RRule = RRule.fromString(paymentResponse.periodicity);
            setEndChoiceTabPanel(rrule.options.count ? 1 : 0);
            // setOccurrences(rrule.options.count ?? 1);
            getValidatedValueDates(rrule.all());
          }

          let installments: PangeaPaymentInstallment[] = [];
          if (paymentResponse.installment) {
            installments = paymentResponse.cashflows.map((item) => {
              return {
                amount: item.amount,
                cntr_amount: item.cntr_amount ?? null,
                sell_currency: item.sell_currency,
                buy_currency: item.buy_currency,
                lock_side: item.lock_side,
                date: item.pay_date.split('T')[0],
                cashflow_id: item.cashflow_id,
                internal_uuid: item.cashflow_id,
                id: item.cashflow_id,
              } as PangeaPaymentInstallment;
            });
          }

          setTransactionRequestData({
            frequency: paymentResponse.recurring
              ? 'recurring'
              : paymentResponse.installment
              ? 'installments'
              : 'onetime',
            payment_currency: paymentResponse.buy_currency ?? '',
            settlement_currency: paymentResponse.sell_currency ?? '',
            amount: paymentResponse.amount ?? 0,
            lock_side: paymentResponse.lock_side ?? '',
            delivery_date: new Date(paymentResponse.delivery_date ?? ''),
            fees: 0,
            payment_reference: paymentResponse.name ?? '',
            cntr_amount: paymentResponse.cntr_amount ?? 0,
            settlement_amount:
              paymentResponse.lock_side === paymentResponse.sell_currency
                ? paymentResponse.amount ?? 0
                : paymentResponse.cntr_amount ?? 0,
            payment_amount:
              paymentResponse.lock_side === paymentResponse.buy_currency
                ? paymentResponse.amount ?? 0
                : paymentResponse.cntr_amount ?? 0,
            purpose_of_payment:
              (paymentResponse.purpose_of_payment as unknown as string) ?? '',
            settlementDetails: {
              account_id: paymentResponse.origin_account_id ?? '',
              delivery_method:
                (paymentResponse.origin_account_method as string) ?? null,
            },
            paymentDetails: {
              beneficiary_id: paymentResponse.destination_account_id ?? '',
              delivery_method:
                (paymentResponse.destination_account_method as string) ?? null,
            },
            periodicity: paymentResponse.periodicity,
            periodicity_start_date: paymentResponse.periodicity_start_date
              ? parse(
                  paymentResponse.periodicity_start_date.split('T')[0],
                  'yyyy-MM-dd',
                  new Date(),
                )
              : null,
            periodicity_end_date: paymentResponse.periodicity_end_date
              ? parse(
                  paymentResponse.periodicity_end_date.split('T')[0],
                  'yyyy-MM-dd',
                  new Date(),
                )
              : null,
            installment: paymentResponse.installment,
            recurring: paymentResponse.recurring,
            installments: installments,
            cashflows: paymentResponse.cashflows,
          });
          if (!paymentResponse.recurring && !paymentResponse.installment) {
            if (paymentResponse?.delivery_date && allValueDates.length > 0) {
              const controlDateValue = allValueDates.find(
                (day) => day.date === paymentResponse.delivery_date,
              );
              if (controlDateValue) {
                setValueDateType(controlDateValue.date_type);
              }
            }
            if (allValueDates.length === 0) {
              const [source, destination] = [
                paymentResponse.buy_currency,
                paymentResponse.sell_currency,
              ];
              if (source && destination && startDate) {
                const firstDayOfMonth = startOfMonth(new Date(startDate));
                const result = await apiHelper.getPaymentCalendarValues({
                  pair: `${source}${destination}`,
                  start_date: format(firstDayOfMonth, 'yyyy-MM-dd'),
                  end_date: format(
                    lastDayOfMonth(addMonths(firstDayOfMonth, 12)),
                    'yyyy-MM-dd',
                  ),
                });
                if (result && !isError(result)) {
                  const controlDateValue = result.dates.find(
                    (day) => day.date === paymentResponse.delivery_date,
                  );
                  if (controlDateValue) {
                    setValueDateType(controlDateValue.date_type);
                  }
                }
              }
            }
          }

          getPaymentsV2SpotRate({
            sell_currency: paymentResponse.sell_currency ?? '',
            buy_currency: paymentResponse.buy_currency ?? '',
            value_date: format(
              new Date(paymentResponse.delivery_date ?? ''),
              'yyyy-MM-dd',
            ),
          });
          setPaymentSellCurrency(paymentResponse.sell_currency ?? '');
          setSellCurrencyDetails(
            () =>
              allSellCurrencies.find(
                (item) => item.currency === paymentResponse.sell_currency,
              ) ?? null,
          );
          setPaymentBuyCurrency(paymentResponse.buy_currency ?? '');
          setBuyCurrencyDetails(
            () =>
              allBuyCurrencies.find(
                (item) => item.currency === paymentResponse.buy_currency,
              ) ?? null,
          );
        }
      };
      if (!transactionPayment) {
        editPaymentPromise(loadExistingPayment());
      } else {
        if (transactionPayment.periodicity) {
          if (transactionPayment.periodicity_start_date) {
            setStartDate(new Date(transactionPayment.periodicity_start_date));
          }
          if (transactionPayment.periodicity_end_date) {
            setEndBy(new Date(transactionPayment.periodicity_end_date));
          }
          if (transactionPayment.periodicity) {
            const rrule: RRule = RRule.fromString(
              transactionPayment.periodicity,
            );
            setEndChoiceTabPanel(rrule.options.count ? 1 : 0);
            setOccurrences(rrule.options.count ?? 1);
            getValidatedValueDates(rrule.all());
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    id,
    existingTransactionId,
    transactionPayment,
    setValueDateType,
    allValueDates,
  ]);

  const resetFrequencyCache = useCallback(() => {
    resetTransactionRequestData();
    resetPaymentSpotRate();
    setOccurrences(1);
    setOccuringDates([]);
    setStartDate(null);
    setEndBy(null);
  }, [resetPaymentSpotRate, resetTransactionRequestData]);

  const handleToggleFrequencyChange = useCallback(
    (_event: React.MouseEvent<HTMLElement>, passedValue: FrequencyType) => {
      if (passedValue && passedValue !== transactionRequestData.frequency) {
        if (transactionPayment?.id) {
          setIsModalOpen(true);
          setNextFrequency(passedValue);
        } else {
          resetFrequencyCache();
          setTransactionRequestData((prev) => ({
            ...prev,
            frequency: passedValue,
          }));
        }
      }
    },
    [
      resetFrequencyCache,
      setTransactionRequestData,
      transactionPayment?.id,
      transactionRequestData.frequency,
    ],
  );

  const getOccurenceText = useMemo((): number => {
    return transactionRequestData.frequency != 'installments'
      ? occurrences
      : transactionRequestData.installments
      ? transactionRequestData.installments?.length
      : 0;
  }, [occurrences, transactionRequestData]);

  const getDurationText = useMemo((): string => {
    let durationValue = 1;
    if (transactionRequestData.frequency == 'recurring') {
      if (endChoiceTabPanel === 0 && startDate && endBy) {
        return getDurationBasedOnFrequency(freqMeasure, startDate, endBy);
      }
      return occuringDates.length > 1
        ? getDurationBasedOnFrequency(
            freqMeasure,
            occuringDates[0],
            occuringDates[occuringDates.length - 1],
          )
        : getDurationBasedOnFrequency(freqMeasure, occuringDates[0]);
    } else if (transactionRequestData.frequency == 'installments') {
      if (
        transactionRequestData.installments &&
        transactionRequestData.installments.length > 1
      ) {
        let sortedInstallments = [...transactionRequestData.installments];
        sortedInstallments = sortedInstallments.sort(
          (a, b) => Date.parse(a.date) - Date.parse(b.date),
        );
        return getProperDateDiffUnit(
          differenceInDays(
            Date.parse(sortedInstallments[sortedInstallments.length - 1].date),
            Date.parse(sortedInstallments[0].date),
          ),
          'Day',
        );
      }
      durationValue = transactionRequestData.installments?.length ?? 0;
    }
    return getProperDateDiffUnit(durationValue, 'Day');
  }, [
    endBy,
    endChoiceTabPanel,
    freqMeasure,
    occuringDates,
    startDate,
    transactionRequestData,
  ]);

  const getInstallmentTotalAmount = (isSell = true): number => {
    if (
      !transactionRequestData.installments ||
      transactionRequestData.installments.length == 0
    ) {
      return 0;
    }
    let total = 0;
    transactionRequestData.installments?.forEach((item) => {
      total += isSell ? item.amount : item.cntr_amount ?? 0;
    });
    return total;
  };

  const setToggleButtonStatus = (freq: FrequencyType): boolean => {
    if (!id) {
      return false;
    }
    if (
      freq == 'onetime' &&
      !transactionRequestData.recurring &&
      !transactionRequestData.installment
    ) {
      return false;
    } else if (freq == 'recurring' && transactionRequestData.recurring) {
      return false;
    } else if (freq == 'installments' && transactionRequestData.installment) {
      return false;
    }
    return true;
  };

  const getMonthlyDateOptions = (firstDate = true): Array<MonthlyFreqObj> => {
    const dRange: Array<MonthlyFreqObj> = [];
    range(1, 23).forEach((val) => {
      if (
        (freqMeasure === 'bi-monthly' &&
          ((firstDate && val < secondMonthlyFreq) ||
            (!firstDate && val > monthlyFreq))) ||
        freqMeasure !== 'bi-monthly' ||
        (firstDate && freqMeasure === 'bi-monthly' && secondMonthlyFreq === -1)
      ) {
        dRange.push({
          value: val,
          label: `${val}${getNumberWithOrdinal(val)}`,
        });
      }
    });
    return dRange;
  };

  const resetCacheAndUpdateFrequency = useCallback(() => {
    resetTransactionRequestData();
    resetSelectedExecutionTiming();
    resetExistingPaymentId();
    resetTransactionPayment();

    setIsModalOpen(false);
  }, [
    resetTransactionRequestData,
    resetTransactionPayment,
    resetSelectedExecutionTiming,
    resetExistingPaymentId,
    setIsModalOpen,
  ]);
  const handleModalChoice = useCallback(
    async (choice: 'save' | 'delete') => {
      if (choice === 'save') {
        const payment = {
          amount:
            (transactionRequestData.lock_side ===
            transactionRequestData.payment_currency
              ? transactionRequestData.payment_amount
              : transactionRequestData.settlement_amount) ?? 0,
          cntr_amount:
            (transactionRequestData.lock_side ===
            transactionRequestData.payment_currency
              ? transactionRequestData.settlement_amount
              : transactionRequestData.payment_amount) ?? 0,

          lock_side: transactionRequestData.lock_side,
          buy_currency: transactionRequestData.payment_currency,
          delivery_date:
            transactionRequestData.frequency === 'recurring' ||
            transactionRequestData.frequency === 'installments'
              ? format(new Date(), 'yyyy-MM-dd')
              : getExecutableDateFromValueDate(
                  transactionRequestData?.delivery_date,
                ),

          execution_timing: executionTiming?.value as PangeaExecutionTimingEnum,
          fee_in_bps: transactionRequestData.fees,
          fee: 0,
          name: transactionRequestData.payment_reference,
          destination_account_id:
            transactionRequestData?.paymentDetails?.beneficiary_id ?? null,
          destination_account_method: null,
          origin_account_id:
            transactionRequestData?.settlementDetails?.account_id ?? null,
          origin_account_method: null,
          purpose_of_payment: transactionRequestData.purpose_of_payment,
          sell_currency: transactionRequestData.settlement_currency,
          cashflows: [],
          created: '',
          id: transactionPayment?.id ?? 0,
          installment: transactionRequestData.frequency === 'installments',
          modified: '',
          payment_status: PangeaPaymentStatusEnum.Drafting,
          recurring: transactionRequestData.frequency === 'recurring',
        } as unknown as PangeaPayment;
        if (
          transactionRequestData.frequency === 'recurring' &&
          transactionRequestData?.periodicity
        ) {
          payment.periodicity = transactionRequestData?.periodicity;
          payment.periodicity_end_date =
            transactionRequestData?.periodicity_end_date
              ? format(
                  new Date(transactionRequestData?.periodicity_end_date),
                  'yyyy-MM-dd',
                )
              : null;
          payment.periodicity_start_date =
            transactionRequestData?.periodicity_start_date
              ? format(
                  new Date(transactionRequestData?.periodicity_start_date),
                  'yyyy-MM-dd',
                )
              : null;
        } else if (transactionRequestData.frequency === 'installments') {
          let installments = transactionRequestData.installments
            ? [...transactionRequestData.installments]
            : [];
          installments = installments.map((item) => {
            const cashflow: PangeaPaymentInstallment = {
              amount: item.amount,
              cntr_amount: item.cntr_amount,
              sell_currency: item.sell_currency,
              buy_currency: item.buy_currency,
              date: item.date,
              lock_side: item.lock_side,
            };
            if (item.cashflow_id) {
              cashflow.cashflow_id = item.cashflow_id;
            }
            return cashflow;
          });
          payment.installments = installments;
        }

        let saveDraftResult;
        if (transactionPayment?.id) {
          saveDraftResult = await apiHelper.updatePaymentAsync(
            transactionPayment.id.toString(),
            payment,
          );
        } else {
          saveDraftResult = await apiHelper.createPaymentAsync(payment);
        }

        if (!isError(saveDraftResult)) {
          resetCacheAndUpdateFrequency();
          setTransactionRequestData((prev) => ({
            ...prev,
            frequency: nextFrequency,
          }));
          return;
        }
      } else if (choice === 'delete') {
        // Delete the work
        if (transactionPayment?.id) {
          const deleteDraftResult = await apiHelper.deletePaymentByIdAsync(
            transactionPayment.id,
          );
          if (!isError(deleteDraftResult)) {
            resetCacheAndUpdateFrequency();
            setTransactionRequestData((prev) => ({
              ...prev,
              frequency: nextFrequency,
            }));
            return;
          }
        }
        resetCacheAndUpdateFrequency();
        setTransactionRequestData((prev) => ({
          ...prev,
          frequency: nextFrequency,
        }));
      }
      resetCacheAndUpdateFrequency();
      setTransactionRequestData((prev) => ({
        ...prev,
        frequency: nextFrequency,
      }));
    },
    [
      resetCacheAndUpdateFrequency,
      setTransactionRequestData,
      transactionRequestData.lock_side,
      transactionRequestData.payment_currency,
      transactionRequestData.payment_amount,
      transactionRequestData.settlement_amount,
      transactionRequestData.frequency,
      transactionRequestData?.delivery_date,
      transactionRequestData.fees,
      transactionRequestData.payment_reference,
      transactionRequestData?.paymentDetails?.beneficiary_id,
      transactionRequestData?.settlementDetails?.account_id,
      transactionRequestData.purpose_of_payment,
      transactionRequestData.settlement_currency,
      transactionRequestData?.periodicity,
      transactionRequestData?.periodicity_end_date,
      transactionRequestData?.periodicity_start_date,
      transactionRequestData.installments,
      getExecutableDateFromValueDate,
      executionTiming?.value,
      transactionPayment?.id,
      apiHelper,
      nextFrequency,
    ],
  );

  return (
    <Stack spacing={1} sx={{ minHeight: '445px' }}>
      {editPaymentLoadingState.isLoading ? (
        <PangeaLoading loadingPhrase='Loading ...' centerPhrase />
      ) : (
        <Suspense
          fallback={<PangeaLoading loadingPhrase='Loading ...' centerPhrase />}
        >
          <Stack spacing={2} sx={{ width: '75%', mb: 2 }}>
            <Typography>Frequency</Typography>

            <FeatureFlag
              name='strip-payments'
              fallback={
                <ToggleButtonGroup
                  value={transactionRequestData.frequency}
                  exclusive
                  onChange={(
                    _event: React.MouseEvent<HTMLElement>,
                    passedValue: FrequencyType,
                  ) => {
                    if (
                      passedValue &&
                      passedValue !== transactionRequestData.frequency
                    ) {
                      setTransactionRequestData({
                        ...transactionRequestData,
                        frequency: passedValue,
                      });
                    }
                  }}
                  sx={{
                    '& .MuiButtonBase-root': {
                      width: '50%',
                      fontSize: '16px',
                      borderColor: PangeaColors.BlackSemiTransparent50,
                    },
                  }}
                >
                  <ToggleButton
                    disabled={setToggleButtonStatus('onetime')}
                    value='onetime'
                  >
                    One-time
                  </ToggleButton>
                </ToggleButtonGroup>
              }
            >
              <ToggleButtonGroup
                value={transactionRequestData.frequency}
                exclusive
                onChange={handleToggleFrequencyChange}
                sx={{
                  '& .MuiButtonBase-root': {
                    width: '50%',
                    fontSize: '16px',
                    borderColor: PangeaColors.BlackSemiTransparent50,
                  },
                }}
              >
                <ToggleButton
                  disabled={setToggleButtonStatus('onetime')}
                  value='onetime'
                >
                  One-time
                </ToggleButton>
                <ToggleButton
                  disabled={setToggleButtonStatus('recurring')}
                  value='recurring'
                >
                  Recurring
                </ToggleButton>
                <ToggleButton
                  disabled={setToggleButtonStatus('installments')}
                  value='installments'
                >
                  Installments
                </ToggleButton>
              </ToggleButtonGroup>
            </FeatureFlag>
            <TextField
              id='description'
              label='Description'
              value={transactionRequestData.payment_reference}
              variant='filled'
              onChange={handleDescriptionChange}
              onBlur={() => debouncedOnCreateOrUpdateTransaction()}
            />
          </Stack>
          {transactionRequestData.frequency !== 'installments' && (
            <TransactionAmountControl
              onCreateOrUpdateTransaction={onCreateOrUpdateTransaction}
              transactionRequestData={transactionRequestData}
              setTransactionRequestData={setTransactionRequestData}
              isLoadingCurrency={isLoadingCurrency}
            />
          )}
          {transactionRequestData.frequency == 'onetime' ? (
            <Stack pt={2}>
              <Typography
                variant='body2'
                pb={1}
                color={PangeaColors.BlackSemiTransparent87}
              >
                Value Date
              </Typography>
              <Stack flexDirection='row' alignItems='center' gap={1}>
                <Box flex={1}>
                  <CustomDatePicker
                    isDisabled={fetchingSpotRate}
                    controlDate={transactionRequestData.delivery_date}
                    handleChange={handleValueDateChange}
                    showDateError={false}
                    testId='valueDateInput'
                  />
                </Box>
                {spotRateData &&
                  transactionRequestData.delivery_date &&
                  valueDateType === PangeaDateTypeEnum.SPOT && (
                    <CutoffCountdown cutoffDate={spotRateData.cutoff_time} />
                  )}
              </Stack>
            </Stack>
          ) : transactionRequestData.frequency === 'recurring' ? (
            <Stack width='75%'>
              <RadioGroup
                sx={{ paddingY: 2 }}
                row
                value={endChoiceTabPanel}
                onChange={(_event, val) => handleTabChange(_event, Number(val))}
              >
                <FormControlLabel
                  value={0}
                  control={<Radio />}
                  componentsProps={{ typography: { fontSize: '0.875rem' } }}
                  label='Repeats until date'
                />
                <FormControlLabel
                  value={1}
                  control={<Radio />}
                  componentsProps={{ typography: { fontSize: '0.875rem' } }}
                  label={`Repeats X Times`}
                />
              </RadioGroup>
              <Stack direction='row' spacing={2}>
                <Box>
                  <Typography mb={1} variant='body1'>
                    Starting on
                  </Typography>

                  <CustomDatePicker
                    isDisabled={fetchingSpotRate}
                    controlDate={transactionRequestData.periodicity_start_date}
                    handleChange={handleStartDateChange}
                    showDateError={false}
                    testId='periodicityStartDate'
                    onSelect={handleStartDateChange}
                  />
                </Box>
                <TabPanel value={endChoiceTabPanel} index={0}>
                  <Box>
                    <Typography mb={1} variant='body1'>
                      Ending on
                    </Typography>
                    <CustomDatePicker
                      isDisabled={fetchingSpotRate}
                      controlDate={transactionRequestData.periodicity_end_date}
                      handleChange={handleEndDateChange}
                      showDateError={false}
                      minDate={
                        startDate ? addDays(startDate, 1) : addDays(Today, 1)
                      }
                      maxDate={OneYearFromToday}
                      testId='periodicityEndDate'
                      defaultToSpotDate={false}
                    />
                  </Box>
                </TabPanel>
                <TabPanel value={endChoiceTabPanel} index={1}>
                  <Box>
                    <Typography mb={1} variant='body1'>
                      Ending after
                    </Typography>
                    <TextField
                      label='Occurrences'
                      value={occurrences}
                      onChange={handleEndingAfterChange}
                      inputProps={{
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                        min: 1,
                      }}
                      type='number'
                    />
                  </Box>
                </TabPanel>
              </Stack>
              <Typography mb={1} mt={3} variant='body1'>
                Repeat <span>e</span>
                ver
                <span>y</span>
              </Typography>
              <Stack direction='row' spacing={2} id='controls-and-fallback'>
                <Box width='100%'>
                  <Stack direction='row' spacing={2}>
                    <TextField
                      sx={{ width: '74px' }}
                      label='Interval'
                      value={freq}
                      disabled={
                        freqMeasure === 'quarter' ||
                        freqMeasure === 'bi-monthly'
                      }
                      onChange={(e: any) => {
                        let newValue = e.currentTarget.value;
                        if (!newValue) {
                          newValue = '1';
                        }
                        setFreq(Number(newValue));
                      }}
                    />
                    <FormControl fullWidth>
                      <InputLabel variant='filled'>Frequency</InputLabel>
                      <Select
                        id='recurrence-frequency-measure'
                        label='Frequency'
                        aria-label='frequency measure'
                        value={freqMeasure}
                        onChange={(e: SelectChangeEvent<FreqType>) => {
                          const freqVal = e.target.value as FreqType;
                          setFreqMeasure(freqVal);
                          if (
                            freqVal === 'quarter' ||
                            freqVal === 'bi-monthly'
                          ) {
                            setFreq(1);
                            if (freqVal === 'bi-monthly') {
                              setMonthlyFreq(1);
                              setSecondMonthlyFreq(15);
                            }
                          }
                        }}
                      >
                        <MenuItem value={'day'}>Day{plural}</MenuItem>
                        <MenuItem value={'week'}>Week{plural}</MenuItem>
                        <MenuItem value={'bi-monthly'}>Twice a Month</MenuItem>
                        <MenuItem value={'month'}>Monthly</MenuItem>
                        <MenuItem value={'quarter'}>Quarterly</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                  <Box hidden={freqMeasure != 'week'} mt={3}>
                    <Grid id='weekday-grid' container>
                      <Grid item xl={12}>
                        <Stack direction='row' spacing={1}>
                          <Typography mb={1} variant='body1'>
                            On the following days
                          </Typography>
                          <PangeaTooltip
                            arrow
                            placement='top'
                            title={
                              <Fragment>
                                The day you select represents the transaction
                                value date &#40;i.e. the day the transaction
                                will settle&#41;
                              </Fragment>
                            }
                          >
                            <InfoOutlined
                              sx={{
                                color: PangeaColors.BlackSemiTransparent38,
                              }}
                            />
                          </PangeaTooltip>
                        </Stack>
                        <ToggleButtonGroup
                          color='primary'
                          onChange={(
                            _e: React.MouseEvent<HTMLElement, MouseEvent>,
                            newValues: any,
                          ) => {
                            setDays(newValues);
                          }}
                          value={ensureWeekdayArray(days)}
                        >
                          <ToggleButton value={RRule.MO.weekday} key='1'>
                            Mon
                          </ToggleButton>
                          <ToggleButton value={RRule.TU.weekday} key='2'>
                            Tue
                          </ToggleButton>
                          <ToggleButton value={RRule.WE.weekday} key='3'>
                            Wed
                          </ToggleButton>
                          <ToggleButton value={RRule.TH.weekday} key='4'>
                            Thu
                          </ToggleButton>
                          <ToggleButton value={RRule.FR.weekday} key='5'>
                            Fri
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </Grid>
                    </Grid>
                  </Box>
                  <PangeaErrorFormHelperText
                    text='Please choose a day of the week'
                    visible={showDayErrorMessage}
                  />
                  <Box hidden={freqMeasure != 'month'} mt={1}>
                    <FormControl sx={{ width: '100%' }}>
                      <InputLabel variant='filled'>When</InputLabel>
                      <Select
                        onChange={(e: SelectChangeEvent<number>) => {
                          setMonthlyFreq(parseInt(e.target.value.toString()));
                        }}
                        value={monthlyFreq}
                        fullWidth
                        sx={{ minWidth: 174 }}
                      >
                        {getMonthlyDateOptions().map((val) => {
                          return (
                            <MenuItem
                              key={`mFreq-${val.value}`}
                              value={val.value}
                            >
                              {`${val.label} Business Day`}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box hidden={freqMeasure != 'bi-monthly'} mt={1}>
                    <Stack flexDirection='row' gap={1}>
                      <FormControl sx={{ width: '100%' }}>
                        <InputLabel variant='filled'>First Date</InputLabel>
                        <Select
                          onChange={(e: SelectChangeEvent<number>) => {
                            setMonthlyFreq(parseInt(e.target.value.toString()));
                          }}
                          value={monthlyFreq}
                          fullWidth
                          sx={{ minWidth: 174 }}
                        >
                          {getMonthlyDateOptions().map((val) => {
                            return (
                              <MenuItem
                                key={`mFreq-${val.value}`}
                                value={val.value}
                              >
                                {`${val.label} Business Day`}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                      <FormControl sx={{ width: '100%' }}>
                        <InputLabel variant='filled'>Second Date</InputLabel>
                        <Select
                          onChange={(e: SelectChangeEvent<number>) => {
                            setSecondMonthlyFreq(
                              parseInt(e.target.value.toString()),
                            );
                          }}
                          value={secondMonthlyFreq}
                          fullWidth
                          sx={{ minWidth: 174 }}
                        >
                          {getMonthlyDateOptions(false).map((val) => {
                            return (
                              <MenuItem
                                key={`mFreqSecond-${val.value}`}
                                value={val.value}
                              >
                                {`${val.label} Business Day`}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Stack>
                  </Box>
                  <Box hidden={freqMeasure != 'quarter'} mt={1}>
                    <FormControl sx={{ width: '100%' }}>
                      <InputLabel variant='filled'>
                        Date (every 3 months)
                      </InputLabel>
                      <Select
                        onChange={(e: SelectChangeEvent<number>) => {
                          setMonthlyFreq(parseInt(e.target.value.toString()));
                        }}
                        value={monthlyFreq}
                        fullWidth
                        sx={{ minWidth: 174 }}
                      >
                        {getMonthlyDateOptions().map((val) => {
                          return (
                            <MenuItem
                              key={`mFreqSecond-${val.value}`}
                              value={val.value}
                            >
                              {`${val.label} Business Day`}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </Stack>
              <Stack pt={4} flexDirection='row' width='100%'>
                <Stack
                  width='auto'
                  spacing={3}
                  minWidth='1rem'
                  paddingRight='1.25rem'
                >
                  <Box>
                    <Typography
                      variant='small'
                      color={PangeaColors.BlackSemiTransparent60}
                    >
                      Selling
                    </Typography>
                    <Typography
                      variant='h6'
                      color={PangeaColors.BlackSemiTransparent87}
                    >
                      {`${formatCurrency(
                        transactionRequestData?.settlement_amount * occurrences,
                        transactionRequestData?.settlement_currency,
                        false,
                        sellCurrencyDetails?.unit ?? DEFAULT_ROUNDING,
                        sellCurrencyDetails?.unit ?? DEFAULT_ROUNDING,
                        false,
                        'decimal',
                      )} ${transactionRequestData?.settlement_currency}`}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant='small'
                      color={PangeaColors.BlackSemiTransparent60}
                    >
                      Buying
                    </Typography>
                    <Typography
                      variant='h6'
                      color={PangeaColors.BlackSemiTransparent87}
                    >
                      {`${formatCurrency(
                        transactionRequestData?.payment_amount * occurrences,
                        transactionRequestData?.payment_currency,
                        false,
                        buyCurrencyDetails?.unit ?? DEFAULT_ROUNDING,
                        buyCurrencyDetails?.unit ?? DEFAULT_ROUNDING,
                        false,
                        'decimal',
                      )} ${transactionRequestData?.payment_currency}`}
                    </Typography>
                  </Box>
                </Stack>
                <Stack
                  spacing={3}
                  borderLeft={2}
                  pl={2}
                  borderColor={PangeaColors.Gray}
                >
                  <Box>
                    <Typography
                      variant='small'
                      color={PangeaColors.BlackSemiTransparent60}
                    >
                      Duration
                    </Typography>
                    <Typography
                      variant='h6'
                      color={PangeaColors.BlackSemiTransparent87}
                    >
                      {getDurationText}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant='small'
                      color={PangeaColors.BlackSemiTransparent60}
                    >
                      Occurrences
                    </Typography>
                    {transactionRequestData.frequency === 'recurring' && (
                      <Link
                        display='none'
                        marginLeft='5px'
                        onClick={() => {
                          setShowOccurrences(true);
                        }}
                      >
                        View
                      </Link>
                    )}
                    <Typography
                      variant='h6'
                      color={PangeaColors.BlackSemiTransparent87}
                    >
                      {getOccurenceText}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
              {occurrences > 0 && (
                <Stack
                  borderColor={PangeaColors.SolidSlateMediumSemiTransparent08}
                  marginTop='20px'
                  padding={2}
                  spacing={1}
                  bgcolor={PangeaColors.SkyBlueLight}
                >
                  <Typography
                    variant='body2'
                    color={PangeaColors.BlackSemiTransparent60}
                  >
                    Note: The occurrence dates of the recurring payment can be
                    edited in the next step &#40;Review & Confirm&#41;.
                  </Typography>
                </Stack>
              )}
              <Stack pt={2} display='none'>
                <Stack flexDirection='row' alignItems='center'>
                  <IconButton
                    onClick={() => {
                      setShowOccurrences(!showOccurrences);
                    }}
                  >
                    {showOccurrences ? <ArrowDropDown /> : <ArrowDropUp />}
                  </IconButton>
                  <Typography>View Occurrences </Typography>
                </Stack>
                {showOccurrences && (
                  <Stack pt={1} spacing={1}>
                    {occuringDates
                      .slice(0, occuringDates.length <= 6 ? 6 : 3)
                      .map((val, index) => {
                        return (
                          <Typography
                            variant='body2'
                            color={PangeaColors.BlackSemiTransparent87}
                            key={index}
                          >
                            {val.toDateString()}
                          </Typography>
                        );
                      })}
                    {occuringDates.length > 6 && (
                      <>
                        ...
                        {occuringDates
                          .slice(
                            occuringDates.length - 3,
                            occuringDates.length + 1,
                          )
                          .map((val, index) => {
                            return (
                              <Typography
                                variant='body2'
                                color={PangeaColors.BlackSemiTransparent87}
                                key={index}
                              >
                                {val.toDateString()}
                              </Typography>
                            );
                          })}
                      </>
                    )}
                  </Stack>
                )}
              </Stack>
            </Stack>
          ) : (
            <Stack>
              <PaymentGridInstallment
                rows={transactionRequestData?.installments ?? []}
                onCashflowAdded={(val, isEdit) => {
                  const modifiedInstallment =
                    transactionRequestData.installments
                      ? [...transactionRequestData.installments]
                      : [];
                  if (!isEdit) {
                    val.forEach((newVal) => {
                      modifiedInstallment.push(newVal);
                    });
                  } else {
                    modifiedInstallment[
                      modifiedInstallment.findIndex(
                        (p) => p.cashflow_id == val[0].cashflow_id,
                      )
                    ] = val[0];
                  }

                  setTransactionRequestData({
                    ...transactionRequestData,
                    delivery_date:
                      modifiedInstallment.length > 0
                        ? parse(
                            modifiedInstallment[0].date,
                            'yyyy-MM-dd',
                            new Date(),
                          )
                        : null,
                    settlement_amount: parseFloat(
                      modifiedInstallment
                        .map((item) => item.amount ?? 0)
                        .reduce((prev, curr) => prev + curr, 0)
                        .toFixed(3),
                    ),
                    settlement_currency:
                      modifiedInstallment.length > 0
                        ? modifiedInstallment[0].sell_currency
                        : '',
                    payment_currency:
                      modifiedInstallment.length > 0
                        ? modifiedInstallment[0].buy_currency
                        : '',
                    lock_side:
                      modifiedInstallment.length > 0
                        ? modifiedInstallment[0].lock_side
                        : '',
                    payment_amount: parseFloat(
                      modifiedInstallment
                        .map((item) => item.cntr_amount ?? 0)
                        .reduce((prev, curr) => prev + curr, 0)
                        .toFixed(3),
                    ),
                    installments: modifiedInstallment,
                  });
                  onCreateOrUpdateTransaction({ shouldUpdateBestEx: true });
                }}
                onCashflowDeleted={(val) => {
                  let modifiedInstallment =
                    transactionRequestData?.installments?.filter(function (
                      obj,
                    ) {
                      return obj.cashflow_id && obj.cashflow_id !== val;
                    });
                  modifiedInstallment = modifiedInstallment
                    ? modifiedInstallment
                    : [];

                  setTransactionRequestData({
                    ...transactionRequestData,
                    delivery_date:
                      modifiedInstallment.length > 0
                        ? parse(
                            modifiedInstallment[0].date,
                            'yyyy-MM-dd',
                            new Date(),
                          )
                        : null,
                    settlement_amount: parseFloat(
                      modifiedInstallment
                        .map((item) => item.amount ?? 0)
                        .reduce((prev, curr) => prev + curr, 0)
                        .toFixed(3),
                    ),
                    settlement_currency:
                      modifiedInstallment.length > 0
                        ? modifiedInstallment[0].sell_currency
                        : '',
                    payment_currency:
                      modifiedInstallment.length > 0
                        ? modifiedInstallment[0].buy_currency
                        : '',
                    lock_side:
                      modifiedInstallment.length > 0
                        ? modifiedInstallment[0].lock_side
                        : '',
                    payment_amount: parseFloat(
                      modifiedInstallment
                        .map((item) => item.cntr_amount ?? 0)
                        .reduce((prev, curr) => prev + curr, 0)
                        .toFixed(3),
                    ),
                    installments: modifiedInstallment,
                  });
                  onCreateOrUpdateTransaction({ shouldUpdateBestEx: true });
                }}
                direction={'paying'}
                foreignCurrency={
                  transactionRequestData?.payment_currency ?? 'USD'
                }
                symbol={transactionRequestData?.payment_currency ?? ''}
                sellCurrencyDetails={sellCurrencyDetails}
                buyCurrencyDetails={buyCurrencyDetails}
              />
              <Stack pt={4} flexDirection='row' width='100%'>
                <Stack
                  width='auto'
                  spacing={3}
                  minWidth='1rem'
                  paddingRight='1.25rem'
                >
                  <Box>
                    <Typography
                      variant='small'
                      color={PangeaColors.BlackSemiTransparent60}
                    >
                      Selling
                    </Typography>
                    <Typography
                      variant='h6'
                      color={PangeaColors.BlackSemiTransparent87}
                    >
                      {`${formatCurrency(
                        getInstallmentTotalAmount(),
                        transactionRequestData?.settlement_currency,
                        false,
                        sellCurrencyDetails?.unit ?? DEFAULT_ROUNDING,
                        sellCurrencyDetails?.unit ?? DEFAULT_ROUNDING,
                        false,
                        'decimal',
                      )} ${transactionRequestData?.settlement_currency}`}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant='small'
                      color={PangeaColors.BlackSemiTransparent60}
                    >
                      Buying
                    </Typography>
                    <Typography
                      variant='h6'
                      color={PangeaColors.BlackSemiTransparent87}
                    >
                      {`${formatCurrency(
                        getInstallmentTotalAmount(false),
                        transactionRequestData?.payment_currency,
                        false,
                        buyCurrencyDetails?.unit ?? DEFAULT_ROUNDING,
                        buyCurrencyDetails?.unit ?? DEFAULT_ROUNDING,
                        false,
                        'decimal',
                      )} ${transactionRequestData?.payment_currency}`}
                    </Typography>
                  </Box>
                </Stack>
                <Stack
                  spacing={3}
                  borderLeft={2}
                  pl={2}
                  borderColor={PangeaColors.Gray}
                >
                  <Box>
                    <Typography
                      variant='small'
                      color={PangeaColors.BlackSemiTransparent60}
                    >
                      Duration
                    </Typography>
                    <Typography
                      variant='h6'
                      color={PangeaColors.BlackSemiTransparent87}
                    >
                      {getDurationText}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant='small'
                      color={PangeaColors.BlackSemiTransparent60}
                    >
                      Occurrences
                    </Typography>
                    <Typography
                      variant='h6'
                      color={PangeaColors.BlackSemiTransparent87}
                    >
                      {getOccurenceText}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Stack>
          )}
          <TransactionSettlementControl
            transactionRequestData={transactionRequestData}
            setTransactionRequestData={setTransactionRequestData}
            onCreateOrUpdateTransaction={onCreateOrUpdateTransaction}
          />
        </Suspense>
      )}
      <ConfirmCancelDialog
        title='CHANGE FREQUENCY'
        open={isModalOpen}
        description='You are about to change the transaction frequency, and any unsaved changes will be lost. Would you like to save this as a draft transaction?'
        confirmButtonColorOverride={PangeaColors.CautionYellowMedium}
        onClick={() => handleModalChoice('save')}
        onCancel={() => handleModalChoice('delete')}
        onClose={() => setIsModalOpen(false)}
        cancelButtonText='Delete Draft'
        cancelButtonProps={{ endIcon: null, color: 'warning' }}
        confirmButtonText='Save & Switch'
        preventBackdropClose
        dialogWidth='400px'
      />
    </Stack>
  );
};

export default PaymentDetails;
