import { currenciesState } from 'atoms';
import { Cashflow, SummaryItemProps, ensureArray, formatCurrency } from 'lib';
import { isUndefined } from 'lodash';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { AccordionContentBlock } from './AccordionContentBlock';

export const SummaryContent_CashflowFxAmount = ({
  value,
  mode,
  original_value,
  isChanged,
  accordionContentBlockProps,
}: SummaryItemProps) => {
  const [payingAmount, setPayingAmount] = useState(0);
  const [receivingAmount, setReceivingAmount] = useState(0);
  const currencies = useRecoilValue(currenciesState);
  const hedgeItems = ensureArray(original_value ?? value);
  if (
    mode === 'manage' &&
    isUndefined(isChanged) &&
    !isUndefined(original_value)
  ) {
    if ((value as Cashflow).id > 0) {
      const currentVal =
        (value as Cashflow).booked_cntr_amount ??
        (value as Cashflow).indicative_cntr_amount ??
        ensureArray(value)[0]?.amount ??
        0;
      const origVal =
        (original_value as Cashflow).booked_cntr_amount ??
        (original_value as Cashflow).indicative_cntr_amount ??
        ensureArray(original_value)[0].amount;
      isChanged = currentVal != origVal;
    }
  }
  useEffect(() => {
    if (!value) {
      return;
    }
    if (hedgeItems.length == 0) {
      return;
    }

    const paying = hedgeItems
      .filter((hI) => hI?.direction == 'paying')
      .reduce((sum, hI) => {
        return (
          sum +
          ((hI as Cashflow).booked_cntr_amount ??
            (hI as Cashflow).indicative_cntr_amount ??
            hI?.totalAmount ??
            0)
        );
      }, 0);
    const receiving = hedgeItems
      .filter((hI) => hI?.direction == 'receiving')
      .reduce((sum, hI) => {
        return (
          sum +
          ((hI as Cashflow).booked_cntr_amount ??
            (hI as Cashflow).indicative_cntr_amount ??
            hI?.totalAmount ??
            0)
        );
      }, 0);
    setPayingAmount(paying);
    setReceivingAmount(receiving);
  }, [value, currencies, hedgeItems]);

  const curr = hedgeItems[0]?.currency ?? 'USD';

  const totalAmountDisplay = formatCurrency(
    payingAmount + receivingAmount,
    curr,
    true,
    0,
    0,
  );
  return (
    <AccordionContentBlock
      isChanged={isChanged}
      label={`Total (${curr})`}
      {...accordionContentBlockProps}
    >
      {totalAmountDisplay}
    </AccordionContentBlock>
  );
};
export default SummaryContent_CashflowFxAmount;
