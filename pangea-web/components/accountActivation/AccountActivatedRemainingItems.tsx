import {
  Chip,
  List,
  ListItem as MuiListItem,
  Pagination,
  Stack,
  Typography,
} from '@mui/material';
import styled from '@mui/system/styled';
import useEventCallback from '@mui/utils/useEventCallback';
import { clientApiState, pangeaAlertNotificationMessageState } from 'atoms';
import { StepperShell, TimedProgressBar } from 'components/shared';
import { useLoading } from 'hooks/useLoading';
import {
  getIPAddressAsync,
  PangeaRegistrationTask,
  PangeaRegistrationTasksResponse,
  redirect,
  titleCase,
} from 'lib';
import { debounce, isError } from 'lodash';
import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { PangeaColors } from 'styles';

export const AccountActivatedRemainingItems = () => {
  const authHelper = useRecoilValue(clientApiState);
  const [page, setPage] = useState(1);
  const Items_Per_Page = 10;
  const lastItem = page * Items_Per_Page;
  const firstItem = lastItem - Items_Per_Page;
  const [remainingItems, setRemainingItems] =
    useState<PangeaRegistrationTasksResponse>();
  const currentPageTasks =
    remainingItems?.registrationTasks?.slice(firstItem, lastItem) ?? [];
  const { loadingPromise, loadingState } = useLoading();
  const {
    loadingPromise: loadingPortalAccess,
    loadingState: loadingPortalState,
  } = useLoading();
  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );
  useEffect(() => {
    const generateRemainingItems = debounce(
      async () => {
        const api = authHelper.getAuthenticatedApiHelper();
        const comp = await api.getCompanyAsync();
        if (
          !comp ||
          isError(comp) ||
          !comp.ibkr_application ||
          comp.ibkr_application.length == 0
        ) {
          return;
        }
        try {
          const brokerAccountName = comp.ibkr_application[0].account;
          if (!brokerAccountName) {
            return;
          }
          const res = await api.getRegistrationTasksAsync({
            broker_account_id: brokerAccountName,
          });

          if (res && !isError(res)) {
            setRemainingItems(res);
          }
        } catch {
          console.error('Failed getting registration tasks.');
        }
      },
      1000,
      { leading: true, trailing: false },
    );
    loadingPromise(generateRemainingItems());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickEnterPortal = useEventCallback(async () => {
    const redirectToPortal = async () => {
      const ipAddress = await getIPAddressAsync();
      const api = authHelper.getAuthenticatedApiHelper();
      const compData = await api.getCompanyAsync();
      if (!isError(compData) && compData.ibkr_application[0]?.username) {
        try {
          const ssoUrl = await api.getSsoUrlAsync(
            compData.ibkr_application[0].username,
            ipAddress,
          );
          if (isError(ssoUrl)) {
            setPangeaAlertNotificationMessage({
              severity: 'error',
              text: 'Failed to get portal URL. Please try again or contact customer support.',
            });
            return;
          }

          redirect(ssoUrl.url);
        } catch (e) {
          console.error(e);
        }
        return;
      }
    };
    await loadingPortalAccess(redirectToPortal());
  });

  const ListItem = styled(MuiListItem)({
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: PangeaColors.Gray,
  });
  type ColorMap = {
    [key: string]: 'warning' | 'info' | 'secondary' | 'default';
  };
  const colorFromAction = (
    action: string,
  ): 'warning' | 'info' | 'secondary' | 'default' => {
    return (
      (
        {
          'to complete': 'warning',
          'to send': 'info',
          'to sign': 'secondary',
        } as ColorMap
      )[action] ?? 'default'
    );
  };
  return (
    <StepperShell
      title='Continue where you left off'
      titleDescription="In order to activate, you'll need to finish your IB application."
      backButtonVisible={false}
      continueButtonEnabled={true}
      continueButtonProps={{ loading: loadingPortalState.isLoading }}
      continueButtonText='Enter Secure Portal'
      onClickContinueButton={handleClickEnterPortal}
      sx={{ maxWidth: '564px', margin: '0 auto' }}
    >
      {loadingState.isLoading ? (
        <TimedProgressBar maxSeconds={10} caption='Loading tasks' />
      ) : (
        <List>
          <ListItem>
            <Typography variant='body1'>
              Items still remaining:{' '}
              {remainingItems?.registrationTasks?.length ?? 0}
            </Typography>
          </ListItem>

          {currentPageTasks.map(
            (item: PangeaRegistrationTask, index: number) => (
              <ListItem key={item.formName}>
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  alignItems='center'
                  sx={{ width: '100%' }}
                >
                  <Typography variant='body1'>
                    {index + firstItem + 1}. {item.formName}
                  </Typography>
                  <Chip
                    variant='outlined'
                    color={colorFromAction(item.action)}
                    size='small'
                    label={titleCase(item.action)}
                  />
                </Stack>
              </ListItem>
            ),
          )}
          <ListItem>
            <Pagination
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}
              count={Math.ceil(
                (remainingItems?.registrationTasks?.length ?? 0) /
                  Items_Per_Page,
              )}
              page={page}
              onChange={(_e, value) => setPage(value)}
            />
          </ListItem>
        </List>
      )}
    </StepperShell>
  );
};
export default AccountActivatedRemainingItems;
