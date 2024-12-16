import { Stack, Typography } from '@mui/material';
import { HttpErrorStatusCode } from 'lib';
import { PangeaColors, customTheme } from 'styles';
import { PangeaButton } from '.';
import GridLayoutOneTenOne from './GridLayoutOneTenOne';
import { useRouter } from 'next/router';
import { MouseEvent } from 'react';

type Props = {
  statusCode: HttpErrorStatusCode;
  title: string;
  description: string;
};

export function HttpErrorStatusDisplay({
  statusCode,
  title,
  description,
}: Props): JSX.Element {
  const router = useRouter();
  const handleHomeClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('Home Clicked');
    router.push('/');
  };
  return (
    <GridLayoutOneTenOne>
      <Stack spacing={2}>
        <Typography
          variant='h5'
          style={{ color: PangeaColors.SolidSlateMedium, marginTop: '217px' }}
        >
          {statusCode} {HttpErrorStatusCode[statusCode].replace(/_/gi, ' ')}
        </Typography>
        <Typography
          variant='h1'
          style={{
            color: PangeaColors.BlackSemiTransparent87,
            marginTop: '12px',
          }}
        >
          {title}
        </Typography>
        <Typography
          variant='body1'
          style={{
            color: PangeaColors.BlackSemiTransparent60,
            marginTop: '24px',
          }}
        >
          {description}
        </Typography>
        <Stack direction='row'>
          <PangeaButton
            onClick={handleHomeClick}
            size={'large'}
            sx={{
              width: 'auto',
              height: '56px',
              mt: '48px',
              ...customTheme.typography.h6,
            }}
          >
            Take me home
          </PangeaButton>
        </Stack>
      </Stack>
    </GridLayoutOneTenOne>
  );
}

export default HttpErrorStatusDisplay;
