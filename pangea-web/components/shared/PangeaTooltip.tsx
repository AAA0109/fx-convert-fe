import { Tooltip, TooltipProps } from '@mui/material';
import { tooltipClasses } from '@mui/material/Tooltip';
import styled from '@mui/system/styled';
import { PangeaColors, customTheme } from 'styles';

export const PangeaTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: PangeaColors.SolidSlateMedium,
    color: PangeaColors.White,
    maxWidth: 330,
    fontSize: customTheme.typography.small.fontSize,
    fontWeight: customTheme.typography.small.fontWeight,
  },
}));
export default PangeaTooltip;
