import EditIcon from '@mui/icons-material/Edit';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SmsIcon from '@mui/icons-material/Sms';
import { Box, TextField, Typography } from '@mui/material';
import { Stack, alpha } from '@mui/system';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  clientApiState,
  pangeaAlertNotificationMessageState,
  userState,
} from 'atoms';
import { useLoading } from 'hooks/useLoading';
import { parseBoolean, rules, safeWindow } from 'lib';
import { isError } from 'lodash';
import { MuiTelInput } from 'mui-tel-input';
import { useRouter } from 'next/router';
import { ChangeEvent, MouseEventHandler, useState } from 'react';
import {
  useRecoilRefresher_UNSTABLE,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { PangeaColors } from 'styles';
import { IconBorder } from '../icons/IconBorder';
import { PangeaButton } from '../shared';
export const VerifyMobile = () => {
  const router = useRouter();
  const authHelper = useRecoilValue(clientApiState);
  const [checkFormValidation, setCheckFormValidation] = useState(false);
  const { loadingPromise, loadingState } = useLoading();
  const setAlert = useSetRecoilState(pangeaAlertNotificationMessageState);
  const refreshUser = useRecoilRefresher_UNSTABLE(userState);
  const [phone, setPhone] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [otc, setOtc] = useState<string>('');
  const [phoneValid, setPhoneValid] = useState(true);
  const handlePhoneUpdate = useEventCallback((newValue: string) => {
    setPhone(newValue);
    setPhoneValid(rules.phone(newValue));
  });
  const handleButtonClick = useEventCallback(async () => {
    setCheckFormValidation(true);
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

    setCodeSent(true);
  });
  const handleEditPhoneClick = useEventCallback(() => {
    setCodeSent(false);
    setPhone('');
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
      if (
        user.company &&
        user.company.id > 0 &&
        user.id != user.company.account_owner
      ) {
        router.push('/activation/successful-verification');
      } else {
        refreshUser();
        safeWindow()?.setTimeout(
          () => router.push('/activation/successful-verification'),
          500,
        );
      }
    };
    await loadingPromise(submitOtc());
  };
  return codeSent ? (
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
      <PangeaButton
        size='small'
        variant='outlined'
        startIcon={<EditIcon />}
        onClick={handleEditPhoneClick}
        sx={{ minWidth: '100px' }}
      >
        {phone}
      </PangeaButton>

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
  ) : (
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
        <PeopleAltIcon sx={{ fontSize: 30 }} />
      </IconBorder>
      <Typography component='h1' variant='h4' my={4}>
        User Verified
      </Typography>
      <Typography
        mb={3}
        variant='body1'
        color={PangeaColors.BlackSemiTransparent60}
      >
        Next, we&apos;ll need to verify your mobile phone number for urgent
        notification purposes.
      </Typography>
      <Stack spacing={2}>
        <MuiTelInput
          id='phone'
          value={phone}
          onChange={handlePhoneUpdate}
          size='medium'
          defaultCountry='US'
          label='Mobile Number'
          error={!phoneValid && checkFormValidation}
        />

        <Typography
          variant='helperText'
          px={2}
          textAlign='left'
          sx={{ mt: '10px!important' }}
          color={alpha(PangeaColors.Black, 0.6)}
        >
          By providing your mobile number, you agree to receive messages from
          Pangea.
        </Typography>
        <PangeaButton
          fullWidth
          variant='contained'
          onClick={handleButtonClick}
          size='large'
        >
          Confirm Mobile Number
        </PangeaButton>
      </Stack>
    </Box>
  );
};
export default VerifyMobile;
