import { Stack, Typography } from '@mui/material';

export const RiskToleranceHelperText = (props: {
  riskTolerance: string;
  showExpenseText?: boolean;
}) => {
  const { riskTolerance, showExpenseText = true } = props;

  let content = null;
  switch (riskTolerance) {
    case 'low':
      content = (
        <Stack spacing={2}>
          <Typography variant='small'>
            Removes 85% of volatility and caps losses to a price near or at 1
            standard deviation from current price.
          </Typography>
          {showExpenseText && (
            <Stack direction={'row'} justifyContent={'space-between'}>
              <Typography variant='caption'>Most Expensive</Typography>
              <Typography variant='body2' textAlign={'right'}>
                $$$
              </Typography>
            </Stack>
          )}
        </Stack>
      );
      break;
    case 'moderate':
      content = (
        <Stack spacing={2}>
          <Typography variant='small'>
            Removes 50% of volatility and caps losses to a price near or at 2
            standard deviations from current price.
          </Typography>
          {showExpenseText && (
            <Stack direction={'row'} justifyContent={'space-between'}>
              <Typography variant='caption'>Moderate Price</Typography>
              <Typography variant='body2' textAlign={'right'}>
                $$
              </Typography>
            </Stack>
          )}
        </Stack>
      );
      break;
    case 'high':
      content = (
        <Stack spacing={2}>
          <Typography variant='small'>
            Removes 25% of volatility and caps losses to a price near or at 3
            standard deviations from current price.
          </Typography>
          {showExpenseText && (
            <Stack direction={'row'} justifyContent={'space-between'}>
              <Typography variant='caption'>Least Expensive</Typography>
              <Typography variant='body2' textAlign={'right'}>
                $
              </Typography>
            </Stack>
          )}
        </Stack>
      );
      break;
    case 'custom':
      content = (
        <Stack spacing={2}>
          <Typography variant='small'>
            Customizing user-selected Risk Reduction levels and Hard Limits will
            affect every other cash flow&#40;s&#41; hedged under custom
            controls. Not recommended for most users.
          </Typography>
          {showExpenseText && (
            <Stack direction={'row'} justifyContent={'space-between'}>
              <Typography variant='caption'>User determined</Typography>
              <Typography variant='body2' textAlign={'right'}>
                $-$$$
              </Typography>
            </Stack>
          )}
        </Stack>
      );
      break;
  }
  return content;
};
export default RiskToleranceHelperText;
