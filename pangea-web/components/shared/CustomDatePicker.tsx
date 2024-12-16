import { Box, FormControl, Stack, Typography } from '@mui/material';
import { DesktopDatePicker, PickersActionBarProps } from '@mui/x-date-pickers';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import {
  allValueDatesState,
  clientApiState,
  pangeaAlertNotificationMessageState,
  transactionRequestDataState,
  valueDateRefreshIntervalState,
  valueDateTypeState,
} from 'atoms';
import {
  addDays,
  addMonths,
  format,
  isWithinInterval,
  lastDayOfMonth,
  parseISO,
  startOfMonth,
} from 'date-fns';
import { useWalletAndPaymentHelpers } from 'hooks';
import {
  PangeaDateTypeEnum,
  TransactionRequestData,
  getOneYearFromToday,
  getStartOfToday,
} from 'lib';
import { isError } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { PangeaColors } from 'styles';
import PangeaLoading from './PangeaLoading';
import PangeaTooltip from './PangeaTooltip';

interface CustomDatePickerProps {
  handleChange: any;
  showDateError: boolean;
  controlDate?: Date | null;
  customInput?: boolean;
  isDisabled?: boolean;
  controlWidth?: string;
  testId?: string;
  minDate?: Date;
  maxDate?: Date;
  onSelect?: (date: Date) => void;
  defaultToSpotDate?: boolean;
}

type MappedValueDays = {
  [key: string]: Array<{
    date: string;
    value: number;
    date_type: string;
    fee_unit: string;
    fee: number;
    tradable: boolean;
  }>;
};

function ActionList(props: PickersActionBarProps) {
  const { className } = props;
  const actions = [
    {
      text: 'Expedited Delivery',
      color: PangeaColors.RiskBerryLight,
    },
    {
      text: 'Standard Delivery',
      color: PangeaColors.SecurityGreenLight,
    },
    { text: 'UnAvailable Dates', color: '#0000000A' },
  ];
  return (
    <Stack className={className} pb={2}>
      {actions.map(({ color, text }, index) => {
        return (
          <Stack
            key={index}
            flexDirection={'row'}
            alignItems={'center'}
            pl={2}
            gap={1}
          >
            <Box
              key={index}
              bgcolor={color}
              sx={{ width: 16, height: 16 }}
            ></Box>
            <Typography sx={{ fontSize: 12 }} textTransform={'uppercase'}>
              {text}
            </Typography>
          </Stack>
        );
      })}
    </Stack>
  );
}
function ButtonField(props: any) {
  const { setOpen, InputProps: { ref } = { ref } } = props;

  return (
    <Typography
      ref={ref}
      onClick={() => setOpen?.((prev: boolean) => !prev)}
      style={{ cursor: 'pointer' }}
      variant='dataBody'
      color={PangeaColors.EarthBlueDark}
    >
      Edit
    </Typography>
  );
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  controlDate,
  handleChange,
  showDateError,
  customInput,
  isDisabled,
  controlWidth = '270px',
  testId = 'customDatePicker',
  minDate,
  maxDate,
  onSelect,
  defaultToSpotDate = true,
}) => {
  const [loading, setLoading] = useState(false);
  const OneYearFromToday = useMemo(() => getOneYearFromToday(), []);
  const [mappedValueDays, setMappedValueDays] = useState<MappedValueDays>({});
  const [allValueDates, setAllValueDates] = useRecoilState(allValueDatesState);
  const authHelper = useRecoilValue(clientApiState);
  const setValueDateType = useSetRecoilState(valueDateTypeState);
  const valueDateRefreshInterval = useRecoilValue(
    valueDateRefreshIntervalState,
  );

  const [open, setOpen] = useState(false);
  const {
    paymentSpotRateRequestPayload,
    allWallets,
    settlementAccounts,
    beneficiaryAccounts,
    getOriginAccountMethod,
    getDestinationAccountMethod,
  } = useWalletAndPaymentHelpers();
  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );
  function ServerDay(props: PickersDayProps<Date>) {
    const [transactionRequestData, setTransactionRequestData] = useRecoilState(
      transactionRequestDataState,
    );
    const { day, outsideCurrentMonth, onDaySelect } = props;
    const dayValueDate = allValueDates.find(
      (dayInMonth) => dayInMonth.date === format(new Date(day), 'yyyy-MM-dd'),
    );
    const isActiveDay =
      day.toLocaleDateString() === controlDate?.toLocaleDateString();
    const isExpedited =
      dayValueDate?.date_type === PangeaDateTypeEnum.EXPEDITED;
    const isTradeDate =
      dayValueDate?.date_type === PangeaDateTypeEnum.TRADE_DATE;
    const isWeekend = [0, 6].includes(day.getDay());
    const isTradable = dayValueDate?.tradable;
    const isWithinMinAndMax = isWithinInterval(day, {
      start: minDate ?? getStartOfToday(),
      end: maxDate ?? OneYearFromToday,
    });
    const handleValueDateSelect = useCallback(
      (date: Date | null) => {
        if (date) {
          onDaySelect(date);
          const originAccount =
            allWallets?.find(
              (wallet) =>
                wallet.wallet_id ===
                transactionRequestData.settlementDetails?.account_id,
            ) ??
            settlementAccounts?.find(
              (account) =>
                account.wallet_id ===
                transactionRequestData.settlementDetails?.account_id,
            );
          const destinationAccount =
            beneficiaryAccounts?.find(
              (account) =>
                account.beneficiary_id ===
                transactionRequestData.paymentDetails?.beneficiary_id,
            ) ??
            allWallets?.find(
              (wallet) =>
                wallet.wallet_id ===
                transactionRequestData.paymentDetails?.beneficiary_id,
            );

          if (
            [
              PangeaDateTypeEnum.SPOT,
              PangeaDateTypeEnum.EXPEDITED,
              PangeaDateTypeEnum.MAX_DATE,
            ].includes(dayValueDate?.date_type as PangeaDateTypeEnum)
          ) {
            setValueDateType(PangeaDateTypeEnum.SPOT);
            setTransactionRequestData(
              (prev) =>
                ({
                  ...prev,
                  origin_account_method: getOriginAccountMethod(originAccount),
                  destination_account_method:
                    getDestinationAccountMethod(destinationAccount),
                } as TransactionRequestData),
            );
          } else {
            setValueDateType(PangeaDateTypeEnum.FORWARD);
            setTransactionRequestData(
              (prev) =>
                ({
                  ...prev,
                  origin_account_method: getOriginAccountMethod(originAccount),
                  destination_account_method:
                    getDestinationAccountMethod(destinationAccount),
                } as TransactionRequestData),
            );
          }
        }
      },
      [
        dayValueDate?.date_type,
        onDaySelect,
        setTransactionRequestData,
        transactionRequestData.paymentDetails?.beneficiary_id,
        transactionRequestData.settlementDetails?.account_id,
      ],
    );
    return (
      <Box
        sx={{
          position: 'relative',
          cursor: isTradable ? 'pointer' : 'not-allowed',
        }}
        borderRadius={'2px'}
        key={props.day.toString()}
        display={'flex'}
        flexDirection={'column'}
        margin='0 .5px'
        bgcolor={
          isActiveDay
            ? PangeaColors.SolidSlateDarker
            : isExpedited && isTradable
            ? PangeaColors.RiskBerryLight
            : !isExpedited &&
              isTradable &&
              !outsideCurrentMonth &&
              isWithinMinAndMax
            ? PangeaColors.SecurityGreenMedium
            : 'transparent'
        }
      >
        <PangeaTooltip placement='top' title={dayValueDate?.date_type} arrow>
          <span>
            <PickersDay
              disableMargin
              outsideCurrentMonth={outsideCurrentMonth}
              day={day}
              disabled={
                day < addDays(new Date(), -1) ||
                isWeekend ||
                !isTradable ||
                !isWithinMinAndMax
              }
              disableHighlightToday
              isFirstVisibleCell={false}
              isLastVisibleCell={false}
              onDaySelect={handleValueDateSelect}
              sx={{
                cursor: isTradable ? 'pointer' : 'not-allowed',
                color: isActiveDay
                  ? PangeaColors.LightPrimaryContrast
                  : isTradeDate
                  ? `${PangeaColors.Black}!important`
                  : 'inherit',
                textDecoration: isTradeDate ? `underline` : 'none',
                fontWeight: isTradeDate ? 600 : 400,
                pointerEvents: isTradeDate ? 'all!important' : 'inherit',
              }}
            />
          </span>
        </PangeaTooltip>

        {isExpedited && isTradable ? (
          <Typography
            onClick={() => {
              onDaySelect(day);
            }}
            color={
              isActiveDay
                ? PangeaColors.LightPrimaryContrast
                : PangeaColors.BlackSemiTransparent38
            }
            sx={{
              fontSize: 6,
              position: 'absolute',
              bottom: -3.5,
              alignSelf: 'center',
              cursor: isTradable ? 'pointer' : 'not-allowed',
            }}
          >
            +{dayValueDate?.date} {dayValueDate?.fee_unit}
          </Typography>
        ) : null}
      </Box>
    );
  }
  const calendarApiCall = useCallback(
    async (startDate: Date, monthsAhead: number) => {
      const [source, destination] = [
        paymentSpotRateRequestPayload.buy_currency,
        paymentSpotRateRequestPayload.sell_currency,
      ];
      const firstDayOfMonth = startOfMonth(new Date(startDate));
      setLoading(true);

      const api = authHelper.getAuthenticatedApiHelper();
      const result = await api.getPaymentCalendarValues({
        pair: `${source}${destination}`,
        start_date: format(firstDayOfMonth, 'yyyy-MM-dd'),
        end_date: format(
          lastDayOfMonth(addMonths(firstDayOfMonth, monthsAhead)),
          'yyyy-MM-dd',
        ),
      });
      if (result && !isError(result)) {
        const newDays: MappedValueDays = {};
        const firstTradableDate = result.dates.find(
          (day) => day.tradable === true,
        );
        if (firstTradableDate && !controlDate && defaultToSpotDate) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          handleChange(parseISO(firstTradableDate.executable_time!));
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          onSelect?.(parseISO(firstTradableDate.executable_time!));
          setValueDateType(firstTradableDate.date_type);
        }
        if (controlDate) {
          const controlDateValue = result.dates.find(
            (day) => day.date === format(controlDate, 'yyyy-MM-dd'),
          );
          if (controlDateValue) {
            setValueDateType(controlDateValue.date_type);
          }
        }
        [...result.dates].forEach((day) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          newDays[startOfMonth(parseISO(day.executable_time!)).toString()] = [
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            ...(newDays[
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              startOfMonth(parseISO(day.executable_time!)).toString()
            ] ?? []),
            {
              date: day.date,
              value: day.fee,
              date_type: day.date_type,
              fee_unit: day.fee_unit,
              fee: day.fee,
              tradable: day.tradable,
            },
          ];
        });
        setAllValueDates(result.dates);
        setMappedValueDays({
          ...mappedValueDays,
          ...newDays,
        });
      } else {
        setPangeaAlertNotificationMessage({
          severity: 'error',
          text: 'There was an error getting delivery dates',
        });
      }
      setLoading(false);
    },
    [
      paymentSpotRateRequestPayload.buy_currency,
      paymentSpotRateRequestPayload.sell_currency,
      authHelper,
      controlDate,
      setAllValueDates,
      mappedValueDays,
      handleChange,
      setValueDateType,
      defaultToSpotDate,
      onSelect,
      setPangeaAlertNotificationMessage,
    ],
  );
  const refetchValueDate = useCallback(() => {
    if (
      paymentSpotRateRequestPayload.buy_currency &&
      paymentSpotRateRequestPayload.sell_currency
    ) {
      setMappedValueDays({});
      calendarApiCall(controlDate ?? new Date(), 12);
    }
  }, [
    calendarApiCall,
    controlDate,
    paymentSpotRateRequestPayload.buy_currency,
    paymentSpotRateRequestPayload.sell_currency,
  ]);
  useEffect(() => {
    const intervalId = setInterval(
      refetchValueDate,
      valueDateRefreshInterval * 60 * 1000,
    ); // convert minutes to milliseconds
    // Clear interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    valueDateRefreshInterval,
    paymentSpotRateRequestPayload.buy_currency,
    paymentSpotRateRequestPayload.sell_currency,
  ]);
  return (
    <FormControl data-testid={testId}>
      <DesktopDatePicker
        loading={loading}
        renderLoading={() => <PangeaLoading />}
        label='Payment Date'
        format='MM/dd/yyyy'
        value={controlDate}
        minDate={minDate ?? getStartOfToday()}
        maxDate={maxDate ?? OneYearFromToday}
        onChange={handleChange}
        views={['year', 'month', 'day']}
        reduceAnimations
        onClose={() => setOpen(false)}
        onMonthChange={(val) => {
          calendarApiCall(val, 12);
        }}
        onOpen={async () => {
          setOpen(true);
          calendarApiCall(new Date(), 12);
        }}
        open={open}
        slotProps={{
          textField: {
            variant: 'filled',
            sx: {
              width: controlWidth,
              '& .MuiInputBase-root.Mui-disabled': {
                bgcolor: 'rgba(0, 0, 0, 0.06)!important',
                color: 'rgba(0, 0, 0, 0.87)!important',
                '-webkit-text-fill-color': 'rgba(0, 0, 0, 0.87)!important',
              },
              '& .Mui-disabled, & .Mui-disabled > .MuiInputBase-root > input': {
                color: 'rgba(0, 0, 0, 0.87)!important',
                '-webkit-text-fill-color': 'rgba(0, 0, 0, 0.87)!important',
              },
            },
            error: showDateError,
            disabled: true,
          },
          popper: {
            modifiers: [
              {
                name: 'viewHeightModifier',
                enabled: true,
                phase: 'beforeWrite',
                fn: ({ state }: { state: Partial<any> }) => {
                  state.styles.popper.height = '320px';
                  if (state.placement.includes('top-start')) {
                    state.styles.popper = {
                      ...state.styles.popper,
                      display: 'flex',
                      alignItems: 'flex-end',
                    };
                  }
                  if (state.placement.includes('bottom')) {
                    state.styles.popper = {
                      ...state.styles.popper,
                      display: 'block',
                    };
                  }
                },
              },
            ],
          },
          day: {} as any,
          field: {
            setOpen: (val: boolean) => {
              if (val) {
                calendarApiCall(new Date(), 12);
              }
              setOpen(val);
            },
          } as any,
        }}
        slots={{
          ...(customInput && { field: ButtonField }),
          day: ServerDay,
          actionBar: ActionList,
        }}
        disabled={isDisabled}
      />
    </FormControl>
  );
};
export default CustomDatePicker;
