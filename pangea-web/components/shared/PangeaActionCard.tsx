import { Card } from '@mui/material';
import React from 'react';
import { PangeaColors } from 'styles';

interface PangeaActionCardProps {
  children: React.ReactNode;
  height?: string;
  width?: string;
  backgroundColor?: string;
  borderColor?: string;
  elevation?: number;
  marginTop?: string;
  sx?: object;
}

export const PangeaActionCard = (cardProps: PangeaActionCardProps) => {
  const {
    children,
    height = 'auto',
    width = 'auto',
    backgroundColor = PangeaColors.White,
    borderColor = PangeaColors.Gray,
    elevation = 0,
    marginTop = '96px',
    sx,
  } = cardProps;
  return (
    <Card
      elevation={elevation}
      sx={{
        border: `1px solid ${borderColor}`,
        mt: marginTop,
        backgroundColor: backgroundColor,
        borderColor: PangeaColors.Gray,
        height: height,
        width: width,
        ...sx,
      }}
    >
      {children}
    </Card>
  );
};
export default PangeaActionCard;
