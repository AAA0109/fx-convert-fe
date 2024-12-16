// import { Typography } from '@mui/material';
// import Slider, { SliderProps } from '@mui/material/Slider';
// import { styled } from '@mui/material/styles';
// import { PangeaExecutionTimingOptionsResponse, getClockTime } from 'lib';
// import { isError } from 'lodash';
import * as React from 'react';
// import { PangeaColors } from 'styles';

// interface StyledSliderProps extends SliderProps {
//   success?: boolean;
//   sedata: any[];
//   value: number[];
// }
interface ExecutionGraphProps {
  data: { id: string; label: string; time: string }[];
}

// function getAllOptionsState(data: any[]): Record<string, boolean> {
//   const timingOptions = data as
//     | Array<Partial<PangeaExecutionTimingOptionsResponse>>
//     | Error;
//   if (timingOptions && !isError(timingOptions)) {
//     const hasNow = timingOptions.some((option) => option.id === 'now');
//     const hasToday = timingOptions.some((option) => option.id === 'today');
//     const hasTomorrow = timingOptions.some(
//       (option) => option.id === 'tomorrow',
//     );

//     return {
//       hasAllOptions: hasNow && hasToday && hasTomorrow, // hasAllOptions
//       hasNowAndToday: hasNow && hasToday && !hasTomorrow, // hasNowAndToday
//       hasNowAndTomorrow: hasNow && !hasToday && hasTomorrow, // hasNowAndTomorrow
//     };
//   }
//   return {
//     hasAllOptions: false,
//     hasNowAndToday: false,
//     hasNowAndTomorrow: false,
//   };
// }
const ExecutionGraph: React.FC<ExecutionGraphProps> = () => {
  return <></>;
  // const ExecutionSlider = styled(Slider, {
  //   shouldForwardProp: (prop) => prop !== 'success',
  // })<StyledSliderProps>(({ value, theme, sedata }) => {
  //   const allOptions = getAllOptionsState(sedata);
  //   const { hasAllOptions, hasNowAndToday, hasNowAndTomorrow } = allOptions;
  //   return {
  //     color: theme.palette.mode === 'dark' ? '#3880ff' : '#3880ff',
  //     height: 2,
  //     padding: '15px 0',
  //     '& .MuiSlider-thumb[data-index="0"]': {
  //       backgroundColor: PangeaColors.SolidSlateDarker,
  //       height: 7,
  //       width: 7,
  //     },
  //     '& .MuiSlider-thumb[data-index="1"]': {
  //       backgroundColor: hasAllOptions
  //         ? PangeaColors.CautionYellowDark
  //         : hasNowAndToday
  //         ? PangeaColors.SecurityGreenDark
  //         : PangeaColors.SolidSlateLight,
  //     },
  //     '& .MuiSlider-thumb[data-index="2"]': {
  //       height: 10,
  //       width: 4,
  //       borderRadius: 10,
  //     },
  //     '& .MuiSlider-thumb[data-index="3"]': {
  //       backgroundColor:
  //         hasAllOptions || hasNowAndTomorrow
  //           ? PangeaColors.SecurityGreenDark
  //           : hasNowAndToday
  //           ? PangeaColors.CautionYellowDark
  //           : PangeaColors.SolidSlateLight,
  //       height: value.length > 3 ? 14 : 16,
  //       width: value.length > 3 ? 14 : 4,
  //       borderRadius: value.length > 3 ? 100 : 10,
  //     },
  //     '& .MuiSlider-thumb[data-index="4"]': {
  //       height: 16,
  //       width: 4,
  //       borderRadius: 10,
  //     },
  //     '& .MuiSlider-thumb': {
  //       height: 14,
  //       width: 14,
  //       backgroundColor: PangeaColors.SolidSlateDarker,
  //     },
  //     '& .MuiSlider-valueLabel': {
  //       fontSize: 12,
  //       fontWeight: 'normal',
  //       top: -6,
  //       backgroundColor: 'unset',
  //       color: theme.palette.text.primary,
  //       '&:before': {
  //         display: 'none',
  //       },
  //       '& *': {
  //         background: 'transparent',
  //       },
  //     },
  //     '& .MuiSlider-track': {
  //       border: 'none',
  //       backgroundColor: PangeaColors.SolidSlateDarker,
  //     },
  //     '& .MuiSlider-rail': {
  //       backgroundColor: PangeaColors.BlackSemiTransparent25,
  //     },
  //     '& .MuiSlider-mark': {
  //       backgroundColor: PangeaColors.SolidSlateDarker,
  //       height: 8,
  //       width: 1,
  //       '&.MuiSlider-markActive': {
  //         opacity: 1,
  //       },
  //     },
  //     '& .MuiSlider-markLabel': {
  //       whiteSpace: 'inherit',
  //       textAlign: 'right',
  //       color: PangeaColors.BlackSemiTransparent99,
  //       fontWeight: 500,
  //     },
  //   };
  // });
  // const newData = data.map((datum, index) => {
  //   return {
  //     ...datum,
  //     mark: index < data.length - 1 ? index * (100 / data.length) : 95,
  //   };
  // });

  // const { hasAllOptions, hasNowAndToday, hasNowAndTomorrow } =
  //   getAllOptionsState(data);

  // return (
  //   <ExecutionSlider
  //     getAriaLabel={(index) => `slider-${index}`}
  //     value={newData.map((datum) => Number(datum.mark))}
  //     marks={newData.map((datum) => {
  //       return {
  //         label:
  //           datum?.id === 'today' || datum?.id === 'tomorrow'
  //             ? ''
  //             : datum.label,
  //         value: Number(datum.mark),
  //       };
  //     })}
  //     valueLabelDisplay='on'
  //     success={true}
  //     sedata={data}
  //     disabled
  //     size='small'
  //     valueLabelFormat={(x) => {
  //       const dataValue = Object.values(newData).find(
  //         (datum) => datum.mark.toFixed(2) === x.toFixed(2),
  //       );
  //       const colorMap: Record<string, string> = {
  //         today: hasAllOptions
  //           ? PangeaColors.CautionYellowDark
  //           : hasNowAndToday
  //           ? PangeaColors.SecurityGreenDark
  //           : PangeaColors.SolidSlateLight,
  //         tomorrow:
  //           hasAllOptions || hasNowAndTomorrow
  //             ? PangeaColors.SecurityGreenDark
  //             : PangeaColors.SolidSlateLight,
  //       };
  //       return (
  //         <Typography
  //           fontSize={12}
  //           color={dataValue ? colorMap[dataValue?.id] : 'inherit'}
  //         >
  //           {dataValue?.id === 'today' || dataValue?.id === 'tomorrow'
  //             ? `${getClockTime(new Date(Date.parse(dataValue?.time ?? '')))}`
  //             : ''}
  //         </Typography>
  //       );
  //     }}
  //   />
  // );
};

export default ExecutionGraph;
