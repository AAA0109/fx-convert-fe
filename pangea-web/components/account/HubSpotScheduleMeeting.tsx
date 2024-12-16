import { Box, Grid, Stack, Typography } from '@mui/material';
import Script from 'next/script';
import { PangeaColors } from 'styles';
import { ScheduleIcon } from '../icons/ScheduleIcon';
import { PangeaButton } from '../shared';

export const HubSpotScheduleMeeting = () => {
  return (
    <>
      <Grid
        border={`1px solid ${PangeaColors.Gray}`}
        borderRadius='4px'
        sx={{ backgroundColor: PangeaColors.White }}
        justifyContent={'center'}
        mt={0}
        mx={'auto'}
        px={3}
        container
        width={'564px'}
      >
        <Stack alignItems={'center'} spacing={4} py={5} textAlign={'center'}>
          <ScheduleIcon />
          <Typography component='h1' variant='h4'>
            Schedule a walkthrough
          </Typography>
          <Typography variant='body1'>
            We&apos;ll walk you through everything you need to know about
            hedging with Pangea.
          </Typography>
          <Script
            defer
            type='text/javascript'
            src='https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js'
          ></Script>
          <Box
            className='meetings-iframe-container'
            data-src='https://meetings.hubspot.com/mike2238/onboarding?embed=true'
            height={'650px'}
            width={'100%'}
          ></Box>
          <Stack
            direction={'row'}
            justifyContent='space-between'
            alignItems='center'
            width={'100%'}
            spacing={2}
          >
            <PangeaButton
              href='/activation/finishing-up/invite-your-team'
              fullWidth
              size='large'
              variant='outlined'
            >
              skip for now
            </PangeaButton>
            <PangeaButton
              fullWidth
              size='large'
              href='/activation/finishing-up/invite-your-team'
            >
              I scheduled a meeting
            </PangeaButton>
          </Stack>
        </Stack>
      </Grid>
    </>
  );
};
export default HubSpotScheduleMeeting;
