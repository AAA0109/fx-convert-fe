import { ensureArray, SummaryItemProps } from 'lib';
import { isUndefined } from 'lodash';
import { AccordionContentBlock } from './AccordionContentBlock';
export const SummaryContent_Frequency = ({
  value,
  mode,
  original_value,
  isChanged,
  accordionContentBlockProps,
}: SummaryItemProps) => {
  const hedgeItems = ensureArray(value);
  const origItems = ensureArray(original_value);
  if (
    mode === 'manage' &&
    isUndefined(isChanged) &&
    !isUndefined(original_value)
  ) {
    isChanged = hedgeItems[0]?.type != origItems[0]?.type;
  }
  return (
    <AccordionContentBlock
      label='Frequency'
      isChanged={isChanged}
      {...accordionContentBlockProps}
    >
      {!hedgeItems
        ? 'None'
        : hedgeItems.every((hI) => hI?.type == hedgeItems[0]?.type)
        ? {
            onetime: 'One-Time',
            installments: 'Installments',
            recurring: 'Recurring',
          }[hedgeItems[0]?.type ?? 'onetime']
        : '(Various)'}
    </AccordionContentBlock>
  );
};
export default SummaryContent_Frequency;
