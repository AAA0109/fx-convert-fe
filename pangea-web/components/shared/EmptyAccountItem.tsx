import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { MenuItem, Stack, Typography } from '@mui/material';
import { PangeaColors } from 'styles/colors';

const EmptyAccountItem = ({
  currency,
  type,
}: {
  currency: string;
  type: string;
}) => {
  return (
    <MenuItem key={`no-${currency}-account`} value=''>
      <Stack direction='row' spacing={1} padding='10px'>
        <ErrorOutlineIcon sx={{ color: PangeaColors.RiskBerryLight }} />
        <Typography
          variant='body2'
          color={PangeaColors.BlackSemiTransparent60}
          textTransform='none'
        >
          You do not have any {type} accounts with {currency} currency.
          <br />
          Contact your administrator to help resolve this.
        </Typography>
      </Stack>
    </MenuItem>
  );
};

export default EmptyAccountItem;
