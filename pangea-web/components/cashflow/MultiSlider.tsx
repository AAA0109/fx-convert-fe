import { Box, Slider, SliderProps, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import {
  pangeaAlertNotificationMessageState,
  selectedHedgeStrategy,
} from 'atoms';
import { PangeaLoading } from 'components/shared';
import { useChartData } from 'hooks';
import { CashflowStrategyEnum, round } from 'lib';
import { isArray, isNumber } from 'lodash';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { PangeaColors } from 'styles';

export const MultiSlider = ({
  value,
  handleChangeFunc,
  maximum,
  minimum,
  sign,
  ...sliderProps
}: {
  value: number;
  maximum: number;
  minimum: number;
  sign: 'positive' | 'negative';
  handleChangeFunc(newValue: number): void;
} & SliderProps) => {
  const { riskChartData: chartData } = useChartData({
    riskReduction: undefined,
    selectedAccountId: undefined,
    maxLoss: undefined,
  });
  const [sliderVal, setSliderVal] = useState(value);
  const selectedStrategy = useRecoilValue(selectedHedgeStrategy);
  const setAlertMsg = useSetRecoilState(pangeaAlertNotificationMessageState);
  const normalizeVal = (val: number | number[]) =>
    isNumber(val) ? val : isArray(val) ? val[val.length - 1] : Number(val);
  const handleChange = (
    _event: Event | undefined,
    newVal: number | number[],
  ) => {
    setSliderVal(normalizeVal(newVal) / 100);
  };
  const handleChangeCommit = (
    _event: Event | SyntheticEvent<Element, Event>,
    newVal: number | number[],
  ) => {
    handleChange(undefined, newVal);
    let normalizedValue = normalizeVal(newVal);
    if (
      normalizedValue > 90 &&
      selectedStrategy !== CashflowStrategyEnum.AUTOPILOT
    ) {
      normalizedValue = 90;
      handleChange(undefined, normalizedValue);
      setAlertMsg({
        severity: 'info',
        text: 'Variance reduction cannot be reliably achieved above 90%.',
        timeout: 3500,
      });
    }
    handleChangeFunc?.(normalizedValue / 100);
  };

  useEffect(() => setSliderVal(value), [setSliderVal, value]);
  if (!chartData?.length)
    return (
      <Stack sx={{ height: '345px' }}>
        <PangeaLoading loadingPhrase='...' centerPhrase />
      </Stack>
    );
  return (
    <Stack direction={'row'} alignItems={'center'}>
      <Stack direction={'row'} flex={1} alignItems={'center'}>
        <Typography
          variant='small'
          style={{
            paddingRight: '24px',
          }}
        >
          {round(Number(minimum) * 100, 0.5).toFixed(1)}%
        </Typography>
        <Slider
          track='inverted'
          value={sliderVal * 100}
          step={0.005 * 100}
          min={round(Number(minimum) * 100, 0.5)}
          max={round(maximum * 100, 0.5)}
          onChange={handleChange}
          onChangeCommitted={handleChangeCommit}
          {...sliderProps}
        />
        <Typography
          variant='small'
          style={{
            paddingLeft: '24px',
          }}
        >
          {round(maximum * 100, 0.5).toFixed(1)}%
        </Typography>
      </Stack>
      <Box
        width={60}
        paddingY={1}
        borderRadius={'4px'}
        style={{
          marginLeft: '24px',
          color:
            sign === 'positive'
              ? PangeaColors.SecurityGreenDarker
              : PangeaColors.RiskBerryMedium,
          backgroundColor: '#0000000A',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant='small'>
          {sign === 'positive' ? '+' : '-'}
          {Math.abs(Number((sliderVal * 100).toFixed(1)))}%
        </Typography>
      </Box>
    </Stack>
  );
};
export default MultiSlider;
