import { Paper, Stack, Typography } from '@mui/material';
import { isLoggedInState } from 'atoms';
import { PangeaButton } from 'components/shared';
import Image from 'next/image';
import { useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';

export const Footer = () => {
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const currentYear = new Date().getFullYear();
  return (
    <Paper
      component='footer'
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: PangeaColors.White,
        padding: '48px 64px',
      }}
    >
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Image
          src={'/images/pangea-logo.svg'}
          width={131}
          height={32}
          alt='Pangea logo'
          priority
        />
        <Stack direction={'row'} spacing={4}>
          <PangeaButton href='/legal/disclosures' variant='text'>
            Disclosures
          </PangeaButton>
          <PangeaButton href='/legal/terms' variant='text'>
            Terms
          </PangeaButton>
          <PangeaButton href='/legal/privacy' variant='text'>
            Privacy
          </PangeaButton>
          {(isLoggedIn && (
            <PangeaButton href='/account/help' variant='text'>
              Contact Us
            </PangeaButton>
          )) || (
            <PangeaButton href='/help' variant='text'>
              Contact Us
            </PangeaButton>
          )}
        </Stack>

        <Typography variant={'body2'}>
          &copy; {currentYear} Pangea Technologies
        </Typography>
      </Stack>
    </Paper>
  );
};
export default Footer;
