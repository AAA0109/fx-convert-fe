import { Typography } from '@mui/material';
import Image from 'next/image';

interface RiskToleranceProps {
  riskTolerance: string;
}

export const RiskToleranceIcon = (props: RiskToleranceProps) => {
  const iconSuffix =
    ['low', 'moderate', 'high', 'custom'].indexOf(props.riskTolerance) >= 0
      ? props.riskTolerance
      : 'custom';
  return (
    <Typography
      variant='body2'
      display='flex'
      alignItems={'center'}
      style={{ textTransform: 'capitalize' }}
    >
      {
        <Image
          src={`/images/type-${iconSuffix}.svg`}
          width={19}
          height={19}
          alt='icon'
        />
      }
      &nbsp;{props.riskTolerance}
    </Typography>
  );
};
export default RiskToleranceIcon;
