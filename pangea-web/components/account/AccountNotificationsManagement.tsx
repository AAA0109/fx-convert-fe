import {
  Checkbox,
  Skeleton,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Typography,
} from '@mui/material';
import TableRow from '@mui/material/TableRow';
import {
  clientApiState,
  pangeaAlertNotificationMessageState,
  userState,
} from 'atoms';
import axios from 'axios';
import { PangeaButton } from 'components/shared';
import { useLoading } from 'hooks/useLoading';
import {
  PangeaNotificationEvent,
  PangeaUserNotification,
  PangeaUserNotificationBulkCreateUpdate,
} from 'lib';
import { cloneDeep, isEqual, isError } from 'lodash';
import { ChangeEvent, useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { PangeaColors } from 'styles';

export const AccountNotificationsManagement = () => {
  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );
  const { loadingState, loadingPromise } = useLoading();
  const authHelper = useRecoilValue(clientApiState);
  const user = useRecoilValue(userState);
  const [eventList, setEventList] = useState<PangeaNotificationEvent[]>();
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  const [initialUserNotificationList, setInitialUserNotificationList] =
    useState<Optional<PangeaUserNotification[]>>();

  // state for holding filtered user notifications for comparison against initialUserNotificationList
  const [filteredUserNotificationArray, setFilteredUserNotificationArray] =
    useState<PangeaUserNotification[]>();

  // creating a state to hold updated values for notifications, with the default being what originally came back from the api
  const [userNotificationList, setUserNotificationList] =
    useState<Optional<PangeaUserNotification[]>>();

  useEffect(() => {
    // gets the list of events
    const notificationEvents = async () => {
      const api = authHelper.getAuthenticatedApiHelper();
      await api.loadAllNotificationEventsAsync().then((res) => {
        if (res && !isError(res)) {
          setEventList(res);
        }
      });
    };
    notificationEvents();
    // Gets the list of user notifications
    const userNotificationsList = async () => {
      const api = authHelper.getAuthenticatedApiHelper();
      await api.loadAllUserNotificationsAsync().then((res) => {
        if (res && !isError(res)) {
          setUserNotificationList(res);
          setInitialUserNotificationList(cloneDeep(res));
        }
      });
    };
    userNotificationsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TODO: https://github.com/servant-io/Pangea/issues/907 Full circle API implementation for /notification/user GET and PUT on accountNotificationsManagement.tsx
  // TODO: change disabled Checkbox implementation
  const disabledCheckboxArray: string[] = [];

  const handleNotificationChange = (event: ChangeEvent<HTMLInputElement>) => {
    // update new notification list with an object taking in
    // will be either "email", "phone" or "sms"
    const idParts = event.target.id.split('_');
    const checkboxChecked = event.target.checked; // will be true or false
    const notificationType = idParts[1]; // email, sms or phone
    const eventId = Number(idParts[2]); // row number, 1 through 7

    // creating workingUserNotificationsList so that if an event doesn't already exist in
    // ... userNotificationList we can add it, if it does exist we can update it

    const workingUserNotificationsList = !userNotificationList
      ? []
      : [...userNotificationList];
    let notificationEvent = workingUserNotificationsList.find((listItem) => {
      return listItem.event === eventId;
    });
    if (!notificationEvent) {
      notificationEvent = {
        id: -1,
        event: eventId,
        user: user?.id,
      } as PangeaUserNotification;
      workingUserNotificationsList.push(notificationEvent);
    }
    switch (notificationType) {
      case 'email':
        notificationEvent.email = checkboxChecked;
        break;
      case 'sms':
        notificationEvent.sms = checkboxChecked;
        break;
      case 'phone':
        notificationEvent.phone = checkboxChecked;
        break;
    }

    if (!notificationEvent.email) {
      notificationEvent.email = false;
    }
    if (!notificationEvent.sms) {
      notificationEvent.sms = false;
    }
    if (!notificationEvent.phone) {
      notificationEvent.phone = false;
    }
    setUserNotificationList([...workingUserNotificationsList]);
  };

  // This useEffect is looking at the difference between the initially loaded notification state (initialUserNotificationList)...
  // ... and the new notification list (userNotificationList)
  useEffect(() => {
    // Since if the user checks and then unchecks a box it creates an object that is different than the the initially loaded notification state...
    // .. but the effect is the same (the object just contains a false value, there is not new new notification signed up)...
    // .. we are creating a filteredArray that will have everything that was in initialUserNotificationList (object.id != -1) OR...
    // .. is a new object with values of true (object.id === -1 && Object.values(object).includes(true))
    const filteredArray = userNotificationList?.filter((object) => {
      return (
        object.id !== -1 ||
        (object.id === -1 && Object.values(object).includes(true))
      );
    });

    // We are setting filteredUserNotificationArray so that upon successful form submission in handleSaveChanges..
    // ..initialUserNotificationList can be set to the filteredUserNotificationArray so there are no differences and....
    // .. the "Save Changes" button is disabled as unSavedChanges is set to false
    setFilteredUserNotificationArray(filteredArray);

    if (isEqual(initialUserNotificationList, filteredArray)) {
      return setUnsavedChanges(false);
    } else {
      return setUnsavedChanges(true);
    }
  }, [initialUserNotificationList, unsavedChanges, userNotificationList]);

  const handleSaveChanges = async () => {
    if (!user?.id || !userNotificationList) {
      return;
    }

    const updateUserNotificationsSettings = async () => {
      try {
        const api = authHelper.getAuthenticatedApiHelper();
        const res = await api.updateUserNotificationsAsync(
          // userNotificationList has id in it, but the api expects an object without id in it so we are mapping over userNotificationList...
          // ... and returning everything other than the id
          userNotificationList.map((item) => {
            return {
              email: item.email,
              sms: item.sms,
              phone: item.phone,
              user: item.user,
              event: item.event,
            } as PangeaUserNotificationBulkCreateUpdate;
          }),
        );
        if (res && !isError(res)) {
          setUnsavedChanges(false);
          // Set initialUserNotificationList to this new userNotificationList so that when compared in an isEqual...
          // ...it will be true and the save changes button disabled
          setInitialUserNotificationList(filteredUserNotificationArray);
          setPangeaAlertNotificationMessage({
            text: 'You have saved your changes successfully!',
            severity: 'success',
          });
        }
        if (axios.isAxiosError(res)) {
          setUnsavedChanges(true);
          setPangeaAlertNotificationMessage({
            text: 'There was an error and your changes did not save successfully',
            severity: 'error',
          });
        }
      } catch {
        setUnsavedChanges(true);
        setPangeaAlertNotificationMessage({
          text: 'There was an error and your changes did not save successfully',
          severity: 'error',
        });
      }
    };
    await loadingPromise(updateUserNotificationsSettings());
  };

  if (!eventList) {
    return <Skeleton width={'100%'} height={'960px'} />;
  }

  return (
    <>
      <Typography component='h3' variant='body1' my={1.5}>
        Margin Notifications
      </Typography>
      <TableContainer
        component={'table'}
        sx={{
          marginBottom: '36px',
          border: `1px solid ${PangeaColors.Gray}`,
          borderRadius: '4px',
        }}
      >
        <TableHead>
          <TableRow
            sx={{
              height: '50px',
              'td:first-of-type': {
                borderBottom: `1px solid ${PangeaColors.Gray}`,
              },
              ':last-child': { borderBottom: 0 },
            }}
          >
            <TableCell sx={{ width: '267px' }}>Event</TableCell>
            <TableCell sx={{ width: '92px' }} align='center'>
              Email
            </TableCell>
            <TableCell sx={{ width: '92px' }} align='center'>
              SMS
            </TableCell>
            <TableCell sx={{ width: '92px' }} align='center'>
              Phone call
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody
          sx={{
            ':last-child': {
              borderBottom: 0,
            },
          }}
        >
          {eventList.map((row, rowIndex) => {
            if (row.key.indexOf('margin-') == -1) return;
            const eventUserNotification = userNotificationList?.find(
              (element) => element.event === row.id,
            );
            const notificationTypes: ['email', 'sms', 'phone'] = [
              'email',
              'sms',
              'phone',
            ];
            return (
              <TableRow
                key={row.name}
                sx={{
                  maxHeight: '50px',
                  ':last-child td': {
                    borderBottom: 0,
                  },
                }}
              >
                <TableCell>{row.name}</TableCell>
                {notificationTypes.map((type, i) => {
                  const typeHash = `${row.key}_${type}`;
                  return (
                    <TableCell align='center' key={`cell_${i}`}>
                      <Checkbox
                        key={`${type}_${i}`}
                        checked={
                          eventUserNotification
                            ? eventUserNotification[type] ?? false
                            : false
                        }
                        disabled={disabledCheckboxArray.includes(typeHash)}
                        onChange={handleNotificationChange}
                        id={`${eventUserNotification?.id ?? -1}_${type}_${
                          row.id
                        }_${rowIndex}`}
                      ></Checkbox>
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </TableContainer>

      <Typography component='h3' variant='body1' my={1.5}>
        Hedge Notifications
      </Typography>
      <TableContainer
        component={'table'}
        sx={{
          marginBottom: '24px',
          border: `1px solid ${PangeaColors.Gray}`,
          borderRadius: '4px',
        }}
      >
        <TableHead>
          <TableRow
            sx={{
              height: '50px',
              'td:first-of-type': {
                borderBottom: `1px solid ${PangeaColors.Gray}`,
              },
              ':last-child': { borderBottom: 0 },
            }}
          >
            <TableCell sx={{ width: '267px' }}>Event</TableCell>
            <TableCell sx={{ width: '92px' }} align='center'>
              Email
            </TableCell>
            <TableCell sx={{ width: '92px' }} align='center'>
              SMS
            </TableCell>
            <TableCell sx={{ width: '92px' }} align='center'>
              Phone call
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody
          sx={{
            ':last-child': {
              borderBottom: 0,
            },
          }}
        >
          {eventList.map((row, rowIndex) => {
            if (row.key.indexOf('hedge-') == -1) return;
            const eventUserNotification = userNotificationList?.find(
              (element) => element.event === row.id,
              // so this would be if element.event (which is 1) === row.id (which is 1 on load, -1 coming back from the api after clicking a box)
            );
            const notificationTypes: ['email', 'sms', 'phone'] = [
              'email',
              'sms',
              'phone',
            ];
            return (
              <TableRow
                key={row.name}
                sx={{
                  maxHeight: '50px',
                  ':last-child td': {
                    borderBottom: 0,
                  },
                }}
              >
                <TableCell>{row.name}</TableCell>
                {notificationTypes.map((type, i) => {
                  const typeHash = `${row.key}_${type}`;
                  return (
                    <TableCell align='center' key={`cell_${i}`}>
                      <Checkbox
                        key={`${type}_${i}`}
                        checked={
                          eventUserNotification
                            ? eventUserNotification[type] ?? false
                            : false
                        }
                        disabled={disabledCheckboxArray.includes(typeHash)}
                        onChange={handleNotificationChange}
                        id={`${eventUserNotification?.id ?? -1}_${type}_${
                          row.id
                        }_${rowIndex}`}
                      ></Checkbox>
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </TableContainer>
      {/* TODO: When connecting to the API this button will need to update the data in the API */}
      <PangeaButton
        disabled={!unsavedChanges}
        onClick={handleSaveChanges}
        variant='contained'
        loading={loadingState.isLoading}
      >
        Save Changes
      </PangeaButton>
    </>
  );
};
export default AccountNotificationsManagement;
