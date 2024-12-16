import { AnyHedgeItem, ensureArray, Installment, SummaryItemProps } from 'lib';
import { isUndefined } from 'lodash';
import { AccordionContentBlock } from './AccordionContentBlock';
export const SummaryContent_Installments = ({
  value,
  original_value,
  mode,
  isChanged,
  accordionContentBlockProps,
}: SummaryItemProps) => {
  const hedgeItems = ensureArray(value);
  const getPayments = (hI: (AnyHedgeItem | undefined)[]) =>
    !hI || hI.length != 1 || !hI[0] || hI[0].type != 'installments'
      ? 'N/A'
      : (hI[0] as Installment).cashflows.length;
  const payments = getPayments(hedgeItems);
  const origPayments = getPayments(ensureArray(original_value));
  if (
    mode === 'manage' &&
    isUndefined(isChanged) &&
    !isUndefined(original_value)
  ) {
    isChanged = payments != origPayments;
  }
  return (
    <AccordionContentBlock
      label='Installments'
      isChanged={isChanged}
      {...accordionContentBlockProps}
    >
      {payments.toString()}
    </AccordionContentBlock>
  );
};
export default SummaryContent_Installments;
