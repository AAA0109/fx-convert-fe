import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShieldIcon from '@mui/icons-material/Shield';
import { Box, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { PangeaColors } from 'styles';

export const CostProtectionStack = ({
  cost,
  protection,
}: {
  cost: number;
  protection: number;
}) => {
  if (cost + protection == 0) {
    return null;
  }
  return (
    <>
      <Stack
        direction='row'
        justifyContent='flex-end'
        alignItems='center'
        spacing={1}
      >
        <Typography variant='body2'>Cost: </Typography>
        <Box p={0} m={0}>
          {new Array(3).fill(0).map((_v, i) => {
            return (
              <AttachMoneyIcon
                key={i}
                sx={{
                  color:
                    i < cost
                      ? PangeaColors.BlackSemiTransparent60
                      : PangeaColors.BlackSemiTransparent25,
                }}
              />
            );
          })}
        </Box>
      </Stack>
      <Stack
        direction='row'
        justifyContent='flex-end'
        alignItems='center'
        spacing={1}
      >
        <Typography variant='body2'>Protection: </Typography>{' '}
        <Box p={0} m={0}>
          {new Array(3).fill(0).map((_v, i) => {
            return (
              <ShieldIcon
                key={i}
                sx={{
                  color:
                    i < protection
                      ? PangeaColors.BlackSemiTransparent60
                      : PangeaColors.BlackSemiTransparent25,
                }}
              />
            );
          })}
        </Box>
      </Stack>
    </>
  );
};
export default CostProtectionStack;
