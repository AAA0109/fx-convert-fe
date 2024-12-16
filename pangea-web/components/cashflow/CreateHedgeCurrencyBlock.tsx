import { FormControl, Skeleton } from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import { ForeignCurrencySelect2 } from 'components/shared';
import { AnyHedgeItem, HedgeItemComponentProps } from 'lib';
import { Suspense } from 'react';

export const CreateHedgeCurrencyBlock = (props: HedgeItemComponentProps) => {
  const { isValidForm = true } = props;
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
  const handleCurrencyChange = useEventCallback((currency: string) =>
    handlePropChange((hedgeItem) => {
      hedgeItem.currency = currency;
      if (hedgeItem.type !== 'installments') {
        hedgeItem.amount = 0;
      }
    }),
  );
  return (
    <FormControl sx={{ padding: '0px', width: 270 }}>
      <Suspense fallback={<Skeleton variant='rectangular' />}>
        <ForeignCurrencySelect2
          value={props.value?.currency}
          onChange={handleCurrencyChange}
          direction={props.value?.direction ?? 'paying'}
          isValidForm={isValidForm}
          mode={props.mode}
        />
      </Suspense>
    </FormControl>
  );
};
export default CreateHedgeCurrencyBlock;
