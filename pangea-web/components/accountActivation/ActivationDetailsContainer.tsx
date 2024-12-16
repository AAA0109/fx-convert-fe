import { DetailsSideStepper } from 'components/shared';
import { Grid63Layout } from '../shared';
import { DetailsContentStepper } from './DetailsContentStepper';

interface ActivationDetailsContainerProps {
  page: string;
}

export const ActivationDetailsContainer = (
  props: ActivationDetailsContainerProps,
) => {
  const { page = 'company-details' } = props;
  const pageToDisplay = !page || page === '' ? 'company-details' : page;
  const DetailsStepperLabels = [
    'Company Details',
    'Company Address',
    'About You',
    'Your Address',
  ];
  const detailsActiveStep = {
    'company-details': 0,
    'company-address': 1,
    'about-you': 2,
    'your-address': 3,
  }[page];

  return (
    <Grid63Layout
      left={<DetailsContentStepper pageToDisplay={pageToDisplay} />}
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
export default ActivationDetailsContainer;
