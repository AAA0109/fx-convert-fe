import { Box, Stack, Typography } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';
import Image from 'next/image';
import { PangeaColors } from 'styles';
import { ScoreChip } from './ScoreChip';

export const ScoreContainer = ({
  label,
  score,
  svgUrl,
  chipColor,
  chipWidth = 'auto',
  chipVariant = 'body1',
}: {
  label: string;
  score: string;
  svgUrl?: string;
  chipColor?: string;
  chipWidth?: string;
  chipVariant?: Variant;
}) => {
  return (
    <Stack direction='column' alignItems={'center'}>
      <Stack direction={'row'} alignItems={'center'}>
        {svgUrl && (
          <Box
            sx={{
              marginRight: '4px',
            }}
          >
            <Image src={svgUrl} width={16} height={16} alt='icon' />
          </Box>
        )}

        <Typography variant={'body2'}>{label}</Typography>
      </Stack>
      <ScoreChip
        score={score}
        bgcolor={
          chipColor !== undefined ? chipColor : PangeaColors.SecurityGreenMedium
        }
        chipWidth={chipWidth}
        chipVariant={chipVariant}
      />
    </Stack>
  );
};
export default ScoreContainer;
