import {
  AnyHedgeItem,
  Cashflow,
  ensureArray,
  Installment,
  SummaryItemProps,
} from 'lib';
import { isUndefined } from 'lodash';
import { useMemo } from 'react';
import { AccordionContentBlock } from './AccordionContentBlock';

export const SummaryContent_Schedule = ({
  value,
  original_value,
  mode,
  isChanged,
  accordionContentBlockProps,
}: SummaryItemProps) => {
  const hedgeItems = ensureArray(value);
  const getSchedule = useMemo(
    () => (hI: (AnyHedgeItem | undefined)[]) =>
      !hI || hI.length == 0
        ? 'None'
        : hI.length == 1
        ? hI[0] && hI[0].type == 'recurring'
          ? (hI[0] as Cashflow).recurrenceData?.displayText
          : hI[0] && hI[0].type == 'installments'
          ? (hI[0] as Installment).cashflows.length + ' Payment(s)'
          : 'Single Payment'
        : 'Various',
    [],
  );
  const schedule = getSchedule(hedgeItems);
  if (
    mode === 'manage' &&
    isUndefined(isChanged) &&
    !isUndefined(original_value)
  ) {
    isChanged = schedule != getSchedule(ensureArray(original_value));
  }
  return (
    <AccordionContentBlock
      label='Schedule'
      isChanged={isChanged}
      {...accordionContentBlockProps}
    >
      {schedule}
    </AccordionContentBlock>
  );
};
export default SummaryContent_Schedule;
