import { Box, Step, StepLabel, Stepper, StepperProps } from '@mui/material';

type TopLevelStepperProps = Pick<StepperProps, 'activeStep'> & {
  StepperLabels: string[];
};
export const TopLevelStepper = (props: TopLevelStepperProps) => {
  const { StepperLabels, activeStep } = props;
  return (
    <Box width={564} sx={{ display: 'flex', alignItems: 'center' }}>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ width: '100%' }}>
        {StepperLabels.map((label: string, i: number) => {
          return (
            <Step key={i} completed={(activeStep ?? -1) > i}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};
export default TopLevelStepper;
