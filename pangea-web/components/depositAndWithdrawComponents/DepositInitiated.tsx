import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { formatCurrency } from 'lib';
import { PangeaColors } from 'styles';

interface DepositInitiatedProps {
  deposit_amount: number;
  handleClose: () => void;
}
export const DepositInitiated = (props: DepositInitiatedProps) => {
  const { deposit_amount, handleClose } = props;

  const currentMonth = new Intl.DateTimeFormat('en-US', {
    month: 'long',
  }).format(new Date());
  const currentDay = new Date().getDate();
  return (
    <>
      <Box marginBottom={4}>
        <Typography variant='body2' textAlign='center' marginBottom={4}>
          +{formatCurrency(deposit_amount, 'USD', true, 0, 0)} from Wire
          Transfer
        </Typography>
        <List>
          <ListItem sx={{ borderBottom: `1px solid ${PangeaColors.Gray}` }}>
            <ListItemIcon>
              <CheckCircleIcon />
            </ListItemIcon>
            <ListItemText
              primary='Deposit Initiated'
              secondary={`Today ${currentMonth}, ${currentDay}`}
            ></ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AccessTimeIcon />
            </ListItemIcon>
            <ListItemText
              primary='Expected Completion'
              secondary='Within 5 business days'
            ></ListItemText>
          </ListItem>
        </List>
      </Box>
      <Typography variant='body2' marginBottom={4}>
        Please make sure to maintain a balance of{' '}
        {formatCurrency(deposit_amount, 'USD', true, 0, 0)} in your bank account
        until the funds are deducted to avoid any issues.
      </Typography>
      <Box
        marginBottom={4}
        display='flex'
        alignItems='center'
        border={`1px solid ${PangeaColors.RiskBerryMedium}`}
        borderRadius='4px'
        p={2}
      >
        <ErrorOutlineIcon
          sx={{
            color: PangeaColors.RiskBerryMedium,
          }}
        />
        <Typography variant='body2' marginLeft={1}>
          If you did not initiate a deposit, this margin will not go through.
        </Typography>
      </Box>
      <Button variant='contained' onClick={handleClose}>
        Close
      </Button>
    </>
  );
};
