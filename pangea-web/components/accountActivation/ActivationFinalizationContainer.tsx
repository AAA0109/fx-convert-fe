import { DetailsSideStepper, Grid63Layout } from '../shared';
import { FinalizationContentStepper } from './FinalizationContentStepper';

interface ActivationFinalizationContainerProps {
  page: string;
}

export const ActivationFinalizationContainer = (
  props: ActivationFinalizationContainerProps,
) => {
  const { page } = props;

  const FinalizationStepperLabels = [
    'Collecting Documents',
    'Portal access',
    'IB Application',
  ];
  const finalizationActiveStep = {
    'collecting-documents': 0,
    'portal-access': 1,
    'interactive-broker-application': 2,
  }[page];

  return (
    <Grid63Layout
      fixed
      left={<FinalizationContentStepper pageToDisplay={page} />}
      right={
        <DetailsSideStepper
          StepperLabels={FinalizationStepperLabels}
          activeStep={finalizationActiveStep}
        />
      }
    />
  );
};
export default ActivationFinalizationContainer;
