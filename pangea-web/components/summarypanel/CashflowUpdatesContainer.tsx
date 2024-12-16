import {
  activeHedgeState,
  activeOriginalHedgeState,
  bulkUploadItemsState,
} from 'atoms';
import { CashflowEditMode } from 'lib';
import { useRecoilValue } from 'recoil';
import { RHSAccordion } from './RHSAccordion';
import { SummaryContent_CashflowAmount } from './SummaryContent_CashflowAmount';
import SummaryContent_CashflowDirection from './SummaryContent_CashflowDirection';
import SummaryContent_CashflowFxAmount from './SummaryContent_CashflowFxAmount';
import { SummaryContent_CashflowsAdded } from './SummaryContent_CashflowsAdded';
import { SummaryContent_Description } from './SummaryContent_Description';
import { SummaryContent_Expiration } from './SummaryContent_Expiration';
import { SummaryContent_Frequency } from './SummaryContent_Frequency';
import { SummaryContent_Installments } from './SummaryContent_Installments';
import { SummaryContent_Name } from './SummaryContent_Name';
import { SummaryContent_Schedule } from './SummaryContent_Schedule';
export const CashflowUpdatesContainer = ({
  mode = 'create',
  lockOpen = false,
  defaultExpanded = true,
  fullWidth = false,
}: {
  mode?: CashflowEditMode;
  lockOpen?: boolean;
  defaultExpanded?: boolean;
  fullWidth?: boolean;
}) => {
  const hedgeItems = useRecoilValue(bulkUploadItemsState);
  const activeHedge = useRecoilValue(activeHedgeState);
  const activeOriginal = useRecoilValue(activeOriginalHedgeState);
  const hedgeItemValue = mode === 'manage' ? activeHedge : hedgeItems;
  const originalItemValue =
    mode === 'manage' ? activeOriginal ?? undefined : undefined;

  const title =
    hedgeItems.length > 1 ? 'Bulk Upload Details' : 'Cash Flow Details';

  return (
    <RHSAccordion
      title={title}
      defaultExpanded={defaultExpanded}
      lockOpen={lockOpen}
    >
      <SummaryContent_CashflowAmount
        value={hedgeItemValue}
        original_value={originalItemValue}
        mode={mode}
        accordionContentBlockProps={{ expanded: fullWidth }}
      />
      <SummaryContent_CashflowFxAmount
        value={hedgeItemValue}
        original_value={originalItemValue}
        mode={mode}
        accordionContentBlockProps={{ expanded: fullWidth }}
      />
      {hedgeItems.length == 1 ? (
        <SummaryContent_Name
          value={hedgeItemValue}
          original_value={originalItemValue}
          mode={mode}
          accordionContentBlockProps={{ expanded: fullWidth }}
        />
      ) : null}
      {hedgeItems.length == 1 ? (
        <SummaryContent_CashflowDirection
          value={hedgeItemValue}
          original_value={originalItemValue}
          mode={mode}
          accordionContentBlockProps={{ expanded: fullWidth }}
        />
      ) : null}
      {hedgeItems.length == 1 ? (
        <SummaryContent_Frequency
          value={hedgeItemValue}
          original_value={originalItemValue}
          mode={mode}
          accordionContentBlockProps={{ expanded: fullWidth }}
        />
      ) : null}
      {hedgeItems.length == 1 && hedgeItems[0].type == 'recurring' ? (
        <SummaryContent_Schedule
          value={hedgeItemValue}
          original_value={originalItemValue}
          mode={mode}
          accordionContentBlockProps={{ expanded: fullWidth }}
        />
      ) : null}
      {hedgeItems.length == 1 && hedgeItems[0].type === 'installments' ? (
        <SummaryContent_Installments
          value={hedgeItemValue}
          original_value={originalItemValue}
          mode={mode}
          accordionContentBlockProps={{ expanded: fullWidth }}
        />
      ) : null}
      {hedgeItems.length == 1 ? (
        <SummaryContent_Expiration
          value={hedgeItemValue}
          original_value={originalItemValue}
          mode={mode}
          accordionContentBlockProps={{ expanded: fullWidth }}
        />
      ) : null}
      {hedgeItems.length == 1 ? (
        <SummaryContent_Description
          value={hedgeItemValue}
          original_value={originalItemValue}
          mode={mode}
          accordionContentBlockProps={{ expanded: fullWidth }}
        />
      ) : null}
      {hedgeItems.length > 1 ? (
        <SummaryContent_CashflowsAdded
          value={hedgeItemValue}
          accordionContentBlockProps={{ expanded: fullWidth }}
        />
      ) : null}
    </RHSAccordion>
  );
};
export default CashflowUpdatesContainer;
