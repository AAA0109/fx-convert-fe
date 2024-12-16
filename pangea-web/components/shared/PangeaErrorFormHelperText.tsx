import { FormHelperText } from '@mui/material';
import { PangeaColors } from 'styles';

interface PangeaErrorFormHelperTextProps {
  text: string;
  visible: boolean | undefined;
}

export const PangeaErrorFormHelperText = (
  props: PangeaErrorFormHelperTextProps,
) => {
  return (
    <>
      {props.visible && (
        <FormHelperText
          sx={{
            '&.MuiFormHelperText-root': {
              color: PangeaColors.RiskBerryMedium,
              marginTop: '5px',
            },
          }}
        >
          {props.text}
        </FormHelperText>
      )}
    </>
  );
};
export default PangeaErrorFormHelperText;
