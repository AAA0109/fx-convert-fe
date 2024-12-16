import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ShieldIcon from '@mui/icons-material/Shield';
import {
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { GreenCircleCheck } from 'components/icons';
import { PangeaButton } from 'components/shared';
import { PangeaColors } from 'styles';

export const AccountActivatedSuccessState = () => {
  return (
    <Grid
      border={`1px solid ${PangeaColors.Gray}`}
      borderRadius='4px'
      sx={{ backgroundColor: PangeaColors.White }}
      xs={5}
      justifyContent={'center'}
      mt={6}
      mx={'auto'}
      px={3}
      container
    >
      <Stack alignItems={'center'} spacing={4} py={5} textAlign={'center'}>
        <GreenCircleCheck />
        <Typography component='h1' variant='h4'>
          Account Activated
        </Typography>
        <Typography variant='body1'>
          Next, you can start hedging in a few easy steps:
        </Typography>
        <List sx={{ width: '100%' }}>
          <ListItem sx={{ borderBottom: `1px solid ${PangeaColors.Gray}` }}>
            <ListItemAvatar>
              <CompareArrowsIcon
                sx={{ color: PangeaColors.BlackSemiTransparent60 }}
              />
            </ListItemAvatar>
            <ListItemText
              primary='1. Input cashflow details'
              secondary='Details like currency, amount, and payment direction'
            />
          </ListItem>
          <ListItem sx={{ borderBottom: `1px solid ${PangeaColors.Gray}` }}>
            <ListItemAvatar>
              <CandlestickChartIcon
                sx={{ color: PangeaColors.BlackSemiTransparent60 }}
              />
            </ListItemAvatar>
            <ListItemText
              primary='2. View projected risk'
              secondary='This may help you decide how much protection you need'
            />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <ShieldIcon sx={{ color: PangeaColors.BlackSemiTransparent60 }} />
            </ListItemAvatar>
            <ListItemText
              primary='3. Choose an appropriate hedge'
              secondary='You can choose a hedge preset or create a custom hedge'
            />
          </ListItem>
        </List>
        <PangeaButton
          href='/cashflow/'
          endIcon={<ArrowForwardIcon />}
          fullWidth
          size='large'
        >
          Add my first cashflow
        </PangeaButton>
      </Stack>
    </Grid>
  );
};
export default AccountActivatedSuccessState;
