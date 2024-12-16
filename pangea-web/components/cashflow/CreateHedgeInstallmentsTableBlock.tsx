import { Stack, Typography } from '@mui/material';
import { currenciesState } from 'atoms';
import { AnyHedgeItem, HedgeItemComponentProps, Installment } from 'lib';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { PangeaErrorFormHelperText } from '../shared';
import { GridInstallments2 } from './GridInstallments2';

export const CreateHedgeInstallmentsTableBlock = (
  props: HedgeItemComponentProps,
) => {
  const { isValidForm = true } = props;
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const installment = useRef((props.value as Installment) ?? new Installment());
  const currencies = useRecoilValue(currenciesState);
  if (props.value?.getHashCode() != installment.current.getHashCode()) {
    installment.current = props.value as Installment;
  }
  const handlePropChange = (callback: (hedgeItem: AnyHedgeItem) => void) => {
    if (!installment.current || !props.onChange) {
      return;
    }
    const inst = installment.current.clone();
    callback(inst);
    props.onChange?.(inst);
    installment.current = inst.clone();
  };

  const handleInstallmentsChange = (id: string, date: Date, amount: number) =>
    handlePropChange((hedgeItem) => {
      const i = hedgeItem as Installment;
      if (!i) return;
      const existingCashflow = i.cashflows.find((c) => c.internal_uuid == id);
      if (existingCashflow) {
        i.removeCashflow(existingCashflow);
      }
      i.addCashflow(date, amount, id);
    });
  const handleRemoveInstallments = (_id: string, date: Date, amount: number) =>
    handlePropChange((hedgeItem) => {
      const i = hedgeItem as Installment;
      if (!i) return;
      i.removeCashflowByAmountDate(amount, date);
    });

  useEffect(() => {
    if (!isValidForm) {
      setShowErrorMessage(!props.value);
    }
  }, [isValidForm, props.value]);

  return (
    <>
      <Stack spacing={1}>
        <Typography variant='body1'>
          Enter the installment details in the following table. Double click a
          cell to edit.
        </Typography>
        <Suspense>
          <GridInstallments2
            rows={installment.current?.cashflows ?? []}
            onCashflowAdded={handleInstallmentsChange}
            onCashflowDeleted={handleRemoveInstallments}
            direction={installment.current?.direction}
            foreignCurrency={installment.current?.currency}
            symbol={
              installment.current && installment.current.currency
                ? currencies[installment.current.currency].symbol ?? ''
                : ''
            }
          />
        </Suspense>
        <PangeaErrorFormHelperText
          text='Please add installments'
          visible={showErrorMessage}
        />
      </Stack>
    </>
  );
};
export default CreateHedgeInstallmentsTableBlock;
