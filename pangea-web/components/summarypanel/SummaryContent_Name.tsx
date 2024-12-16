import { AnyHedgeItem, ensureArray, SummaryItemProps } from 'lib';
import { isUndefined } from 'lodash';
import { useMemo } from 'react';
import { AccordionContentBlock } from './AccordionContentBlock';
export const SummaryContent_Name = ({
  value,
  mode,
  original_value,
  isChanged,
  accordionContentBlockProps,
}: SummaryItemProps) => {
  const hedgeItems = ensureArray(value);
  const getName = useMemo(
    () => (hI: (AnyHedgeItem | undefined)[]) =>
      !hI || !hI[0]
        ? 'None'
        : hI.every((h) => h?.name == hI[0]?.name)
        ? hI[0]?.name
        : '(Various)',
    [],
  );
  const name = getName(hedgeItems);
  if (
    mode === 'manage' &&
    isUndefined(isChanged) &&
    !isUndefined(original_value)
  ) {
    const originalItems = ensureArray(original_value);
    isChanged = name != getName(originalItems);
  }
  return (
    <AccordionContentBlock
      label='Name'
      isChanged={isChanged}
      {...accordionContentBlockProps}
    >
      {name}
    </AccordionContentBlock>
  );
};
export default SummaryContent_Name;
