import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
  Stack,
} from '@mui/material';
import { depositRequestDataState, depositSelectionState } from 'atoms';
import { MINIMUM_DEPOSIT_AMOUNT, formatCurrency } from 'lib';
import { debounce } from 'lodash';
import { ChangeEvent, useMemo } from 'react';
import { NumberFormatValues, NumericFormat } from 'react-number-format';
import { useRecoilState } from 'recoil';
import { PangeaColors } from 'styles';

interface MarginAmountOptionsProps {
  recommendedAmt: number;
  requiredAmt: number;
}

export const MarginAmountOptions = (props: MarginAmountOptionsProps) => {
  const { requiredAmt, recommendedAmt } = props;
  const [depositSelection, setDepositSelection] = useRecoilState(
    depositSelectionState,
  );
  const [depositRequestData, setDepositRequestData] = useRecoilState(
    depositRequestDataState,
  );

  const handleCustomInput = useMemo(
    () =>
      debounce((values: NumberFormatValues) => {
        if (values.value == '') {
          return;
        }
        let value = values.floatValue ?? 0;
        if (value < requiredAmt) {
          value = requiredAmt;
        }
        setDepositRequestData({
          ...depositRequestData,
          amount: value,
        });
      }, 1000),
    [requiredAmt, setDepositRequestData, depositRequestData],
  );

  const handleCustomInputFocused = () => {
    setDepositSelection('custom');
  };
  // setting deposit selection
  const handleDepositSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    type DepositOptions = 'recommended' | 'minimum' | 'custom';
    const depositChoice: DepositOptions = ![
      'recommended',
      'minimum',
      'custom',
    ].includes(value)
      ? 'recommended'
      : (value as DepositOptions);
    const returnAmount: number = {
      recommended: recommendedAmt,
      minimum: requiredAmt,
      custom: 0,
    }[depositChoice];

    setDepositSelection(depositChoice);

    setDepositRequestData({
      ...depositRequestData,
      amount: returnAmount,
    });
  };

  return (
    <FormControl>
      <RadioGroup
        onChange={handleDepositSelection}
        aria-labelledby='deposit-review'
        name='radio-buttons-group'
        value={depositSelection}
      >
        <Stack marginBottom={'18px'}>
          {recommendedAmt > 0 ? (
            <FormControlLabel
              sx={{
                maxWidth: '100px',
                marginBottom: '16px',
                '& .MuiFormControlLabel-label': {
                  lineHeight: 1.7,
                },
              }}
              value='recommended'
              control={<Radio />}
              label={`Recommended* ${formatCurrency(
                recommendedAmt,
                'USD',
                true,
                0,
                0,
              )}`}
            />
          ) : null}
          {requiredAmt > 0 ? (
            <FormControlLabel
              sx={{
                maxWidth: '200px',
                '& .MuiFormControlLabel-label': {
                  lineHeight: 1.7,
                },
              }}
              value='minimum'
              control={<Radio />}
              label={`Minimum Required ${formatCurrency(
                requiredAmt,
                'USD',
                true,
                0,
                0,
              )}`}
            />
          ) : null}
        </Stack>
        <Stack direction='row' alignItems='center' marginBottom={'18px'}>
          <FormControl>
            <Radio value='custom' sx={{ paddingLeft: '0px' }} />
          </FormControl>
          <FormControl
            sx={{
              backgroundColor: PangeaColors.White,
            }}
            variant='outlined'
          >
            <InputLabel variant='outlined' sx={{ top: '-5px' }}>
              Custom Amount
            </InputLabel>
            <NumericFormat
              id='Custom-amount'
              label={'Custom Amount'}
              thousandSeparator={true}
              prefix={'$'}
              decimalScale={0}
              min={MINIMUM_DEPOSIT_AMOUNT}
              fixedDecimalScale={false}
              allowLeadingZeros={false}
              allowNegative={false}
              customInput={OutlinedInput}
              onValueChange={handleCustomInput}
              error={depositRequestData.amount < MINIMUM_DEPOSIT_AMOUNT}
              title={`Enter a minimum of ${MINIMUM_DEPOSIT_AMOUNT}`}
              onFocus={handleCustomInputFocused}
              value={
                depositSelection === 'custom' ? depositRequestData.amount : ''
              }
              sx={{
                '.MuiInputBase-input.MuiOutlinedInput-input': {
                  paddingTop: '10px',
                  paddingBottom: '10px',
                },
              }}
            />
            <FormHelperText>
              Custom deposits must be &ge; ${MINIMUM_DEPOSIT_AMOUNT}
            </FormHelperText>
          </FormControl>
        </Stack>
      </RadioGroup>
    </FormControl>
  );
};
