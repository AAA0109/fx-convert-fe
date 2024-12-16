import { DetailsSideStepper } from 'components/shared';
import { useFeatureFlags } from 'hooks';
import { Grid63Layout } from '../shared';
import { FinishingUpContentStepper } from './FinishingUpContentStepper';

interface FinishingUpDetailsContainerProps {
  page: string;
}

export const FinishingUpDetailsContainer = (
  props: FinishingUpDetailsContainerProps,
) => {
  const { page = 'finishing-up' } = props;
  const pageToDisplay = !page || page === '' ? 'finishing-up' : page;

  const { isFeatureEnabled } = useFeatureFlags();
  const shouldShowLinkWithdrawalAccount = isFeatureEnabled(
    'onboarding-link-withdrawal-account',
  );
  const DetailsStepperLabels = [
    'Payment method for fees',
    ...(shouldShowLinkWithdrawalAccount ? ['Account for withdrawals'] : []),
    'Schedule a walk-thru',
    'Invite your team',
  ];
  const detailsActiveStep = {
    'fee-payment-method': 0,
    ...(shouldShowLinkWithdrawalAccount
      ? { 'link-account-for-withdrawals': 1 }
      : {}),
    'schedule-a-meeting': shouldShowLinkWithdrawalAccount ? 2 : 1,
    'invite-your-team': shouldShowLinkWithdrawalAccount ? 3 : 2,
  }[page];

  return (
    <Grid63Layout
      left={<FinishingUpContentStepper pageToDisplay={pageToDisplay} />}
      right={
        <DetailsSideStepper
          StepperLabels={DetailsStepperLabels}
          activeStep={detailsActiveStep}
        />
      }
      fixed
    />
  );
};
export default FinishingUpDetailsContainer;
