import { ensureArray, SummaryItemProps } from 'lib';
import { AccordionContentBlock } from './AccordionContentBlock';
export const SummaryContent_CashflowsAdded = ({
  value,
  accordionContentBlockProps,
}: SummaryItemProps) => {
  const hedgeItems = ensureArray(value).length;
  return (
    <AccordionContentBlock
      label='Cash Flows Added'
      {...accordionContentBlockProps}
    >
      {hedgeItems.toString()}
    </AccordionContentBlock>
  );
};
export default SummaryContent_CashflowsAdded;
