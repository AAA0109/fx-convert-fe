import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import {
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import { HubSpotRequestCallback } from 'components/account';
import { PangeaPageTitle } from 'components/shared';

import Head from 'next/head';
import { PangeaColors } from 'styles';

const WelcomePage = () => {
  return (
    <>
      <Head>
        <title>Welcome to Pangea!</title>
      </Head>

      <Grid
        container
        direction={'column'}
        justifyContent='center'
        alignItems={'center'}
        pt={6}
      >
        <Grid mb={3} item>
          <PangeaPageTitle
            title='Welcome'
            color={PangeaColors.WarmOrangeMedium}
          />
        </Grid>
        <Grid
          p={4}
          border={`1px solid ${PangeaColors.Gray}`}
          borderRadius='4px'
          sx={{ backgroundColor: PangeaColors.White }}
          item
          xs={4}
        >
          <Typography mb={3} textAlign={'center'} variant='h4' component={'h2'}>
            Here&apos;s what to expect
          </Typography>
          <List
            sx={{
              '& .MuiListItemText-primary': {
                color: PangeaColors.BlackSemiTransparent87,
              },
              '& .MuiSvgIcon-root': {
                color: PangeaColors.BlackSemiTransparent50,
              },
              '& .MuiListItem-root': {
                width: 'fit-content',
              },
              marginBottom: '48px',
              maxWidth: '516px',
            }}
          >
            <ListItem>
              <ListItemAvatar>
                <CalendarTodayIcon />
              </ListItemAvatar>
              <ListItemText
                primary='For Today: Schedule a meeting'
                secondary='Book a 15 minute meeting with our team to get you set up.'
              />
            </ListItem>
            <Divider
              sx={{ borderColor: PangeaColors.Gray, margin: '16px 0' }}
            />
            <ListItem>
              <ListItemAvatar>
                <FileUploadIcon />
              </ListItemAvatar>
              <ListItemText
                primary='At your meeting: Account Activation'
                secondary="You'll upload necessary documents required by our partner."
              />
            </ListItem>
            <Divider
              sx={{ borderColor: PangeaColors.Gray, margin: '16px 0' }}
            />
            <ListItem>
              <ListItemAvatar>
                <CheckCircleIcon />
              </ListItemAvatar>
              <ListItemText
                primary='Once activated: You can hedge your first cashflow!'
                secondary='You’ll be able to create a hedge by adding your first cashflow.'
              />
            </ListItem>
          </List>
          <Typography
            mt={4}
            mb={1}
            textAlign={'center'}
            variant='h5'
            component={'h3'}
          >
            Schedule a meeting here:
          </Typography>
          <Typography
            mb={3}
            textAlign={'center'}
            variant='body2'
            color={PangeaColors.BlackSemiTransparent60}
          >
            This tool may take a moment to load.{' '}
          </Typography>
          <HubSpotRequestCallback />
          <Typography
            mb={3}
            textAlign={'center'}
            variant='body2'
            color={PangeaColors.BlackSemiTransparent60}
          >
            After scheduling, you may exit this page.
          </Typography>
          <Typography variant='body1' textAlign={'center'} maxWidth={'516px'}>
            Note: If you receive an invite email from InteractiveBrokers before
            your scheduled call, feel free to begin the application.
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};
export default WelcomePage;
