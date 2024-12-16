import { StepIcon, StepIconProps } from '@mui/material';
import { PangeaColors } from 'styles';

export const StyledStepIcon = (props: Partial<StepIconProps>) => {
  if (!props.active && !props.completed) {
    return (
      <StepIcon
        {...props}
        icon=''
        sx={{
          fill: PangeaColors.White,
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: PangeaColors.BlackSemiTransparent38,
          borderRadius: '450px',
        }}
      />
    );
  } else if (props.active && !props.completed) {
    return (
      <StepIcon
        {...props}
        icon=''
        sx={{
          fill: PangeaColors.SolidSlateMedium,
          borderRadius: '450px',
        }}
      />
    );
  } else {
    return <StepIcon icon='' {...props} />;
  }
};
