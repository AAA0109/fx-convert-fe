import { Icon, IconProps } from '@mui/material';
import { PangeaColors } from 'styles';

interface IconBorderProps extends IconProps {
  borderColor?: string;
}

export const IconBorder = (props: IconBorderProps) => {
  const { borderColor = PangeaColors.SolidSlateLighter, ...rest } = props;
  return (
    <>
      <Icon
        {...rest}
        sx={{
          color: PangeaColors.SolidSlateMedium,
          border: `4px solid ${borderColor}`,
          borderRadius: '100%',
          display: 'inline-block',
          padding: '8px',
          alignItems: 'center',
          height: '32px',
          width: '32px',
          ...props.sx,
        }}
      >
        {props.children}
      </Icon>
    </>
  );
};
export default IconBorder;
