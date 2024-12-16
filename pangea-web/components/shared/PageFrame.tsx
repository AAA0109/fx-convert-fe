import { Box, Typography } from '@mui/material';
import { ResponsiveStyleValue } from '@mui/system';
import type { Property as CSSProperty } from 'csstype';
import { ReactNode } from 'react';
import { PangeaColors } from 'styles';

interface PageFrameProps {
  borderLabel?: string;
  frameColor?: ResponsiveStyleValue<
    Optional<CSSProperty.Color | CSSProperty.Color[]>
  >;
  padding?: ResponsiveStyleValue<
    Optional<
      | CSSProperty.Padding<string | number>
      | CSSProperty.Padding<string | number>[]
    >
  >;
  children: ReactNode;
}

export const PageFrame = ({
  children,
  borderLabel,
  frameColor = PangeaColors.EarthBlueMedium,
  padding = '16px 0',
}: PageFrameProps) => {
  return (
    <Box
      border={'2px dashed'}
      borderColor={frameColor}
      borderRadius={2}
      display={'block'}
      position='relative'
      padding={padding}
    >
      <Box
        position={'absolute'}
        top={-16}
        right={100}
        bgcolor={PangeaColors.StoryWhiteMedium}
      >
        <Typography component='div' variant='h4' color={frameColor}>
          {borderLabel}
        </Typography>
      </Box>
      {children}
    </Box>
  );
};
export default PageFrame;
