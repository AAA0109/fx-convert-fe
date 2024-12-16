import { AnyHedgeItem, ensureArray, SummaryItemProps } from 'lib';
import { isUndefined } from 'lodash';
import { memo, useMemo } from 'react';
import { AccordionContentBlock } from './AccordionContentBlock';
export const SummaryContent_Expiration = memo(
  function SummaryContent_Expiration({
    value,
    original_value,
    isChanged,
    accordionContentBlockProps,
    label,
  }: SummaryItemProps) {
    const hedgeItems = ensureArray(value);
    const getExpiration = useMemo(
      () => (hI: (AnyHedgeItem | undefined)[]) => {
        return !hI
          ? 'None'
          : hI.every(
              (h) =>
                Number(h?.nextSettlementDate) ==
                Number(hI[0]?.nextSettlementDate),
            )
          ? hI[0]?.nextSettlementDate.toLocaleDateString() ?? 'None'
          : '(Various)';
      },
      [],
    );
    const expiration = getExpiration(hedgeItems);
    if (isUndefined(isChanged) && !isUndefined(original_value)) {
      isChanged = expiration != getExpiration(ensureArray(original_value));
    }
    return (
      <AccordionContentBlock
        label={label ?? 'Hedge Expires'}
        isChanged={isChanged}
        {...accordionContentBlockProps}
      >
        {expiration}
      </AccordionContentBlock>
    );
  },
);
export default SummaryContent_Expiration;
