import { Box, Stack, TextField, Typography } from '@mui/material';
import { ChangeEvent } from 'react';

export interface VerifyGoogleAuthOtcStepProps {
  handleOtcChange: (e: ChangeEvent<HTMLInputElement>) => void;
  authCode: string;
  deactivate: boolean;
}

export const VerifyGoogleAuthOtcStep = (
  props: VerifyGoogleAuthOtcStepProps,
) => {
  const { handleOtcChange, authCode, deactivate } = props;

  return (
    <Box>
      <Stack
        style={{ padding: '155px 24px 150px' }}
        spacing={4}
        direction='column'
        justifyContent='center'
        alignItems='center'
      >
        <Typography>Verify Google Authenticator</Typography>
        <Typography variant='body1'>
          Enter a code from Google Authenticator to{' '}
          {!deactivate
            ? 'make sure everything works'
            : 'deactivate two factor authentication'}
          .
        </Typography>
        <TextField
          label='6-digit code'
          size='medium'
          type='number'
          inputMode='numeric'
          InputProps={{
            sx: {
              'input::-webkit-outer-spin-button': {
                '-webkit-appearance': 'none',
                margin: 0,
              },
              'input::-webkit-inner-spin-button': {
                '-webkit-appearance': 'none',
                margin: 0,
              },
              input: {
                MozAppearance: 'textfield',
              },
            },
          }}
          sx={{
            marginTop: 2,
            width: '222px',
          }}
          value={authCode}
          onChange={handleOtcChange}
          fullWidth
        />
      </Stack>
    </Box>
  );
};

export default VerifyGoogleAuthOtcStep;
