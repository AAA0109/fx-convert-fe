import { FormControl } from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import {
  AnyHedgeItem,
  Cashflow,
  HedgeItemComponentProps,
  formatDateToMonthDayYear,
  getEarliestAllowableStartDate,
  getOneYearFromToday,
  getStartOfToday,
  standardizeDate,
} from 'lib';
import { isError, isNull } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { FeatureFlag, PangeaErrorFormHelperText } from '../shared';
import { clientApiState } from 'atoms';
import { useRecoilValue } from 'recoil';
import { addDays, getDay } from 'date-fns';

export const CreateHedgeDatePicker = (props: HedgeItemComponentProps) => {
  const formControlProps = props.ControlProps;
  const authHelper = useRecoilValue(clientApiState);
  const MinStartDate = useMemo(() => getEarliestAllowableStartDate(), []);
  const handlePropChange = useEventCallback(
    (callback: (hedgeItem: AnyHedgeItem) => void) => {
      if (!props.value || !props.onChange) {
        return;
      }
      const hedgeItem = props.value.clone();
      callback(hedgeItem);
      props.onChange(hedgeItem);
    },
  );
  const OneYearFromToday = useMemo(() => getOneYearFromToday(), []);
  const [maxEndDate, setMaxEndDate] = useState(OneYearFromToday);
  const handlePaymentDateChange = (newValue: Nullable<Date>) => {
    handlePropChange(
      (hedgeItem) =>
        ((hedgeItem as Cashflow).date = isNull(newValue)
          ? new Date(0)
          : standardizeDate(newValue)),
    );
  };
  const cashflowDate = (props.value as Cashflow)?.date;

  const controlDate = Number(cashflowDate) == 0 ? null : cashflowDate;
  const showDateError =
    !props.isValidForm && (!controlDate || controlDate < MinStartDate);
  const errorText = `Please select a payment date that is a between ${formatDateToMonthDayYear(
    MinStartDate,
  )} and ${formatDateToMonthDayYear(OneYearFromToday)}.`;

  const isWeekend = (date: Date) => {
    const day = getDay(date);

    return day === 0 || day === 6;
  };
  useEffect(() => {
    const getCompanyAsync = async () => {
      const api = authHelper.getAuthenticatedApiHelper();
      const compData = await api.getCompanyAsync();
      if (!isError(compData)) {
        setMaxEndDate(
          addDays(getStartOfToday(), compData.settings.corpay.max_horizon),
        );
      }
    };
    getCompanyAsync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FeatureFlag
      name='cashflow-validate-end-date'
      fallback={
        <DesktopDatePicker
          label='Payment Date'
          format='MM/dd/yyyy'
          value={controlDate}
          maxDate={maxEndDate}
          onChange={handlePaymentDateChange}
          shouldDisableDate={isWeekend}
          slotProps={{
            textField: {
              variant: 'filled',
              sx: { width: 172 },
              error: showDateError,
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
          }}
        />
      }
    >
      <FormControl {...formControlProps} sx={{ m: 1, ...formControlProps?.sx }}>
        <DesktopDatePicker
          label='Payment Date'
          format='MM/dd/yyyy'
          value={controlDate}
          minDate={MinStartDate}
          maxDate={OneYearFromToday}
          onChange={handlePaymentDateChange}
          shouldDisableDate={isWeekend}
          views={['year', 'month', 'day']}
          reduceAnimations
          slotProps={{
            textField: {
              variant: 'filled',
              sx: { width: 270 },
              error: showDateError,
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
          }}
        />
        <PangeaErrorFormHelperText text={errorText} visible={showDateError} />
      </FormControl>
    </FeatureFlag>
  );
};
export default CreateHedgeDatePicker;
