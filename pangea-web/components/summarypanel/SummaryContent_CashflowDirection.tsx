import { ensureArray, SummaryItemProps } from 'lib';
import { isUndefined } from 'lodash';
import { AccordionContentBlock } from './AccordionContentBlock';
export const SummaryContent_CashflowDirection = ({
  value,
  original_value,
  isChanged,
  accordionContentBlockProps,
}: SummaryItemProps) => {
  const hedgeItems = ensureArray(value);
  const origItems = ensureArray(original_value);
  if (isUndefined(isChanged) && !isUndefined(original_value)) {
    isChanged = hedgeItems[0]?.direction != origItems[0]?.direction;
  }

  return (
    <AccordionContentBlock
      label='Direction'
      isChanged={isChanged}
      {...accordionContentBlockProps}
    >
      {!hedgeItems
        ? 'None'
        : hedgeItems.every((hI) => hI?.direction == hedgeItems[0]?.direction)
        ? {
            paying: 'Paying',
            receiving: 'Receiving',
          }[hedgeItems[0]?.direction ?? 'paying']
        : 'None'}
    </AccordionContentBlock>
  );
};

export default SummaryContent_CashflowDirection;
