import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import { HubSpotRequestCallback } from 'components/account';
import { HelpScheduleCall } from 'components/help';
import { NoRouterTabbedComponent, PangeaActionCard } from 'components/shared';
import type { NextPage } from 'next';
import Head from 'next/head';
import { PangeaColors } from 'styles/colors';

const help: NextPage = () => {
  return (
    <>
      <Head>
        <title>Pangea - Help</title>
      </Head>
      <Typography
        component='h1'
        align='center'
        noWrap
        variant={'h1'}
        color={PangeaColors.BlackSemiTransparent87}
        margin={'16px 0'}
      >
        Get in touch
      </Typography>
      <Typography
        align='center'
        noWrap
        variant={'body1'}
        color={PangeaColors.BlackSemiTransparent87}
        margin={'16px 0'}
      >
        We’d love to hear from you. Please fill out this form.
      </Typography>
      <Grid
        container
        justifyContent='center'
        alignItems='center'
        direction='column'
        textAlign='center'
      >
        <PangeaActionCard marginTop='48px'>
          <Stack margin={2} direction='column'>
            <Typography marginBottom={1} variant='heroBody' align='left'>
              How can we help you?
            </Typography>

            <Typography
              variant='body2'
              color={PangeaColors.BlackSemiTransparent60}
              align='left'
            >
              Including as many details as possible will help us assist you.
            </Typography>
          </Stack>
          <Stack
            margin={2}
            spacing={2}
            width={'564px'}
            direction='column'
            justifyContent='center'
            alignItems='center'
          >
            <Paper
              component='form'
              elevation={0}
              sx={{
                backgroundColor: PangeaColors.White,
                height: '100%',
                width: '100%',
              }}
            >
              <NoRouterTabbedComponent
                container={Box}
                tabs={[
                  {
                    label: 'Schedule a call',
                    dataRoute: 'call',
                    component: HubSpotRequestCallback,
                  },
                  {
                    label: 'Contact us',
                    dataRoute: 'ContactUs',
                    component: HelpScheduleCall,
                  },
                ]}
              ></NoRouterTabbedComponent>
            </Paper>
          </Stack>
        </PangeaActionCard>
      </Grid>
    </>
  );
};

export default help;
