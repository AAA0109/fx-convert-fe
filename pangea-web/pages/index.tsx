import { Card, Grid, Link as MLink, Typography } from '@mui/material';
import { ServerAuthHelper } from 'lib';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { REFRESH_TOKEN } from './api/login';

const Home = () => {
  return (
    <>
      <Head>
        <title>Pangea Prime</title>
        <link rel='icon' href='/images/favico.svg' />
      </Head>

      <Typography variant='h1'>Pangea Prime</Typography>
      <Grid container sx={{ flexGrow: 1 }}>
        <Grid item xl={6}>
          <Card
            sx={{
              backgroundColor: 'rgba(0,0,0, 0.2)',
              margin: 1,
              padding: 2,
            }}
          >
            <Link href='/dashboard' passHref>
              <MLink>
                <Typography variant='h4'>Dashboard &rarr;</Typography>
              </MLink>
            </Link>

            <Typography>Create and Manage Hedges</Typography>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (process.env.NO_REDIRECT_HOME) {
    return { props: {} };
  }

  const refreshToken = context.req.cookies[REFRESH_TOKEN];
  const loginProps = {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  };
  if (!refreshToken) {
    return loginProps;
  }

  try {
    const authManager = new ServerAuthHelper();
    const token = await authManager.refreshTokenAsync({
      refresh: refreshToken,
      access: '',
    });
    if (!token.access) {
      return loginProps;
    }
    return {
      redirect: {
        destination: '/dashboard/',
        permanent: false,
      },
    };
  } catch (e) {
    console.error(e);
    return loginProps;
  }
};

export default Home;
