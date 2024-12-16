import Add from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import { Box, IconButton, Stack, TextField, Typography } from '@mui/material';
import { clientApiState, pangeaAlertNotificationMessageState } from 'atoms';
import axios, { AxiosError } from 'axios';
import { useLoading } from 'hooks/useLoading';
import { isError } from 'lodash';
import { ChangeEvent, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { PangeaColors } from 'styles';
import { v4 as uuidv4 } from 'uuid';
import isEmail from 'validator/lib/isEmail';
import { CircledPeopleIcon } from '../icons/CircledPeopleIcon';
import { PangeaButton } from '../shared';
import { PangeaGroupEnum } from 'lib';

export const InviteYourTeam = () => {
  const authHelper = useRecoilValue(clientApiState);
  const { loadingState, loadingPromise } = useLoading();
  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );
  interface inputFieldsType {
    id: string;
    valid: boolean;
    email: string;
  }

  const [inputFields, setInputFields] = useState<inputFieldsType[]>([
    { id: uuidv4(), email: '', valid: false },
  ]);

  const handleUserInvite = async () => {
    const inviteUser = async () => {
      await Promise.all(
        inputFields.map(async (inputField) => {
          try {
            const api = authHelper.getAuthenticatedApiHelper();
            const res = await api
              // set email to the objects within the array
              .inviteUsersAsync(
                inputField.email,
                PangeaGroupEnum.CustomerViewer,
              );
            if (res && !isError(res)) {
              setPangeaAlertNotificationMessage({
                severity: 'success',
                text: 'The invite has been sent',
              });
            } else if (axios.isAxiosError(res)) {
              const axiosError = res as AxiosError<any>;
              const resText = JSON.parse(
                axiosError?.response?.request?.responseText,
              );
              switch (true) {
                case Object.hasOwn(resText, 'detail'):
                  setPangeaAlertNotificationMessage({
                    severity: 'error',
                    text: resText.detail,
                  });
                  break;
                case Object.hasOwn(resText, 'email'):
                  setPangeaAlertNotificationMessage({
                    severity: 'error',
                    text: resText.email,
                  });
                  break;
              }
            }
          } catch {
            setPangeaAlertNotificationMessage({
              severity: 'error',
              text: 'There was an error sending invite email.',
            });
          }
        }),
      );
    };
    await loadingPromise(inviteUser());
  };

  const handleChangeInput = (
    id: string,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newInputFields = inputFields.map((i) => {
      if (id === i.id) {
        i.email = event.target.value;
      }
      return i;
    });

    setInputFields(newInputFields);
  };

  const HandleAddFields = () => {
    setInputFields([...inputFields, { id: uuidv4(), email: '', valid: false }]);
  };

  const handleRemoveFields = (id: string) => {
    const values = [...inputFields];
    values.splice(
      values.findIndex((value) => value.id === id),
      1,
    );
    setInputFields(values);
  };

  return (
    <Box
      border={`1px solid ${PangeaColors.Gray}`}
      borderRadius='4px'
      sx={{ backgroundColor: PangeaColors.White }}
      justifyContent='center'
      mt={0}
      px={3}
      py={4}
      width='480px'
      textAlign='center'
    >
      <Stack alignItems={'center'} spacing={4} textAlign={'center'}>
        <CircledPeopleIcon />
        <Typography component='h1' variant='h4'>
          Your team{' '}
        </Typography>
        <Typography variant='body1'>
          Next, let&apos;s invite your team.
        </Typography>

        {inputFields.length === 1 ? (
          <TextField
            sx={{ width: '100%' }}
            label='Email'
            name='email'
            value={inputFields[0].email}
            error={
              inputFields[0].email !== '' && !isEmail(inputFields[0].email)
            }
            onChange={(event) => handleChangeInput(inputFields[0].id, event)}
          />
        ) : (
          inputFields.map((inputField) => (
            <Stack
              key={inputField.id}
              direction={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
              sx={{ width: '100%' }}
            >
              <TextField
                sx={{ width: '90%' }}
                label='Email'
                name='email'
                value={inputField.email}
                error={inputField.email !== '' && !isEmail(inputField.email)}
                onChange={(event) => handleChangeInput(inputField.id, event)}
              />
              <IconButton
                onClick={() => handleRemoveFields(inputField.id)}
                aria-label='delete'
              >
                <CloseOutlined />
              </IconButton>
            </Stack>
          ))
        )}
        <Stack
          direction='column'
          justifyContent='center'
          alignItems='flex-start'
          sx={{ width: '100%' }}
        >
          <PangeaButton
            sx={{ minWidth: '84px', color: PangeaColors.EarthBlueMedium }}
            startIcon={<Add />}
            onClick={HandleAddFields}
            variant='text'
          >
            add another
          </PangeaButton>
        </Stack>

        <Stack
          direction={'row'}
          justifyContent='space-between'
          spacing={2}
          mt={3}
          width={'100%'}
        >
          <PangeaButton
            href='/activation/account-activated'
            size='large'
            variant='outlined'
          >
            skip for now
          </PangeaButton>
          <PangeaButton
            loading={loadingState.isLoading}
            endIcon={<ArrowForwardIcon />}
            size='large'
            onClick={handleUserInvite}
            disabled={inputFields.some(
              (inputField) =>
                inputField.email === '' || !isEmail(inputField.email),
            )}
          >
            send invite
          </PangeaButton>
        </Stack>
      </Stack>
    </Box>
  );
};
export default InviteYourTeam;
