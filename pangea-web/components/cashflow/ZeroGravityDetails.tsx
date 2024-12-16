import {
  Box,
  Divider,
  DividerProps,
  FormControl,
  FormHelperText,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import styled from '@mui/system/styled';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  allAccountsState,
  clientApiState,
  hedgeRiskReductionAmountState,
  pangeaAlertNotificationMessageState,
  selectedAccountIdState,
  userState,
} from 'atoms';
import { PangeaButton } from 'components/shared';
import { useLoading } from 'hooks';
import { PangeaAccount } from 'lib';
import { isError } from 'lodash';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import {
  useRecoilRefresher_UNSTABLE,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { PangeaColors } from 'styles';
import { PortfolioPickerSelect } from './PortfolioPickerSelect';
import ProtectionSlider from './ProtectionSlider';
type Props = {
  accountId?: number;
  onChange?(accountId: Optional<number>, riskReduction: Optional<number>): void;
};
const LighterDivider = styled(Divider)<DividerProps>(() => ({
  borderColor: PangeaColors.BlackSemiTransparent12,
  margin: '16px -16px',
}));
export const ZeroGravityDetails = ({
  accountId,
  onChange,
}: Props): JSX.Element => {
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [clickedCreateButton, setClickedCreateButton] = useState(false);
  const [accountSelected, setAccountSelected] = useState<number | ''>(
    accountId ? accountId : '',
  );
  const { loadingState, loadingPromise } = useLoading();
  const authHelper = useRecoilValue(clientApiState);
  const refreshUser = useRecoilRefresher_UNSTABLE(userState);
  const setErrorMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );
  const [riskReduction, setRiskReduction] = useRecoilState(
    hedgeRiskReductionAmountState,
  );
  const setAccountId = useSetRecoilState(selectedAccountIdState);
  const accounts = useRecoilValue(allAccountsState);
  const currentAccount = useRef<Optional<PangeaAccount>>();
  const isPortfolioNameUnique =
    accounts.findIndex(
      (a) => a.name.toLowerCase() == newPortfolioName.toLowerCase(),
    ) < 0;
  const getRiskReductionForAccount = (accountId: number): number =>
    accounts.find((a) => a.id == accountId)?.hedge_settings.custom
      ?.vol_target_reduction ?? 0;
  const handleAccountSelected = useEventCallback((accountId: number) => {
    if (accountSelected !== accountId) {
      setAccountSelected(accountId);
    }
    currentAccount.current = accounts.find((a) => a.id == accountId);
    const newRiskReduction = getRiskReductionForAccount(accountId);
    setRiskReduction(newRiskReduction);
    onChange?.(accountId, newRiskReduction || riskReduction);
  });
  const handleNewPortfolioName = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setNewPortfolioName(event.currentTarget.value.substring(0, 32));
  const reductionPercent = ((riskReduction ?? 0) * 100).toFixed(0);
  const handleRiskReductionChange = (newAmt: number) => {
    setRiskReduction(newAmt);
    onChange?.(accountSelected ? accountSelected : undefined, newAmt);
  };
  const handleCreateButtonClicked = () => {
    setAccountId(-1);
    setRiskReduction(0);
    setClickedCreateButton(true);
  };
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
        onChange?.(newAccountResponse.id, riskReduction);
        setClickedCreateButton(false);
      })(),
    );
  };
  useEffect(() => {
    if (accountId) {
      handleAccountSelected(accountId);
    }
  }, [accountId, handleAccountSelected]);
  return (
    <Box sx={{ padding: '16px', border: `1px solid ${PangeaColors.Gray}` }}>
      <Grid container flexGrow={1}>
        <Grid item xl={6}>
          {!clickedCreateButton && (
            <PortfolioPickerSelect
              accountId={accountSelected || undefined}
              onChange={handleAccountSelected}
              onCreateNewPortfolio={handleCreateButtonClicked}
            />
          )}
          {clickedCreateButton && (
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
                label='New portfolio name'
                placeholder='Enter a name for your new portfolio'
                required
                aria-required
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
                <FormHelperText sx={{ color: PangeaColors.RiskBerryMedium }}>
                  Portfolio name must be unique.
                </FormHelperText>
              ) : !newPortfolioName ? (
                <FormHelperText sx={{ color: PangeaColors.RiskBerryMedium }}>
                  A portfolio name is required.
                </FormHelperText>
              ) : (
                <FormHelperText>&nbsp;</FormHelperText>
              )}
            </FormControl>
          )}
        </Grid>
      </Grid>
      {clickedCreateButton && <LighterDivider />}
      {clickedCreateButton && (
        <Box flexGrow={1}>
          <Grid container flexGrow={1} spacing={2} alignItems='center'>
            <Grid item xl={7}>
              <Stack direction='column'>
                <Typography variant='body1'>Risk Reduction</Typography>
                <Typography variant='body2'>
                  {reductionPercent}% coverage will protect {reductionPercent}%
                  of your cash flow from all volatility.
                </Typography>
              </Stack>
            </Grid>
            <Grid item xl={5}>
              <ProtectionSlider
                value={riskReduction ?? 0}
                onRiskChange={handleRiskReductionChange}
              />
            </Grid>
          </Grid>
          <Stack
            direction='row'
            flexGrow={1}
            alignItems='center'
            justifyContent='flex-end'
          >
            <PangeaButton
              variant='text'
              sx={{ minWidth: '120px' }}
              onClick={() => {
                setClickedCreateButton(false);
                setRiskReduction(0);
                setAccountId(-1);
              }}
            >
              Cancel
            </PangeaButton>
            <PangeaButton
              variant='outlined'
              sx={{ minWidth: '120px' }}
              disabled={!newPortfolioName}
              onClick={handleCreatePortfolioClicked}
              loading={loadingState.isLoading}
            >
              Create Portfolio
            </PangeaButton>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default ZeroGravityDetails;
