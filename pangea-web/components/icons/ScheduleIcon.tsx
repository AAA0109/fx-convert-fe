import Schedule from '@mui/icons-material/Schedule';
import { PangeaColors } from 'styles';
import { IconBorder } from './IconBorder';

export const ScheduleIcon = () => {
  return (
    <IconBorder>
      <Schedule
        sx={{
          height: '32px',
          width: '32px',
          color: `${PangeaColors.SolidSlateMedium}`,
        }}
      />
    </IconBorder>
  );
};
export default ScheduleIcon;
