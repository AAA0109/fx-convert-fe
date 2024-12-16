import { Box, Step, StepLabel, Stepper, StepperProps } from '@mui/material';
import { PangeaColors } from 'styles';
import { StyledStepIcon } from './StyledStepIcon';

type TopLevelStepperProps = Pick<StepperProps, 'activeStep'> & {
  StepperLabels: string[];
};

export const DetailsSideStepper = (props: TopLevelStepperProps) => {
  const { StepperLabels, activeStep } = props;
  return (
    <Box
      sx={{
        backgroundColor: PangeaColors.White,
        borderColor: PangeaColors.Gray,
        borderStyle: 'solid',
        borderWidth: 1,
        padding: '24px',
      }}
      flexGrow={1}
    >
      <Stepper
        activeStep={activeStep}
        orientation='vertical'
        variant='elevation'
      >
        {StepperLabels.map((label: string, i: number) => {
          return (
            <Step key={i} completed={(activeStep ?? -1) > i}>
              <StepLabel StepIconComponent={StyledStepIcon}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};
export default DetailsSideStepper;
