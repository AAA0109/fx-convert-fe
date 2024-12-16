import { Slider, SliderProps, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import {
  pangeaAlertNotificationMessageState,
  selectedHedgeStrategy,
} from 'atoms';
import { CashflowStrategyEnum } from 'lib';
import { isArray, isNumber } from 'lodash';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

export const ProtectionSlider = ({
  value,
  onRiskChange,
  ...sliderProps
}: { value: number; onRiskChange(newValue: number): void } & SliderProps) => {
  const [sliderVal, setSliderVal] = useState(value);
  const selectedStrategy = useRecoilValue(selectedHedgeStrategy);
  const setAlertMsg = useSetRecoilState(pangeaAlertNotificationMessageState);
  const normalizeVal = (val: number | number[]) =>
    isNumber(val) ? val : isArray(val) ? val[val.length - 1] : Number(val);
  const handleChange = (
    _event: Event | undefined,
    newVal: number | number[],
  ) => {
    setSliderVal(normalizeVal(newVal));
  };
  const handleChangeCommit = (
    _event: Event | SyntheticEvent<Element, Event>,
    newVal: number | number[],
  ) => {
    handleChange(undefined, newVal);
    let normalizedValue = normalizeVal(newVal);
    if (
      normalizedValue > 0.9 &&
      selectedStrategy !== CashflowStrategyEnum.AUTOPILOT
    ) {
      normalizedValue = 0.9;
      handleChange(undefined, normalizedValue);
      setAlertMsg({
        severity: 'info',
        text: 'Variance reduction cannot be reliably achieved above 90%.',
        timeout: 3500,
      });
    }
    onRiskChange?.(normalizedValue);
  };
  useEffect(() => setSliderVal(value), [setSliderVal, value]);
  return (
    <Stack direction={'row'} alignItems={'center'}>
      <Slider
        value={sliderVal}
        step={0.05}
        min={0}
        max={1}
        marks
        onChange={handleChange}
        onChangeCommitted={handleChangeCommit}
        {...sliderProps}
      />
      <Typography
        variant='small'
        style={{
          paddingLeft: '12px',
        }}
      >
        {(sliderVal * 100).toFixed(0)}%
      </Typography>
    </Stack>
  );
};
export default ProtectionSlider;
