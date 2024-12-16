import { Button, Grid, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { PangeaColors } from 'styles';

const LeavingPangea = () => {
  const router = useRouter();
  const [count, setCount] = useState(5);

  const { redirectUrl } = router.query;

  useEffect(() => {
    const timer = setInterval(() => setCount((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [setCount]);
  useEffect(() => {
    if (count <= 0) {
      router.push(redirectUrl as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);
  return (
    // center the Grid vertically and horizontally
    <Grid
      container
      direction='column'
      display='flex'
      justifyContent='center'
      alignItems='center'
      border={`1px solid ${PangeaColors.Gray}`}
      borderRadius='4px'
      mx='auto'
      my='250px'
      px={3}
      sx={{
        height: '300px',
        width: '416px',
        backgroundColor: PangeaColors.White,
      }}
    >
      <Grid item xs={4}>
        <Stack spacing={3} direction={'column'} alignItems={'center'}>
          <Image
            src='/images/IB-Logo.png'
            width={276}
            height={40}
            alt='IB Logo'
          />
          <Typography variant='h5'>you are entering a secure portal</Typography>
          <Typography variant='body1'>
            You will continue the application process on Interactive Broker’s
            secure portal.
          </Typography>
        </Stack>
        <Stack
          direction='row'
          justifyContent='center'
          alignItems='center'
          spacing={2}
          mt={2}
        >
          <Typography variant='body1'>
            Transferring in {count} seconds
          </Typography>
          <Button
            onClick={() => router.push(redirectUrl as string)}
            variant='text'
            size='large'
            sx={{
              color: PangeaColors.EarthBlueMedium,
            }}
          >
            Transfer Now
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default LeavingPangea;
