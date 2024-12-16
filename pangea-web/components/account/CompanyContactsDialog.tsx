import Close from '@mui/icons-material/Close';
import FormatListNumbered from '@mui/icons-material/FormatListNumbered';
import {
  Dialog,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  accountContactOrderState,
  accountContactsState,
  clientApiState,
  contactOrdersRequestState,
  pangeaAlertNotificationMessageState,
  userCompanyState,
} from 'atoms';
import { addSeconds } from 'date-fns';
import { useLoading } from 'hooks/useLoading';
import { ContactPriority, safeWindow, setAlpha } from 'lib';
import { isError } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import {
  useRecoilRefresher_UNSTABLE,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { PangeaColors } from 'styles';
import { PangeaButton } from '../shared';

export const CompanyContactsDialog = () => {
  const { loadingState, loadingPromise } = useLoading();
  const userCo = useRecoilValue(userCompanyState);
  const accountContacts = useRecoilValue(accountContactsState(userCo?.id));
  const priorityContacts = useRecoilValue(accountContactOrderState(userCo?.id));
  const companyHasOnlyOneUser = (accountContacts?.length ?? 0) <= 1;
  const refreshContacts = useRecoilRefresher_UNSTABLE(
    accountContactsState(userCo?.id),
  );
  const setAllContactOrderRequest = useSetRecoilState(
    contactOrdersRequestState,
  );
  const [open, setOpen] = useState(false);
  const authHelper = useRecoilValue(clientApiState);
  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );

  const [isValid, setIsValid] = useState(false);
  useEffect(() => refreshContacts(), [refreshContacts]);
  const getSortOrder = useCallback(
    (userId: number): ContactPriority => {
      const theContact = priorityContacts?.find((contact) => {
        return contact.user === userId;
      });
      switch (theContact?.sort_order) {
        case 0:
          return ContactPriority.Primary;
        case 1:
          return ContactPriority.Secondary;
        default:
          return ContactPriority.Tertiary;
      }
    },
    [priorityContacts],
  );
  const getPrimaryIdFromRecoil = useCallback(() => {
    const user = accountContacts?.find((contact) => {
      return getSortOrder(contact.id) === ContactPriority.Primary;
    });
    return user?.id;
  }, [accountContacts, getSortOrder]);

  const getSecondaryIdFromeRecoil = useCallback(() => {
    const user = accountContacts?.find((contact) => {
      return getSortOrder(contact.id) === ContactPriority.Secondary;
    });
    return user?.id;
  }, [accountContacts, getSortOrder]);

  const [selectPrimaryID, setSelectPrimaryID] = useState<number>(
    priorityContacts?.at(0)?.user ?? -1,
  );
  const [selectSecondaryID, setSelectSecondaryID] = useState<number>(
    priorityContacts?.at(1)?.user ?? -1,
  );

  const validateSelections = useCallback(() => {
    return (
      selectPrimaryID !== selectSecondaryID &&
      (companyHasOnlyOneUser ||
        selectPrimaryID !== getPrimaryIdFromRecoil() ||
        selectSecondaryID !== getSecondaryIdFromeRecoil())
    );
  }, [
    selectPrimaryID,
    selectSecondaryID,
    companyHasOnlyOneUser,
    getPrimaryIdFromRecoil,
    getSecondaryIdFromeRecoil,
  ]);

  const handlePrimarySelectUpdate = useEventCallback(
    (event: SelectChangeEvent) => {
      if (selectPrimaryID === undefined) {
        return;
      }
      setSelectPrimaryID(Number(event.target.value));
    },
  );

  const handleSecondarySelectUpdate = useEventCallback(
    (event: SelectChangeEvent) => {
      if (selectSecondaryID === undefined) {
        return;
      }
      setSelectSecondaryID(Number(event.target.value));
    },
  );

  const handleAPIUpdateRequest = useEventCallback(async () => {
    // TODO: API response codes don't return anything usable?
    const reqObject = {
      user_sort_order: companyHasOnlyOneUser
        ? [selectPrimaryID]
        : [selectPrimaryID, selectSecondaryID],
    };
    const coId = userCo?.id;
    if (!coId) {
      setPangeaAlertNotificationMessage({
        severity: 'error',
        text: 'An unexpected problem occurred.',
      });
      return;
    }
    const updateRequest = async () => {
      try {
        const api = authHelper.getAuthenticatedApiHelper();
        const res = await api.updateContactOrder(coId, reqObject, {});
        if (res && !isError(res)) {
          // success
          setPangeaAlertNotificationMessage({
            severity: 'success',
            text: 'Company contact priority orders have been updated',
          });
          safeWindow()?.setTimeout(() => {
            setAllContactOrderRequest((previousTime) => {
              const now = Number(new Date());
              const timeForRefresh = Number(addSeconds(previousTime, 10)); //10 seconds from the previous refresh.
              return now > timeForRefresh ? now : timeForRefresh;
            });
          }, 300);
        }
      } catch {
        setPangeaAlertNotificationMessage({
          severity: 'error',
          text: 'There was an error updating the contact order priority.',
        });
      }
      handleClose();
    };

    await loadingPromise(updateRequest());
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = useEventCallback(() => {
    setOpen(false);
  });

  useEffect(() => {
    setIsValid(validateSelections());
  }, [selectPrimaryID, selectSecondaryID, validateSelections]);

  if (!accountContacts) {
    console.error(new Error('no account contacts returned from API').message);
    return <Skeleton />;
  }
  return (
    <>
      <PangeaButton
        onClick={handleClickOpen}
        startIcon={<FormatListNumbered />}
      >
        Choose contact order
      </PangeaButton>
      <Dialog
        sx={{
          '& .MuiDialog-paper': {
            width: '440px',
            maxWidth: '100%',
            minHeight: '198px',
            borderRadius: '4px',
            margin: '0',
            padding: '0',
            backgroundColor: `{PangeaColors.StoryWhiteLighter}`,
          },
        }}
        onClose={handleClose}
        open={open}
      >
        <Stack direction='row' justifyContent='space-between' mt={2}>
          <Typography variant='h5' ml={'24px'}>
            Choose Contact Order
          </Typography>
          <IconButton
            aria-label='close'
            onClick={handleClose}
            sx={{ marginRight: '24px' }}
          >
            <Close
              sx={{
                width: '24px',
                height: '24px',
                color: setAlpha(PangeaColors.Black, 0.54),
              }}
            />
          </IconButton>
        </Stack>
        <Stack
          direction='column'
          justifyContent='space-between'
          mt={'24px'}
          mr={'24px'}
          ml={'24px'}
          spacing={'24px'}
        >
          <FormControl variant='filled'>
            <InputLabel id='primary-contact'>Primary Contact</InputLabel>
            <Select
              labelId='primary-contact'
              id='primary-contact'
              value={selectPrimaryID.toString()}
              onChange={handlePrimarySelectUpdate}
              error={selectPrimaryID === selectSecondaryID}
            >
              {accountContacts?.map((contact) => (
                <MenuItem
                  key={`SelectPrimary_${contact.id}`}
                  value={contact.id.toString()}
                >
                  {!(contact.first_name || contact.last_name)
                    ? 'NO NAME'
                    : `${contact.first_name} ${contact.last_name}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {!companyHasOnlyOneUser ? (
            <FormControl variant='filled'>
              <InputLabel id='secondary-contact'>Secondary Contact</InputLabel>

              <Select
                labelId='secondary-contact'
                id='secondary-contact'
                value={selectSecondaryID.toString()}
                onChange={handleSecondarySelectUpdate}
                error={selectPrimaryID === selectSecondaryID}
              >
                {accountContacts?.map((contact) => (
                  <MenuItem
                    key={`SelectSecondary_${contact.id}`}
                    value={contact.id.toString()}
                  >
                    {!(contact.first_name || contact.last_name)
                      ? 'NO NAME'
                      : `${contact.first_name} ${contact.last_name}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : null}
        </Stack>
        <Stack direction='row' justifyContent='space-between' margin={'24px'}>
          <PangeaButton onClick={handleClose}>Close</PangeaButton>
          <PangeaButton
            loading={loadingState.isLoading}
            disabled={!isValid}
            onClick={handleAPIUpdateRequest}
          >
            Save
          </PangeaButton>
        </Stack>
      </Dialog>
    </>
  );
};
export default CompanyContactsDialog;
