// import { PangeaBestExecutionTiming } from 'lib';
// import { isError } from 'lodash';
// import { useMemo } from 'react';

const useTimingOptions = () =>
  // timingOptions?: Error | Partial<PangeaExecutionTimingTimelineOptionsResponse>,
  {
    // const [hasAllOptions, hasOnlyNow, hasNowAndToday, hasNowAndTomorrow] =
    //   useMemo(() => {
    //     if (timingOptions && !isError(timingOptions)) {
    //       const hasNow = timingOptions?.execution_time_options?.some(
    //         (option) => option.id === 'now',
    //       );
    //       const hasToday = timingOptions?.execution_time_options?.some(
    //         (option) => option.id === 'today',
    //       );
    //       const hasTomorrow = timingOptions?.execution_time_options?.some(
    //         (option) => option.id === 'tomorrow',
    //       );

    //       return [
    //         hasNow && hasToday && hasTomorrow, // hasAllOptions
    //         hasNow && !hasToday && !hasTomorrow, // hasOnlyNow
    //         hasNow && hasToday && !hasTomorrow, // hasNowAndToday
    //         hasNow && !hasToday && hasTomorrow, // hasNowAndTomorrow
    //       ];
    //     }
    //     return [false, false, false, false];
    //   }, [timingOptions]);

    return [true, true, true, true];
  };
export const usePaymentTimingOptions = () =>
  // timingOptions?: Error | Partial<PangeaBestExecutionTiming>,
  {
    // const [hasAllOptions, hasOnlyNow, hasNowAndToday, hasNowAndTomorrow] =
    //   useMemo(() => {
    //     if (timingOptions && !isError(timingOptions)) {
    //       const hasNow = timingOptions.execution_timings?.some(
    //         (option) => option.value === 'now',
    //       );

    //       const hasToday = timingOptions?.execution_timings?.some(
    //         (option) => option.value === 'today',
    //       );
    //       const hasTomorrow = timingOptions?.execution_timings?.some(
    //         (option) => option.value === 'tomorrow',
    //       );

    //       return [
    //         hasNow && hasToday && hasTomorrow, // hasAllOptions
    //         hasNow && !hasToday && !hasTomorrow, // hasOnlyNow
    //         hasNow && hasToday && !hasTomorrow, // hasNowAndToday
    //         hasNow && !hasToday && hasTomorrow, // hasNowAndTomorrow
    //       ];
    //     }
    //     return [false, false, false, false];
    //   }, [timingOptions]);

    return [true, true, true, true];
  };

export default useTimingOptions;
