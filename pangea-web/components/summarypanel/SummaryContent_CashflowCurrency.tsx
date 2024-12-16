import {
  Cashflow,
  ensureArray,
  formatCurrency,
  getHedgeItemsProperty,
  SummaryItemProps,
} from 'lib';
import { AccordionContentBlock } from './AccordionContentBlock';
export const SummaryContent_Currency = ({
  value,
  accordionContentBlockProps,
  label,
}: SummaryItemProps) => {
  const currency = getHedgeItemsProperty(
    ensureArray(value),
    'currency',
  ) as string;
  const amount =
    (value as Cashflow)?.booked_cntr_amount ??
    (value as Cashflow)?.indicative_cntr_amount ??
    (getHedgeItemsProperty(
      ensureArray(value),
      'nextSettlementAmount',
    ) as string);
  return (
    <AccordionContentBlock
      label={`${label} (${currency})`}
      labelRight={`${formatCurrency(amount, currency, true, 0, 4)}`}
      {...accordionContentBlockProps}
    ></AccordionContentBlock>
  );
};
export default SummaryContent_Currency;
