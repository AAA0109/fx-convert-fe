import { AnyHedgeItem, ensureArray, SummaryItemProps } from 'lib';
import { isUndefined } from 'lodash';
import { useMemo } from 'react';
import { AccordionContentBlock } from './AccordionContentBlock';
export const SummaryContent_Description = ({
  value,
  original_value,
  mode,
  isChanged,
  accordionContentBlockProps,
}: SummaryItemProps) => {
  const getDescription = useMemo(
    () => (items: (AnyHedgeItem | undefined)[]) => {
      return !items
        ? 'None'
        : items.every((hI) => hI?.description == items[0]?.description)
        ? items[0]?.description
        : '(Various)';
    },
    [],
  );
  const hedgeItems = ensureArray(value);
  const originalHedgeItems = ensureArray(original_value);
  const description = getDescription(hedgeItems);
  if (mode === 'manage' && isUndefined(isChanged)) {
    isChanged = description != getDescription(originalHedgeItems);
  }
  return (
    <AccordionContentBlock
      label='Description'
      isChanged={isChanged}
      {...accordionContentBlockProps}
    >
      {description}
    </AccordionContentBlock>
  );
};
export default SummaryContent_Description;
