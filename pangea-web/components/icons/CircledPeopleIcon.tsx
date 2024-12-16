import PeopleAlt from '@mui/icons-material/PeopleAlt';
import { IconBorder } from './IconBorder';

export const CircledPeopleIcon = () => {
  return (
    <IconBorder>
      <PeopleAlt
        sx={{
          height: '32px',
          width: '32px',
        }}
      />
    </IconBorder>
  );
};
export default CircledPeopleIcon;
