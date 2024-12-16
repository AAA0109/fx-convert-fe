import { HelpOutline } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { Fragment } from 'react';
import { PangeaColors } from 'styles';
import PangeaTooltip from './PangeaTooltip';

type SummaryDataPointProps = {
  label: string;
  value?: string | number;
  loadingValue?: boolean;
  valueTestId?: string;
  toolTip?: string;
};

export const SummaryDataPoint = ({
  label,
  value,
  loadingValue = false,
  valueTestId,
  toolTip,
}: SummaryDataPointProps): JSX.Element => {
  return (
    <Stack
      direction='row'
      justifyContent='space-between'
      alignItems='center'
      spacing={4}
    >
      <Stack flexDirection={'row'} alignItems={'center'} gap={1}>
        <Typography
          variant='dataLabel'
          sx={{ lineHeight: '1.5rem', textAlign: 'left' }}
        >
          {label}
        </Typography>
        {toolTip && (
          <PangeaTooltip
            arrow
            placement='right'
            title={<Fragment>{toolTip}</Fragment>}
          >
            <HelpOutline
              sx={{
                color: PangeaColors.BlackSemiTransparent60,
              }}
            />
          </PangeaTooltip>
        )}
      </Stack>
      <Typography
        variant='dataBody'
        sx={{
          textTransform: 'uppercase',
          maxWidth: '70%',
          textAlign: 'right',
          ...(loadingValue ? { color: '#9b9b9b' } : {}),
        }}
        data-testid={valueTestId}
      >
        {value}
      </Typography>
    </Stack>
  );
};

export default SummaryDataPoint;
