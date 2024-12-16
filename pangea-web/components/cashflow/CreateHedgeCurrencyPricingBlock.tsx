import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  Box,
  FormControl,
  FormHelperText,
  Skeleton,
  Stack,
} from '@mui/material';
import {
  CurrentRateDisplayCreate2,
  DomesticCurrencyInput2,
  ForeignCurrencyInput2,
} from 'components/shared';

import { exchangeRatesState } from 'atoms';
import {
  AnyHedgeItem,
  HedgeItemComponentProps,
  convertToDomesticAmount,
} from 'lib';
import { Fragment, Suspense } from 'react';
import { useRecoilValue } from 'recoil';
import { PangeaTooltip } from '../shared';

export const CreateHedgeCurrencyPricingBlock = (
  props: HedgeItemComponentProps,
) => {
  const { isValidForm = true } = props;
  const exchangeRate = useRecoilValue(
    exchangeRatesState(props.value?.currency),
  );
  const handlePropChange = (callback: (hedgeItem: AnyHedgeItem) => void) => {
    if (!props.value || !props.onChange) {
      return;
    }
    const hedgeItem = props.value.clone();
    callback(hedgeItem);
    props.onChange(hedgeItem);
  };
  const handleDomesticCurrencyChange = (amount: string, initialValue: string) =>
    handlePropChange(
      (hedgeItem: any) => (
        (hedgeItem.amount = parseFloat(amount)),
        (hedgeItem.indicative_base_amount = parseFloat(initialValue))
      ),
    );

  const handleForeignCurrencyChange = (amount: number) =>
    handlePropChange(
      (hedgeItem: any) => (
        (hedgeItem.amount = amount),
        (hedgeItem.indicative_base_amount = convertToDomesticAmount(
          amount || 0,
          exchangeRate,
        ))
      ),
    );
  return (
    <Stack direction={'row'} spacing={3} justifyContent='flex-start'>
      <Box>
        <FormControl sx={{ mb: 1, width: 270 }}>
          <Suspense fallback={<Skeleton variant='rectangular' />}>
            <ForeignCurrencyInput2
              value={props.value?.amount ?? 0}
              onChange={handleForeignCurrencyChange}
              direction={props.value?.direction ?? 'paying'}
              foreignCurrency={props.value?.currency}
              isValidForm={isValidForm}
            />
          </Suspense>
        </FormControl>{' '}
        <FormControl sx={{ width: 270 }}>
          <Suspense fallback={<Skeleton variant='rectangular' />}>
            <DomesticCurrencyInput2
              value={props.value?.amount.toString() ?? '0'}
              onChange={handleDomesticCurrencyChange}
              direction={props.value?.direction ?? 'paying'}
              foreignCurrency={props.value?.currency}
              isValidForm={isValidForm}
            />
          </Suspense>
        </FormControl>
        <Stack direction={'row'} alignItems={'center'} spacing={2} mt={0.6}>
          <FormHelperText sx={{ marginTop: '0px' }}>
            Currency prices are current as of yesterday&apos;s close.{' '}
          </FormHelperText>
          <PangeaTooltip
            arrow
            placement='right'
            title={
              <Fragment>
                Currency prices are represented as yesterday&apos;s average
                price at NYSE close (4:00 PM EST)
              </Fragment>
            }
          >
            <HelpOutlineIcon />
          </PangeaTooltip>
        </Stack>
      </Box>
      <Box display={'flex'} flexGrow={1} alignItems={'center'}>
        <Suspense fallback={'loading rate display'}>
          <CurrentRateDisplayCreate2 foreignCurrency={props.value?.currency} />
        </Suspense>
      </Box>
    </Stack>
  );
};
export default CreateHedgeCurrencyPricingBlock;
