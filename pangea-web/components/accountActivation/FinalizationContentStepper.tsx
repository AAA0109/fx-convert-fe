import { AccountActivatedRemainingItems } from './AccountActivatedRemainingItems';
import { AccountCollectingDocuments } from './AccountCollectingDocuments';
import { ActivationIbPortalAccess } from './ActivationIbPortalAccess';

interface FinalizationContentStepperProps {
  pageToDisplay: string;
}
export const FinalizationContentStepper = ({
  pageToDisplay,
}: FinalizationContentStepperProps) => {
  switch (pageToDisplay) {
    case 'collecting-documents':
      return <AccountCollectingDocuments />;
    case 'portal-access':
      return <ActivationIbPortalAccess />;
    case 'interactive-broker-application':
      return <AccountActivatedRemainingItems />;
    default:
      return <></>;
  }
};
export default FinalizationContentStepper;
