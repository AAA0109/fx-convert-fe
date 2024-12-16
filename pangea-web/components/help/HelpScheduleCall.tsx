import {
  Alert,
  Box,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import { apiHelper } from 'lib/apiHelpers';
import { rules } from 'lib/utils';
import { isError } from 'lodash';
import { ChangeEvent, useEffect, useState } from 'react';
import { PangeaColors } from 'styles/colors';
import { MaskedTextField, PangeaButton } from '../shared';

export type helpFormFieldsType = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message_help: string;
  subject: string;
  privacy_policy: boolean;
};

export const HelpScheduleCall = () => {
  const [validForm, setValidForm] = useState<boolean>(false);
  const [helpMessageData, setHelpMessageData] = useState<helpFormFieldsType>({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    message_help: '',
    subject: 'help message',
    privacy_policy: false,
  });

  const [errorMessageState, setErrorMessageState] = useState({
    email: [],
    phone: [],
    first_name: [],
    last_name: [],
    message_help: [],
    privacy_policy: [],
  });

  const [messageSent, setMessageSent] = useState(false);
  const [messageFailed, setMessageFailed] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const [formValidation, setFormValidation] = useState({
    first_name: true,
    last_name: true,
    phone: true,
    email: true,
    message_help: true,
  });

  useEffect(() => {
    if (!helpMessageData) {
      return;
    }
    setValidForm(
      Object.values(formValidation).every((value) => value === true) &&
        Object.values(helpMessageData).every(
          (value) => value != '' && value != undefined,
        ),
    );
  }, [setValidForm, formValidation, helpMessageData]);

  const handleSendData = async () => {
    const { first_name, last_name, subject, message_help, email, phone } =
      helpMessageData;

    await apiHelper()
      .sendGeneralSupportMessageAsync(
        first_name,
        last_name,
        subject,
        message_help,
        email,
        phone,
      )
      .then((response) => {
        if (response.message == 'Success') {
          setMessageSent(true);
          setAlertMessage("Message sent! We'll reach out as soon as we can.");
        } else if (isError(response)) {
          setMessageFailed(true);
          setAlertMessage(
            'There was a problem sending your message, please try again later',
          );
        }
      });
  };

  const handleCheckboxUpdate = (event: any) => {
    setHelpMessageData({
      ...helpMessageData,
      [event.target.name]: !helpMessageData.privacy_policy,
    });
  };

  const handleInputUpdate = useEventCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!helpMessageData) {
        return;
      }
      if (!event.target) {
        return;
      }
      const value = event.target.value;
      const name = event.target.name;

      setFormValidation({
        ...formValidation,
        [name]: rules[name](value),
      });

      setErrorMessageState({
        ...errorMessageState,
        [event.target.name]: [],
      });

      setHelpMessageData({
        ...helpMessageData,
        [event.target.name]: event.target.value,
      });
    },
  );

  return (
    <Box sx={{ flexGrow: 1 }} component='form'>
      <Grid container spacing={3} paddingTop={2} paddingBottom={2}>
        {!messageSent && !messageFailed && (
          <>
            <Grid item xs={6}>
              <TextField
                fullWidth
                required
                id='first-name'
                label='First Name'
                name='first_name'
                variant='filled'
                error={!formValidation.first_name}
                value={helpMessageData.first_name}
                onChange={handleInputUpdate}
              />
              {!formValidation.first_name && (
                <FormHelperText
                  sx={{ color: `${PangeaColors.RiskBerryMedium}` }}
                  id='first-name-helper-text'
                >
                  Please enter your name
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                id='last-name'
                label='Last Name'
                variant='filled'
                name='last_name'
                required
                error={!formValidation.last_name}
                value={helpMessageData.last_name}
                onChange={handleInputUpdate}
              />
              {!formValidation.last_name && (
                <FormHelperText
                  sx={{ color: `${PangeaColors.RiskBerryMedium}` }}
                  id='last_name-helper-text'
                >
                  Please enter your last name
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                id='email'
                label='Email Address'
                variant='filled'
                name='email'
                type='email'
                error={!formValidation.email}
                value={helpMessageData.email}
                required
                onChange={handleInputUpdate}
              />
              {!formValidation.email && (
                <FormHelperText
                  sx={{ color: `${PangeaColors.RiskBerryMedium}` }}
                  id='email-helper-text'
                >
                  Please enter a valid email
                </FormHelperText>
              )}
              {errorMessageState?.email?.map((item, i) => {
                return (
                  <FormHelperText
                    sx={{ color: `${PangeaColors.RiskBerryMedium}` }}
                    key={i}
                  >
                    {item}
                  </FormHelperText>
                );
              })}
            </Grid>
            <Grid item xs={6}>
              <MaskedTextField
                type='phone'
                fullWidth
                id='phone'
                label='Phone Number'
                variant='filled'
                name='phone'
                error={!formValidation.phone}
                value={helpMessageData.phone}
                required
                onChange={handleInputUpdate}
                apiErrorMessages={errorMessageState?.phone}
              />
            </Grid>
          </>
        )}
        {messageSent && (
          <Grid item xs={12}>
            <Alert variant={'outlined'}>
              <Typography variant={'body1'}>{alertMessage}</Typography>
            </Alert>
          </Grid>
        )}
        {messageFailed && (
          <Grid item xs={12}>
            <Alert severity='error' variant={'outlined'}>
              <Typography variant={'body1'}>{alertMessage}</Typography>
            </Alert>
          </Grid>
        )}
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            multiline
            id='message_help'
            label='Your Message'
            name='message_help'
            variant='filled'
            rows={4}
            error={!formValidation.message_help}
            value={helpMessageData.message_help}
            onChange={handleInputUpdate}
          />
        </Grid>

        {!messageSent && !messageFailed && (
          <Grid item alignItems='left'>
            <FormControlLabel
              control={
                <Checkbox
                  name='privacy_policy'
                  checked={helpMessageData.privacy_policy}
                  value={helpMessageData.privacy_policy}
                  onChange={handleCheckboxUpdate}
                />
              }
              label='You agree to our privacy policy.'
            />
          </Grid>
        )}
      </Grid>
      <PangeaButton
        variant='contained'
        fullWidth={true}
        onClick={handleSendData}
        disabled={!validForm}
      >
        Send Message
      </PangeaButton>
    </Box>
  );
};
export default HelpScheduleCall;
