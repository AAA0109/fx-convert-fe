import { HubSpotScheduleMeeting } from 'components/account';
import { FeatureFlag } from 'components/shared';
import { FeePaymentMethod } from './FeePaymentMethod';
import { InviteYourTeam } from './InviteYourTeam';
import { LinkAccount } from './LinkAccount';

interface FinishingUpContentStepperProps {
  pageToDisplay: string;
}

export const FinishingUpContentStepper = ({
  pageToDisplay,
}: FinishingUpContentStepperProps) => {
  switch (pageToDisplay) {
    case 'portal-access':
      return <>portal access here</>;
    case 'fee-payment-method':
      return <FeePaymentMethod />;
    case 'link-account-for-withdrawals':
      return (
        <FeatureFlag name='onboarding-link-withdrawal-account'>
          <LinkAccount />
        </FeatureFlag>
      );
    case 'schedule-a-meeting':
      return <HubSpotScheduleMeeting />;
    case 'invite-your-team':
      return <InviteYourTeam />;
    default:
      return <></>;
  }
};
export default FinishingUpContentStepper;
