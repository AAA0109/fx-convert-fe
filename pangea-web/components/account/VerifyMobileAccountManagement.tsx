import SmsIcon from '@mui/icons-material/Sms';
import { Box, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  clientApiState,
  pangeaAlertNotificationMessageState,
  userState,
} from 'atoms';
import { useLoading } from 'hooks/useLoading';
import { parseBoolean, rules } from 'lib';
import { isError } from 'lodash';
import { ChangeEvent, MouseEventHandler, useState } from 'react';
import {
  useRecoilRefresher_UNSTABLE,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { PangeaColors } from 'styles';
import { IconBorder } from '../icons/IconBorder';
import { PangeaButton } from '../shared';

type Props = {
  phone: string;
  toggleModalOpen: () => void;
};

export const VerifyMobileAccountManagement = ({
  phone,
  toggleModalOpen,
}: Props) => {
  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );
  const authHelper = useRecoilValue(clientApiState);
  const { loadingPromise, loadingState } = useLoading();
  const setAlert = useSetRecoilState(pangeaAlertNotificationMessageState);
  const refreshUser = useRecoilRefresher_UNSTABLE(userState);
  const [otc, setOtc] = useState<string>('');

  const handleButtonClick = useEventCallback(async () => {
    if (!rules.phone(phone)) {
      setAlert({
        severity: 'warning',
        text: 'Invalid phone number. Please try again.',
        timeout: 3000,
      });
      return;
    }

    const api = authHelper.getAuthenticatedApiHelper();
    const response = await api.sendOtcToPhoneAsync(phone);
    if (isError(response) || !parseBoolean(response.status)) {
      setAlert({
        severity: 'error',
        text: 'Failed to send one-time code. Please try again.',
      });
      return;
    }
  });

  const handleOtcChange = useEventCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setOtc(e.currentTarget.value.substring(0, 6));
    },
  );

  const handleSubmitOtc: MouseEventHandler<HTMLButtonElement> = async () => {
    const submitOtc = async () => {
      const api = authHelper.getAuthenticatedApiHelper();
      const response = await api.confirmOtcAsync(otc);

      if (isError(response)) {
        setAlert({
          severity: 'error',
          text: 'Failed to validate code. Please retry.',
        });

        return;
      }
      if (!parseBoolean(response.status)) {
        setAlert({
          severity: 'warning',
          text: 'Validation code incorrect. Please retry.',
        });
        return;
      }

      const user = await api.loadUserAsync();

      if (isError(user)) {
        setAlert({
          severity: 'error',
          text: 'Failed to load user. Please retry.',
        });

        return;
      }

      refreshUser();

      toggleModalOpen();

      setPangeaAlertNotificationMessage({
        text: 'You have saved your changes successfully!',
        severity: 'success',
      });
    };

    await loadingPromise(submitOtc());
  };

  return (
    <Box
      border={`1px solid ${PangeaColors.Gray}`}
      borderRadius='4px'
      sx={{ backgroundColor: PangeaColors.White }}
      justifyContent='center'
      mt={6}
      px={3}
      py={4}
      mx='auto'
      width='380px'
      textAlign='center'
    >
      <IconBorder>
        <SmsIcon
          sx={{ color: PangeaColors.SolidSlateMedium }}
          fontSize='large'
        />
      </IconBorder>
      <Typography component='h1' variant='h4' my={4}>
        Check your phone
      </Typography>
      <Typography
        mb={1}
        variant='body1'
        color={PangeaColors.BlackSemiTransparent60}
      >
        To continue, please enter the 6-digit verification code sent to:
      </Typography>
      <Typography mb={1} variant='body1' color={PangeaColors.SolidSlateMedium}>
        {phone}
      </Typography>
      <Stack
        spacing={2}
        direction='column'
        alignContent='center'
        justifyContent='center'
        textAlign='center'
      >
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
          }}
          value={otc}
          onChange={handleOtcChange}
          fullWidth
        />
        <Box display='inline-flex' alignItems='center' justifyContent='center'>
          <Typography variant='body2' color='gray'>
            Didn&apos;t receive a code?
          </Typography>
          <PangeaButton
            size='small'
            variant='text'
            disableElevation
            sx={{ minWidth: 0, minHeight: 0, m: 0, p: 0, ml: 1, pt: 0.4 }}
            onClick={handleButtonClick}
          >
            Resend
          </PangeaButton>
        </Box>
        <PangeaButton
          onClick={handleSubmitOtc}
          fullWidth
          loading={loadingState.isLoading}
        >
          Continue
        </PangeaButton>
      </Stack>
    </Box>
  );
};

export default VerifyMobileAccountManagement;
