import Check from '@mui/icons-material/Check';
import { PangeaColors } from 'styles';
import { IconBorder } from './IconBorder';

export const GreenCircleCheck = () => {
  return (
    <IconBorder
      sx={{
        border: `4px solid ${PangeaColors.SecurityGreenMedium}`,
      }}
    >
      <Check
        sx={{
          height: '32px',
          width: '32px',
          color: `${PangeaColors.SecurityGreenMedium}`,
        }}
      />
    </IconBorder>
  );
};
export default GreenCircleCheck;
