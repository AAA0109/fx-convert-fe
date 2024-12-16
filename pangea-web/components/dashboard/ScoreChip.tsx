import { Box } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';
import Typography from '@mui/material/Typography';
import { PangeaColors } from 'styles';

export const ScoreChip = ({
  score,
  bgcolor,
  chipVariant = 'body1',
  chipWidth = 'auto',
}: {
  score: string;
  bgcolor: string | PangeaColors;
  chipVariant?: Variant;
  chipWidth?: string;
}) => {
  return (
    <Box
      width={chipWidth}
      sx={{
        display: 'inline-block',
      }}
    >
      <Typography
        variant={chipVariant}
        bgcolor={bgcolor}
        borderRadius='4px'
        padding={'6px'}
        display='flex'
        flexDirection='row'
        justifyContent='center'
      >
        {score}
      </Typography>
    </Box>
  );
};
export default ScoreChip;
