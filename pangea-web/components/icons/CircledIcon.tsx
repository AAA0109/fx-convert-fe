import { IconBorder } from './IconBorder';

interface CircledIconProps {
  icon: JSX.Element;
  iconBorderColor: string;
}

export const CircledIcon = (props: CircledIconProps) => {
  const { icon, iconBorderColor } = props;
  return (
    <IconBorder
      sx={{
        border: `4px solid ${iconBorderColor}`,
      }}
    >
      {icon}
    </IconBorder>
  );
};

export default CircledIcon;
