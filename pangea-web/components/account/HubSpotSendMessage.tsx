import Call from '@mui/icons-material/Call';
import Email from '@mui/icons-material/Email';
import Message from '@mui/icons-material/Message';
import {
  Alert,
  Box,
  FormControlLabel,
  FormGroup,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import {
  clientApiState,
  pangeaAlertNotificationMessageState,
  userState,
} from 'atoms';
import axios from 'axios';
import { useLoading } from 'hooks/useLoading';
import { MessageMode, PangeaUser } from 'lib';
import { isError } from 'lodash';
import { ChangeEvent, useEffect, useState } from 'react';
import {
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';
import { PangeaColors } from 'styles';
import { PangeaButton, PangeaLoading, PangeaTextField } from '../shared';
import { ResponseTypeSelection } from './ResponseTypeSelection';

enum SubmitState {
  idle = 0, // no send action taken
  requested, // request sent response:
  error, // request received response: error
  success, // request received response: success
}

const validateMessage = (message: string): boolean => {
  // TODO: Sanitization of input, validation, etc.
  return message.length > 3;
};
const iconSX = {
  fontSize: `2rem`,
  marginRight: '10px',
  marginLeft: '0px',
  verticalAlign: 'middle',
  color: PangeaColors.SolidSlateLight,
};
const buttonSX = { width: '242px', height: '42px' };
const MessageModeIcon: JSX.Element[] = [
  <Email sx={iconSX} key={'samMode_email'} />,
  <Call sx={iconSX} key={'samMode_phone'} />,
  <Message key={'samMode_text'} />,
];

export const HubSpotSendMessage = (): JSX.Element => {
  const authHelper = useRecoilValue(clientApiState);
  const userInfo = useRecoilValueLoadable(userState).getValue();
  const { loadingState, loadingPromise } = useLoading();
  const displaySection = (id: number): string => {
    return submitState === id ? '' : 'none';
  };

  const updateMessageMode = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setMessageMode(Number(event.target.value));
  };

  const getRequestMode = (userInfo: Nullable<PangeaUser>): Optional<string> => {
    switch (messageMode) {
      case MessageMode.email:
        return userInfo?.email ?? '';
      case MessageMode.phone:
        return userInfo?.phone ?? '';
      case MessageMode.text:
        return userInfo?.phone ?? '';
    }
  };

  const handleMessageOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );
  const handleSubmit = async () => {
    const submitRequest = async () => {
      setSubmitState(SubmitState.requested);
      const api = authHelper.getAuthenticatedApiHelper();
      const sendMessageResponse = await api.sendSupportMessageAsync(
        `SUPPORT MESSAGE: DEV TEST: SUBJECT TBD/TODO`,
        `REPLY METHOD: ${messageMode}\nMESSAGE: ${message}`,
      );
      if (sendMessageResponse && !isError(sendMessageResponse)) {
        setSubmitState(SubmitState.success);
        setPangeaAlertNotificationMessage({
          text: 'Your message has been sent',
          severity: 'success',
        });
      } else if (axios.isAxiosError(sendMessageResponse)) {
        setSubmitState(SubmitState.error);
        setPangeaAlertNotificationMessage({
          text: 'There was a problem sending your message',
          severity: 'error',
        });
      }
    };
    await loadingPromise(submitRequest());
  };
  const handleReset = () => {
    setMessage('');
    setMessageMode(MessageMode.email);
    setSubmitState(SubmitState.idle);
  };

  const [submitState, setSubmitState] = useState(SubmitState.idle);
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [message, setMessage] = useState('');
  const [messageMode, setMessageMode] = useState(MessageMode.email);
  useEffect(() => {
    validateMessage(message) ? setDisableSubmit(false) : setDisableSubmit(true);
  }, [message, disableSubmit, messageMode]);

  return (
    <>
      <Stack
        width={'100%'}
        justifyContent={'space-around'}
        spacing={3}
        sx={{ display: displaySection(SubmitState.idle) }}
      >
        <FormControlLabel
          control={<Typography variant={'body1'} />}
          label={'What is this about?'}
          sx={{ marginLeft: 0 }} // required to override 'out-denting' the label text
        />
        <PangeaTextField
          onChange={handleMessageOnChange}
          multiline
          value={message}
        />
        <FormControlLabel
          control={<Typography variant={'body1'} />}
          label={'How should we reach you?'}
          sx={{ marginLeft: 0 }}
        />
        <RadioGroup value={messageMode} onChange={updateMessageMode}>
          <Stack justifyContent={'space-between'} spacing={0} width={'100%'}>
            {userInfo?.email &&
              ResponseTypeSelection(
                MessageMode.email,
                'Email me',
                userInfo?.email,
                <Email sx={iconSX} />,
              )}
            {userInfo?.phone &&
              ResponseTypeSelection(
                MessageMode.phone,
                'Call me',
                userInfo?.phone,
                <Call sx={iconSX} />,
              )}
            {userInfo?.phone &&
              ResponseTypeSelection(
                MessageMode.text,
                'Text me',
                userInfo?.phone,
                <Message sx={iconSX} />,
              )}
          </Stack>
        </RadioGroup>
        <FormGroup>
          <Stack direction={'row'} justifyContent={'space-between'}>
            <PangeaButton
              variant={'outlined'}
              sx={buttonSX}
              onClick={handleReset}
            >
              Cancel
            </PangeaButton>
            <PangeaButton
              disabled={disableSubmit}
              sx={buttonSX}
              onClick={handleSubmit}
              loading={loadingState.isLoading}
            >
              Send
            </PangeaButton>
          </Stack>
        </FormGroup>
      </Stack>
      <Stack
        justifyContent={'space-between'}
        spacing={2}
        sx={{ display: displaySection(SubmitState.requested) }}
      >
        <PangeaLoading />
        <Typography variant={'body1'} textAlign='center'>
          Your message is being sent...
        </Typography>
      </Stack>
      <Stack
        justifyContent={'space-between'}
        spacing={2}
        sx={{ display: displaySection(SubmitState.success) }}
      >
        <Alert variant={'outlined'}>
          <Typography variant={'body1'}>
            Message sent! We&apos;ll reach out as soon as we can.
          </Typography>
        </Alert>
        <Box>
          <Typography>Your message:</Typography>
          <Typography
            sx={{
              justifyContent: 'space-around',
              border: `1px solid ${PangeaColors.Gray}`,
              borderRadius: '5px',
              padding: 2,
            }}
          >
            {message}
          </Typography>
        </Box>
        <Stack>
          <Typography>We&apos;ll reach out via:</Typography>
          <Stack
            direction={'row'}
            sx={{
              justifyContent: 'flex-start',
              border: `1px solid ${PangeaColors.Gray}`,
              borderRadius: '5px',
              padding: 2,
            }}
          >
            <Typography>
              {MessageModeIcon[messageMode]}
              {getRequestMode(userInfo) ?? ''}
            </Typography>
          </Stack>
        </Stack>
        <PangeaButton onClick={handleReset}>New Message</PangeaButton>
      </Stack>
    </>
  );
};
export default HubSpotSendMessage;
