import {
  Alert,
  Box,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Stack,
  SxProps,
  Tab,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  DesktopDatePicker,
  DesktopDatePickerSlotsComponentsProps,
} from '@mui/x-date-pickers/DesktopDatePicker';
import { isLastDayOfMonth } from 'date-fns';
import {
  AnyHedgeItem,
  Cashflow,
  HedgeItemComponentProps,
  getDisplayOrdinalWeekdayFromDate,
  getFirstBusinessDayOfFollowingWeek,
  getOneYearFromToday,
  getOrdinalOfWeekdayFromDate,
  getStartOfToday,
  getWeekdayName,
  isLastWeekdayOfMonth,
  standardizeDate,
} from 'lib';
import { isNull, isNumber, isUndefined, range } from 'lodash';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  ByWeekday,
  RRule,
  Options as RuleOptions,
  Weekday,
  WeekdayStr,
} from 'rrule';
import { PangeaColors } from 'styles';
import { PangeaErrorFormHelperText, TabPanel } from '../shared';

export type MonthlyFrequencyType =
  | 'specific-date'
  | 'specific-relative'
  | 'specific-ordinal'
  | 'relative-lastofmonth';
type FreqType =
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'year';
export type RecurringHedgeDatePickerProps = {
  value: Nullable<Date>;
  minDate: Date;
  maxDate: Date;
  onChange: (date: Nullable<Date>) => void;
  onError?: () => void;
  slotProps?: DesktopDatePickerSlotsComponentsProps<Date>;
};

const RecurringHedgeDatePicker = ({
  value,
  minDate,
  maxDate,
  onChange,
  onError,
  slotProps,
}: RecurringHedgeDatePickerProps): JSX.Element => {
  return (
    <DesktopDatePicker
      value={value}
      format='MM/dd/yyyy'
      views={['year', 'month', 'day']}
      reduceAnimations
      minDate={minDate}
      maxDate={maxDate}
      onChange={onChange}
      onError={onError}
      slotProps={{
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
        ...slotProps,
      }}
    />
  );
};

export const CreateHedgeRecurringCashFlowToggle = (
  props: HedgeItemComponentProps,
) => {
  const freqMeasureFromPattern = (pattern: NullableString): FreqType => {
    if (!pattern) return 'day';
    const rule = RRule.fromString(pattern);
    if (!rule) return 'day';
    return ['year', 'month', 'week', 'day'][rule.options.freq] as FreqType;
  };
  const freqTypeFromRuleOptions = (
    rule: Optional<RuleOptions>,
    pattern: NullableString,
  ): MonthlyFrequencyType => {
    if (rule) {
      if (rule.bymonthday) {
        return (pattern?.indexOf('BYMONTHDAY=-1') ?? 0) > 0
          ? 'relative-lastofmonth'
          : 'specific-date';
      }
      if (rule.bynweekday) {
        if ((pattern?.indexOf('BYDAY=-1') ?? 0) > 0) {
          return 'specific-relative';
        } else {
          return 'specific-ordinal';
        }
      }
    }
    return 'specific-date';
  };
  const { isValidForm = true } = props;
  const cashflow = useMemo(() => props.value as Cashflow, [props.value]);
  const [pattern, setPattern] = useState<NullableString>(
    cashflow.recurrenceData?.pattern,
  );
  const [rrule, setRrule] = useState(
    pattern ? RRule.fromString(pattern) : null,
  );

  type EndByType = Nullable<Date | number>;
  const handlePropChange = (callback: (hedgeItem: AnyHedgeItem) => void) => {
    if (!props.value || !props.onChange) {
      return;
    }
    const hedgeItem = props.value.clone();
    callback(hedgeItem);
    props.onChange(hedgeItem);
  };
  const handleRecurrenceChange = (pattern: NullableString) =>
    handlePropChange((hedgeItem) => {
      (hedgeItem as Cashflow).recurrenceData = { pattern };
    });
  const [endChoice, setEndChoice] = useState<string>(
    rrule?.origOptions.count ? 'after' : 'by',
  );
  const [endChoiceTabPanel, setEndChoiceTabPanel] = useState<number>(
    endChoice == 'by' ? 0 : 1,
  );
  function handleTabChange(_event: React.SyntheticEvent, newValue: number) {
    setEndChoice(newValue == 0 ? 'by' : 'after');
    setEndChoiceTabPanel(newValue);
  }
  const [freq, setFreq] = useState(rrule?.origOptions.interval ?? 1);
  const [fallbackChoice, setFallbackChoice] = useState<'fallback' | 'static'>(
    isNumber(rrule?.origOptions.bysetpos) &&
      isNumber(rrule?.origOptions.bymonthday)
      ? 'fallback'
      : 'static',
  );
  const plural = freq > 1 ? 's' : '';
  const [days, setDays] = useState<
    Nullable<number[] | ByWeekday | ByWeekday[]>
  >(rrule?.origOptions.byweekday ?? null);
  const [errorMsg, setErrorMsg] = useState<NullableString>(null);

  const [freqMeasure, setFreqMeasure] = useState<FreqType>(
    freqMeasureFromPattern((props.value as Cashflow).recurrenceData?.pattern),
  );
  const Today = useMemo(() => getStartOfToday(), []);
  const MinStartDate = useMemo(
    () => standardizeDate(getFirstBusinessDayOfFollowingWeek(Today)),
    [Today],
  );
  const [monthlyFreq, setMonthlyFreq] = useState<MonthlyFrequencyType>(
    freqTypeFromRuleOptions(rrule?.options, pattern),
  );
  // if there is a value for endDate and it is not undefined and it is greater that the MinStartDate, the use it. (default is 12/31/1969 and we don't want that)
  // otherwise, use the MinStartDate
  const [endBy, setEndBy] = useState<Nullable<Date>>(
    !isUndefined(props.value) &&
      !isUndefined(props.value?.endDate) &&
      Number(props.value?.endDate) >= MinStartDate.getTime()
      ? props.value.endDate
      : MinStartDate,
  );
  const [startDate, setStartDate] = useState(
    (props.value as Cashflow).recurrenceData?.startDate ?? MinStartDate,
  );
  const [occurrences, setOccurrences] = useState(
    (props.value as Cashflow).recurrenceData?.numOccurrences ?? 1,
  );
  const OneYearFromToday = useMemo(() => getOneYearFromToday(), []);

  const specificDateChoice = `Monthly on day ${startDate.getDate()}`;
  const ordinalDateChoice = `Monthly on the ${getDisplayOrdinalWeekdayFromDate(
    startDate,
  )}`;
  const relativeDateChoice = `Monthly on the last ${getWeekdayName(startDate)}`;
  const getLastOccurrence = (rule: RRule): Date => {
    if (!rule) {
      return Today;
    }
    const allOccurrences = rule.all();
    return allOccurrences[allOccurrences.length - 1];
  };
  const buildRRule = (): [RRule | null, EndByType | null] => {
    let endby: EndByType = null;
    const ruleOptions: Partial<RuleOptions> = {
      freq: {
        hour: RRule.HOURLY,
        minute: RRule.MINUTELY,
        second: RRule.SECONDLY,
        day: RRule.DAILY,
        week: RRule.WEEKLY,
        month: RRule.MONTHLY,
        year: RRule.YEARLY,
      }[freqMeasure],
      interval: freq,
      dtstart: startDate,
    };
    if (!startDate || isNaN(startDate.getDate())) {
      return [null, null];
    }

    switch (freqMeasure) {
      case 'week': {
        if (days && Array.isArray(days)) {
          ruleOptions.byweekday = [...new Set<ByWeekday>(days)];
        } else if (!!days && !Array.isArray(days)) {
          ruleOptions.byweekday = days;
        }

        break;
      }
      case 'month': {
        const rruleDow = [
          RRule.SU,
          RRule.MO,
          RRule.TU,
          RRule.WE,
          RRule.TH,
          RRule.FR,
          RRule.SA,
        ][startDate.getDay()];
        switch (monthlyFreq) {
          case 'specific-date': {
            if (fallbackChoice == 'static') {
              ruleOptions.bymonthday = startDate.getDate();
            } else {
              ruleOptions.bymonthday = range(28, startDate.getDate() + 1); //range end is not inclusive.
              ruleOptions.bysetpos = -1;
            }

            break;
          }
          case 'specific-ordinal': {
            const ordinalDow = getOrdinalOfWeekdayFromDate(startDate);
            ruleOptions.byweekday = rruleDow.nth(ordinalDow);
            break;
          }
          case 'specific-relative': {
            ruleOptions.byweekday = rruleDow.nth(-1);
            break;
          }
          case 'relative-lastofmonth': {
            ruleOptions.bymonthday = -1;
            break;
          }
        }
        break;
      }
    }
    switch (endChoice) {
      case 'after': {
        if (occurrences < 1) {
          return [null, null];
        }
        ruleOptions.count = occurrences;
        endby = occurrences;
        break;
      }
      case 'by': {
        if (!endBy || isNaN(endBy.getDate())) {
          return [null, null];
        }
        ruleOptions.until = endBy;
        endby = endBy;
        break;
      }
      default: {
        endby = null;
        break;
      }
    }
    return [new RRule(ruleOptions), endby];
  };

  const checkValidity = (): [boolean, NullableString, Nullable<RRule>] => {
    const startOfStartDate = standardizeDate(startDate);
    if (isNull(endBy) || isNaN(endBy.getDate())) {
      return [false, 'End date is not a valid date.', null];
    }
    if (
      endBy &&
      endChoice == 'by' &&
      standardizeDate(endBy) < startOfStartDate
    ) {
      return [false, 'Start date must come before end date.', null];
    }

    if (startOfStartDate > OneYearFromToday) {
      return [
        false,
        `Start date must come before ${OneYearFromToday.toLocaleDateString()}.`,
        null,
      ];
    }

    if (props.mode === 'create' && startOfStartDate < MinStartDate) {
      return [
        false,
        `Start date must come after ${MinStartDate.toLocaleDateString()}.`,
        null,
      ];
    }

    if (startDate.getTime() === endBy.getTime() && endChoice == 'by') {
      return [false, 'Start date and end date cannot be the same.', null];
    }

    // Not allowing infinite recurrence in this release.
    if (endChoice == 'never') {
      return [
        false,
        `Recurrence end type must be set to 'By' or 'After'.`,
        null,
      ];
    }

    const [rule] = buildRRule();
    if (!rule) {
      return [
        false,
        'Invalid settings. Please correct the settings below.',
        null,
      ];
    }
    const lastOccurrenceDate = standardizeDate(getLastOccurrence(rule));
    if (lastOccurrenceDate < MinStartDate) {
      return [
        false,
        `Occurrences of this series come before the minimum start date (${MinStartDate.toLocaleDateString()}).`,
        null,
      ];
    }
    if (lastOccurrenceDate > OneYearFromToday) {
      return [
        false,
        `Occurrences of this series extend beyond 1 year. Shorten the \
        recurrence to make sure all occurrences are before \
        ${OneYearFromToday.toLocaleDateString()}.`,
        null,
      ];
    }

    return [true, null, rule];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };
  const checkIsValid = () => {
    const [formIsValid, errorMessage, rule] = checkValidity();
    //if (formIsValid != canClickOk) {
    //setCanClickOk(formIsValid);
    props.setValidStatus?.(formIsValid);
    if (
      formIsValid &&
      (isNull(rule) !== isNull(pattern) || pattern != rule?.toString()) &&
      !!rule
    ) {
      const newPattern = rule.toString();
      if (newPattern !== pattern) {
        setPattern(newPattern);
        setRrule(rule);
        handleRecurrenceChange(newPattern);
      }
    } else if (!formIsValid && pattern !== null) {
      setPattern(null);
      setRrule(null);
    }

    if (errorMsg !== errorMessage) {
      setErrorMsg(errorMessage);
    }
  };
  const handleStartDateChange = useCallback(
    (newValue: Nullable<Date>) => {
      if (isNull(newValue)) {
        newValue = MinStartDate;
      }
      newValue = standardizeDate(newValue);
      setStartDate(newValue);
      if (newValue.getDate() < 29) {
        setFallbackChoice('static');
      }
      if (!endBy) {
        setEndBy(newValue);
        return;
      }

      if (endBy < Date.Max(newValue, MinStartDate)) {
        setEndBy(Date.Max(newValue, MinStartDate));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setStartDate, setEndBy],
  );
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(checkIsValid, [
    endBy,
    endChoice,
    freq,
    days,
    freqMeasure,
    monthlyFreq,
    fallbackChoice,
    startDate,
    occurrences,
  ]);

  const showDayErrorMessage =
    !isValidForm &&
    freqMeasure === 'week' &&
    (!days || Object.keys(days).length === 0);
  const selectedRadioStyle: SxProps = {
    borderRadius: '4px',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: PangeaColors.SolidSlateLighter,
    backgroundColor: PangeaColors.BlackSemiTransparent12,
  };

  return (
    <Box>
      <Typography mb={1} variant='body1'>
        This cash flow:
      </Typography>
      <Tabs
        sx={{
          borderRadius: '4px',
          marginBottom: '32px',
          border: `1px solid ${PangeaColors.BlackSemiTransparent50}`,
          '& .MuiTab-root': {
            width: '50%',
            color: PangeaColors.SolidSlateMedium,
            fontWeight: 500,
          },
          '& .MuiTabs-indicator': {
            display: 'none',
          },
          '& .Mui-selected': {
            backgroundColor: PangeaColors.BlackSemiTransparent12,
          },
        }}
        value={endChoiceTabPanel}
        onChange={handleTabChange}
      >
        <Tab label='Repeats until date' />
        <Tab label='Repeats X Times' />
      </Tabs>
      {!!errorMsg && (
        <Box width={'100%'} sx={{ maxWidth: 'fit-content' }}>
          <Alert severity='error' variant='outlined'>
            {errorMsg}
          </Alert>
        </Box>
      )}
      <Stack direction={'row'} spacing={2}>
        <Box width={'160px'}>
          <Typography mb={1} variant='body1'>
            Starting on
          </Typography>
          <RecurringHedgeDatePicker
            value={startDate}
            minDate={props.mode === 'manage' ? new Date(0) : MinStartDate}
            maxDate={OneYearFromToday}
            onChange={useCallback(
              (date: Nullable<Date>) => {
                handleStartDateChange(date);
              },
              [handleStartDateChange],
            )}
            slotProps={{
              textField: {
                variant: 'filled',
                error:
                  (props.mode === 'create' && startDate < MinStartDate) ||
                  (startDate === endBy && endChoice == 'by'),
              },
            }}
          />
        </Box>
        <TabPanel value={endChoiceTabPanel} index={0}>
          <Box width={'160px'}>
            <Typography mb={1} variant='body1'>
              Ending on
            </Typography>
            <RecurringHedgeDatePicker
              // eslint-disable-next-line react-hooks/exhaustive-deps
              onError={useCallback(() => checkIsValid(), [])}
              value={endBy}
              minDate={Date.Max(startDate, MinStartDate)}
              maxDate={OneYearFromToday}
              slotProps={{
                textField: {
                  variant: 'filled',
                  error: (!!endBy && endBy < startDate) || startDate === endBy,
                },
              }}
              onChange={useCallback(
                (date: Nullable<Date>) => {
                  if (!date) {
                    date = OneYearFromToday;
                  }
                  setEndBy(standardizeDate(date));
                },
                [OneYearFromToday],
              )}
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
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const o = parseInt(e.currentTarget.value);
                if (!isNaN(o)) {
                  setOccurrences(o);
                }
              }}
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
        Repeat{' '}
        <Tooltip title={pattern}>
          <span>e</span>
        </Tooltip>
        ver
        <Tooltip title={rrule?.toText()}>
          <span>y</span>
        </Tooltip>
      </Typography>

      <Stack direction={'row'} spacing={2} id='controls-and-fallback'>
        <Box>
          <Stack direction={'row'} spacing={2}>
            <TextField
              sx={{ width: '74px' }}
              label='Interval'
              value={freq}
              onChange={useCallback((e: any) => {
                let newValue = e.currentTarget.value;
                if (!newValue) {
                  newValue = '1';
                }
                setFreq(Number(newValue));
              }, [])}
            />
            <FormControl>
              <InputLabel variant='filled'>Frequency</InputLabel>
              <Select
                id='recurrence-frequency-measure'
                label='Frequency'
                aria-label='frequency measure'
                value={freqMeasure}
                onChange={useCallback((e: SelectChangeEvent<FreqType>) => {
                  setFreqMeasure(e.target.value as FreqType);
                }, [])}
              >
                <MenuItem value={'day'}>Day{plural}</MenuItem>
                <MenuItem value={'week'}>Week{plural}</MenuItem>
                <MenuItem value={'month'}>Month{plural}</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Box hidden={freqMeasure != 'week'} mt={3}>
            <Grid id='weekday-grid' container>
              <Grid item xl={12}>
                <Typography mb={1} variant='body1'>
                  On the following days
                </Typography>
                <ToggleButtonGroup
                  color='primary'
                  onChange={useCallback(
                    (
                      _e: React.MouseEvent<HTMLElement, MouseEvent>,
                      newValues: any,
                    ) => {
                      setDays(newValues);
                    },
                    [],
                  )}
                  value={ensureWeekdayArray(days)}
                >
                  <ToggleButton value={RRule.SU.weekday} key='0'>
                    Sun
                  </ToggleButton>
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
                  <ToggleButton value={RRule.SA.weekday} key='6'>
                    Sat
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
            <Select
              onChange={useCallback(
                (e: SelectChangeEvent<MonthlyFrequencyType>) => {
                  setMonthlyFreq(e.target.value as MonthlyFrequencyType);
                },
                [],
              )}
              value={monthlyFreq}
              autoWidth
              sx={{ minWidth: 174 }}
            >
              <MenuItem value='specific-date'>{specificDateChoice}</MenuItem>
              <MenuItem value='specific-ordinal'>{ordinalDateChoice}</MenuItem>
              {isLastWeekdayOfMonth(startDate) ? (
                <MenuItem value='specific-relative'>
                  {relativeDateChoice}
                </MenuItem>
              ) : null}
              {isLastDayOfMonth(startDate) ? (
                <MenuItem value='relative-lastofmonth'>
                  Last day of month
                </MenuItem>
              ) : null}
            </Select>
          </Box>
        </Box>
        {freqMeasure == 'month' &&
        monthlyFreq == 'specific-date' &&
        startDate.getDate() > 28 ? (
          <Box id='fallback-options' pl={2}>
            <FormControl>
              <RadioGroup
                name='fallback-options-radio-buttons-group'
                value={fallbackChoice}
                onChange={(_event, val) =>
                  setFallbackChoice(val as 'fallback' | 'static')
                }
              >
                <FormControlLabel
                  sx={
                    fallbackChoice == 'fallback'
                      ? selectedRadioStyle
                      : undefined
                  }
                  value='fallback'
                  control={<Radio />}
                  componentsProps={{ typography: { fontSize: '0.875rem' } }}
                  label='Fall back to the last day of the month'
                />
                <FormControlLabel
                  sx={{
                    ...(fallbackChoice == 'static'
                      ? selectedRadioStyle
                      : undefined),
                    mt: 1,
                  }}
                  value='static'
                  control={<Radio />}
                  componentsProps={{ typography: { fontSize: '0.875rem' } }}
                  label={`Recur only on months with ${startDate.getDate()} days`}
                />
              </RadioGroup>
            </FormControl>
          </Box>
        ) : null}
      </Stack>
    </Box>
  );
};
export default CreateHedgeRecurringCashFlowToggle;
