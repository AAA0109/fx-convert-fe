import { Suspense } from 'react';
import { AccountDetailsAboutYou } from './AccountDetailsAboutYou';
import { ActivationCompanyAddress } from './ActivationCompanyAddress';
import { ActivationCompanyDetails } from './ActivationCompanyDetails';
import { ActivationDetailsYourAddress } from './ActivationDetailsYourAddress';

interface DetailsContentStepperProps {
  pageToDisplay: string;
}
export const DetailsContentStepper = ({
  pageToDisplay,
}: DetailsContentStepperProps) => {
  switch (pageToDisplay) {
    case 'company-details':
      return (
        <Suspense>
          <ActivationCompanyDetails />
        </Suspense>
      );
    case 'company-address':
      return (
        <Suspense>
          <ActivationCompanyAddress />
        </Suspense>
      );
    case 'about-you':
      return (
        <Suspense>
          <AccountDetailsAboutYou />
        </Suspense>
      );
    case 'your-address':
      return (
        <Suspense>
          <ActivationDetailsYourAddress />
        </Suspense>
      );
    default:
      return <></>;
  }
};
export default DetailsContentStepper;
