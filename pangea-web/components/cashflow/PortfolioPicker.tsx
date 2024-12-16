import Add from '@mui/icons-material/Add';
import {
  Box,
  Divider,
  DividerProps,
  FormControl,
  FormHelperText,
  Grid,
  List,
  ListItem,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import styled from '@mui/system/styled';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  allAccountsState,
  clientApiState,
  hedgeRiskReductionAmountState,
  pangeaAlertNotificationMessageState,
  userState,
} from 'atoms';
import { useLoading } from 'hooks';
import { IAccountComponents, PangeaAccount } from 'lib';
import { isError } from 'lodash';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import {
  useRecoilRefresher_UNSTABLE,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { PangeaColors } from 'styles';
import { PangeaButton, TabPanel } from '../shared';
import { CostProtectionStack } from './CostProtectionStack';
import { PortfolioPickerSelect } from './PortfolioPickerSelect';
import { ProtectionSlider } from './ProtectionSlider';

export const defaultProtectionLevelSettings: IAccountComponents = {
  low: {
    name: 'Low Protection',
    cost: 1,
    protection: 1,
    description: 'Best for cash flows with low volatility.',
  },
  moderate: {
    name: 'Moderate Protection',
    cost: 2,
    protection: 2,
    description: 'Recommended for volatile cash flows.',
  },
  high: {
    name: 'High Protection',
    cost: 3,
    protection: 3,
    description: 'Best for highly volatile currencies.',
  },
};

export const PortfolioPicker = ({
  onChange,
  accountId,
}: {
  accountId?: number;
  onChange?(accountId: Optional<number>, riskReduction: Optional<number>): void;
}) => {
  const { loadingState, loadingPromise } = useLoading();
  const [selectedTab, setSelectedTab] = useState<0 | 1>(0);
  const [accountSelected, setAccountSelected] = useState<number | ''>(
    accountId ? accountId : '',
  );
  const [riskReduction, setRiskReduction] = useRecoilState(
    hedgeRiskReductionAmountState,
  );
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [clickedCreateButton, setClickedCreateButton] = useState(false);
  const authHelper = useRecoilValue(clientApiState);
  const refreshUser = useRecoilRefresher_UNSTABLE(userState);
  const setErrorMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );
  const accounts = useRecoilValue(allAccountsState);
  const currentAccount = useRef<Optional<PangeaAccount>>();
  const getRiskReductionForAccount = (accountId: number): number =>
    accounts.find((a) => a.id == accountId)?.hedge_settings.custom
      ?.vol_target_reduction ?? 0;

  const handleToggle = (
    _event: React.MouseEvent<HTMLElement> | undefined,
    newTabIndex: 0 | 1,
  ) => {
    setSelectedTab(newTabIndex);
    if (newTabIndex === 0) {
      // Existing portfolios
      if (accountSelected) {
        handleAccountSelected(accountSelected);
      }
    } else {
      // New portfolio
      setNewPortfolioName('');
      setClickedCreateButton(false);
      setAccountSelected('');
    }
    // Zero out the risk reduction value
    setRiskReduction(0);
    onChange?.(undefined, 0);
  };
  const handleAccountSelected = useEventCallback((accountId: number) => {
    if (accountSelected !== accountId) {
      setAccountSelected(accountId);
    }
    currentAccount.current = accounts.find((a) => a.id == accountId);
    const newRiskReduction = getRiskReductionForAccount(accountId);
    setRiskReduction(newRiskReduction);
    onChange?.(accountId, newRiskReduction || riskReduction);
  });
  const handleRiskReductionChange = (newAmt: number) => {
    setRiskReduction(newAmt);
    onChange?.(accountSelected ? accountSelected : undefined, newAmt);
  };
  const handleNewPortfolioName = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setClickedCreateButton(false);
    setNewPortfolioName(event.currentTarget.value.substring(0, 32));
  };
  useEffect(() => {
    if (accountId) {
      handleAccountSelected(accountId);
    }
  }, [accountId, handleAccountSelected]);
  const isPortfolioNameUnique =
    accounts.findIndex(
      (a) => a.name.toLowerCase() == newPortfolioName.toLowerCase(),
    ) < 0;
  const handleCreatePortfolioClicked = async () => {
    loadingPromise(
      (async () => {
        setClickedCreateButton(true);
        if (!newPortfolioName?.trim() || !isPortfolioNameUnique) {
          return;
        }
        const api = authHelper.getAuthenticatedApiHelper();
        const normalizedAccountName = newPortfolioName.trim();
        const newAccountResponse = await api.createAccountAsync(
          normalizedAccountName,
          riskReduction ?? 0,
        );
        if (isError(newAccountResponse)) {
          setErrorMessage({
            text: `Failed creating new account '${normalizedAccountName}' with risk reduction ${(
              (riskReduction ?? 0) * 100
            ).toFixed(0)}%`,
            severity: 'error',
          });
          return;
        }
        const user = await api.loadUserAsync();
        if (isError(user)) {
          setErrorMessage({
            text: 'Error reloading user information.',
            severity: 'warning',
          });
          return;
        }
        refreshUser();
        setAccountSelected(newAccountResponse.id);
        setRiskReduction(riskReduction);
        setSelectedTab(0);
        onChange?.(newAccountResponse.id, riskReduction);
      })(),
    );
  };
  const reductionPercent = ((riskReduction ?? 0) * 100).toFixed(0);
  const LighterDivider = styled(Divider)<DividerProps>(() => ({
    borderColor: PangeaColors.BlackSemiTransparent12,
  }));

  return (
    <Stack direction='column' spacing={1}>
      <ToggleButtonGroup
        exclusive
        value={selectedTab}
        onChange={handleToggle}
        fullWidth
      >
        <ToggleButton value={0}>Existing Portfolios</ToggleButton>
        <ToggleButton value={1}>
          <Stack direction='row' alignContent={'center'} spacing={1}>
            <Add /> <div>Custom Portfolio</div>
          </Stack>
        </ToggleButton>
      </ToggleButtonGroup>
      <Typography variant='body2' color={PangeaColors.BlackSemiTransparent60}>
        Adding cash flows to existing porfolios may optimize your fees.
      </Typography>
      <Box border={'1px solid ' + PangeaColors.Gray} borderRadius={'4px'}>
        <List>
          <ListItem>
            <Box flexGrow={1}>
              <TabPanel value={selectedTab} index={0}>
                <Grid container flexGrow={1}>
                  <Grid item xl={6}>
                    <PortfolioPickerSelect
                      accountId={accountSelected || undefined}
                      onChange={handleAccountSelected}
                    />
                  </Grid>
                  <Grid item xl={6}>
                    <Stack direction='column'>
                      {currentAccount.current ? (
                        <CostProtectionStack
                          cost={
                            defaultProtectionLevelSettings[
                              currentAccount.current.name
                            ]?.cost ?? 0
                          }
                          protection={
                            defaultProtectionLevelSettings[
                              currentAccount.current.name
                            ]?.protection ?? 0
                          }
                        />
                      ) : null}
                    </Stack>
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value={selectedTab} index={1}>
                <FormControl
                  sx={{
                    width: '30ch',
                  }}
                >
                  <TextField
                    id='custom-portfolio-name'
                    name='custom-portfolio-name'
                    title='New custom portfolio name'
                    variant='filled'
                    label='Custom portfolio name'
                    placeholder='Enter a name for your new portfolio'
                    required={selectedTab == 1}
                    aria-required={selectedTab == 1}
                    value={newPortfolioName}
                    onChange={handleNewPortfolioName}
                    error={
                      (clickedCreateButton && !newPortfolioName) ||
                      !isPortfolioNameUnique
                    }
                  />
                  {isPortfolioNameUnique && newPortfolioName.length > 20 ? (
                    <FormHelperText
                      sx={{
                        color:
                          newPortfolioName.length < 26
                            ? PangeaColors.BlackSemiTransparent60
                            : PangeaColors.RiskBerryMedium,
                      }}
                    >
                      {32 - newPortfolioName.length}/32 characters remaining
                    </FormHelperText>
                  ) : !isPortfolioNameUnique ? (
                    <FormHelperText
                      sx={{ color: PangeaColors.RiskBerryMedium }}
                    >
                      Portfolio name must be unique.
                    </FormHelperText>
                  ) : !newPortfolioName ? (
                    <FormHelperText
                      sx={{ color: PangeaColors.RiskBerryMedium }}
                    >
                      A portfolio name is required.
                    </FormHelperText>
                  ) : (
                    <FormHelperText>&nbsp;</FormHelperText>
                  )}
                </FormControl>
              </TabPanel>
            </Box>
          </ListItem>
          <LighterDivider />
          <ListItem>
            <Box flexGrow={1}>
              <Grid container flexGrow={1} spacing={2} alignItems='center'>
                <Grid item xl={7}>
                  <Stack direction='column'>
                    <Typography variant='body1'>Cash flow coverage</Typography>
                    <Typography variant='body2'>
                      {reductionPercent}% coverage will protect{' '}
                      {reductionPercent}% of your cash flow from volatility.
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xl={5}>
                  <ProtectionSlider
                    value={riskReduction ?? 0}
                    onRiskChange={handleRiskReductionChange}
                    disabled={!selectedTab}
                  />
                </Grid>
              </Grid>
            </Box>
          </ListItem>
          {selectedTab == 1 ? <LighterDivider /> : null}
          {selectedTab == 1 ? (
            <ListItem>
              <Stack
                direction='row'
                flexGrow={1}
                alignItems='center'
                justifyContent='flex-end'
              >
                <PangeaButton variant='text' sx={{ minWidth: '120px' }}>
                  Cancel
                </PangeaButton>
                <PangeaButton
                  variant='outlined'
                  sx={{ minWidth: '120px' }}
                  onClick={handleCreatePortfolioClicked}
                  loading={loadingState.isLoading}
                >
                  Create Portfolio
                </PangeaButton>
              </Stack>
            </ListItem>
          ) : null}
        </List>
      </Box>
    </Stack>
  );
};
export default PortfolioPicker;
