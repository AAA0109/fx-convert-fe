import {
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import InputBase from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';
import { currentForwardHedgeItem, userState } from 'atoms';
import BeneficaryForm from 'components/shared/BeneficiaryForms/BeneficiaryForm';
import { useWalletAndPaymentHelpers } from 'hooks';
import { AnyHedgeItem, PangeaPatchedDraftFxForward } from 'lib';
import React, { useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';
const BootstrapInput = styled(InputBase)(({ theme }) => ({
  '& .MuiInputBase-input': {
    position: 'relative',
    backgroundColor: 'transparent',
    border: 0,
    padding: '5px 0px 5px !important',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
    },
  },
}));

const TopContent = ({ type }: { type: 'wallet' | 'ndf' }) => {
  switch (type) {
    case 'wallet':
      return 'Any profits from this hedge will deposit into your destination account on the settlement date. Losses should offset with the incoming transfer and will draft from your origin account on the settlement date.';
    default:
      return 'Any profits or losses from this hedge will be deposited or drafted from your cash settlement account on the settlement date. Losses should offset with the incoming transfer.';
  }
};

interface ReceivingSettlementReviewProps {
  walletAvailable: boolean;
  activeHedge: AnyHedgeItem;
  handleSettlementDetailsChange: (event: SelectChangeEvent) => void;
  updateSettlementDetails: (val: PangeaPatchedDraftFxForward) => void;
}

const ReceivingSettlementReview: React.FC<ReceivingSettlementReviewProps> = ({
  walletAvailable,
  activeHedge,
  handleSettlementDetailsChange,
  updateSettlementDetails,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedHedgeItem] = useRecoilState(currentForwardHedgeItem);
  const { allWallets, settlementAccounts, isLoadingPurposes } =
    useWalletAndPaymentHelpers();
  const user = useRecoilValue(userState);

  const cashSettlementAccounts = useMemo(() => {
    return allWallets.filter((wallet) => wallet.currency === 'USD');
  }, [allWallets]);
  const destinationAccounts = useMemo(() => {
    return allWallets.filter(
      (wallet) => wallet.currency === activeHedge.currency,
    );
  }, [activeHedge.currency, allWallets]);
  const fundingAccounts = useMemo(() => {
    return [...settlementAccounts].filter(
      (account) => account.currency === activeHedge.currency,
    ).length > 0
      ? [...settlementAccounts].filter(
          (account) => account.currency === activeHedge.currency,
        )
      : [...settlementAccounts].filter(
          (account) => account.currency === user?.company.currency,
        );
  }, [activeHedge.currency, settlementAccounts, user?.company.currency]);
  useEffect(() => {
    settlementAccounts &&
      updateSettlementDetails({
        ...selectedHedgeItem,
        funding_account: fundingAccounts[0]?.wallet_id ?? '',
        cash_settle_account: walletAvailable
          ? destinationAccounts[0]?.wallet_id
          : cashSettlementAccounts[0]?.wallet_id,
        ...(walletAvailable && {
          destination_account: cashSettlementAccounts[0]?.wallet_id,
        }),
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    user,
    activeHedge.currency,
    cashSettlementAccounts,
    destinationAccounts,
    settlementAccounts,
    walletAvailable,
  ]);

  return (
    <Stack>
      <Typography variant='body2' color={PangeaColors.BlackSemiTransparent60}>
        {TopContent({
          type: walletAvailable ? 'wallet' : 'ndf',
        })}
      </Typography>
      <Grid
        container
        sx={{
          borderRadius: `4px`,
          borderBottom: 0,
          '& .MuiGrid-item': {
            borderBottom: `1px solid ${PangeaColors.Gray}`,
            paddingY: `6px`,
            paddingX: 0,
          },
          '& .MuiGrid-root.MuiGrid-container': {
            marginLeft: 0,
          },
        }}
      >
        <Grid item display={'flex'} xs={6} alignItems={'center'}>
          <Typography variant='dataLabel'>
            {!walletAvailable ? 'cash settlement account' : 'origin'}
          </Typography>
        </Grid>
        <Grid item xs={6} textAlign='right'>
          {walletAvailable ? (
            <Select
              labelId='settlement-label'
              name='cash_settle_account'
              id='cash_settle_account'
              value={selectedHedgeItem?.cash_settle_account || ''}
              required
              placeholder='Settlement Account'
              label='Settlement Account'
              onChange={handleSettlementDetailsChange}
              disabled={isLoadingPurposes}
              input={<BootstrapInput />}
              IconComponent={() =>
                destinationAccounts.length > 1 ? (
                  <Typography
                    variant='dataBody'
                    color={PangeaColors.EarthBlueMedium}
                    sx={{ textTransform: 'capitalize', marginLeft: 1 }}
                  >
                    Edit
                  </Typography>
                ) : (
                  <></>
                )
              }
              displayEmpty
            >
              <MenuItem value={''}>
                <Typography
                  variant='dataBody'
                  color={PangeaColors.EarthBlueMedium}
                  sx={{ textTransform: 'capitalize' }}
                >
                  Select{' '}
                  {!walletAvailable
                    ? 'a cash settlement account'
                    : 'an origin account'}
                </Typography>
              </MenuItem>
              {destinationAccounts.map((account) => {
                const { wallet_id, name } = account;
                return (
                  <MenuItem key={wallet_id} value={wallet_id}>
                    <Typography
                      variant='dataBody'
                      sx={{
                        textTransform: 'capitalize',
                      }}
                    >
                      {name}
                    </Typography>
                  </MenuItem>
                );
              })}
            </Select>
          ) : (
            <Select
              labelId='settlement-label'
              name='cash_settle_account'
              id='cash_settle_account'
              value={selectedHedgeItem?.cash_settle_account ?? ''}
              required
              placeholder='Settlement Account'
              label='Settlement Account'
              onChange={handleSettlementDetailsChange}
              disabled={isLoadingPurposes}
              input={<BootstrapInput />}
              IconComponent={() =>
                cashSettlementAccounts.length > 1 ? (
                  <Typography
                    variant='dataBody'
                    color={PangeaColors.EarthBlueMedium}
                    sx={{ textTransform: 'capitalize', marginLeft: 1 }}
                  >
                    Edit
                  </Typography>
                ) : (
                  <></>
                )
              }
              displayEmpty
            >
              {cashSettlementAccounts.map((account) => {
                const { wallet_id, name } = account;
                return (
                  <MenuItem key={wallet_id} value={wallet_id}>
                    <Typography
                      variant='dataBody'
                      sx={{
                        textTransform: 'capitalize',
                      }}
                    >
                      {name}
                    </Typography>
                  </MenuItem>
                );
              })}
            </Select>
          )}
        </Grid>

        {walletAvailable && (
          <>
            <Grid item display={'flex'} xs={6} alignItems={'center'}>
              <Typography variant='dataLabel'>destination</Typography>
            </Grid>
            <Grid item xs={6} textAlign='right'>
              <Select
                labelId='destination-label'
                name='destination_account'
                id='destination_account'
                value={selectedHedgeItem?.destination_account ?? ''}
                required
                displayEmpty
                placeholder='Destination Account'
                label='Destination Account'
                onChange={handleSettlementDetailsChange}
                disabled={isLoadingPurposes}
                input={<BootstrapInput />}
                IconComponent={() =>
                  cashSettlementAccounts.length > 1 ? (
                    <Typography
                      variant='dataBody'
                      color={PangeaColors.EarthBlueMedium}
                      sx={{ textTransform: 'capitalize', marginLeft: 1 }}
                    >
                      Edit
                    </Typography>
                  ) : (
                    <></>
                  )
                }
              >
                <MenuItem value={''}>
                  <Typography
                    variant='dataBody'
                    color={PangeaColors.EarthBlueMedium}
                    sx={{ textTransform: 'capitalize' }}
                  >
                    Select a Destination Account
                  </Typography>
                </MenuItem>
                {cashSettlementAccounts.map((purpose) => {
                  const { wallet_id, name } = purpose;
                  return (
                    <MenuItem key={wallet_id} value={wallet_id}>
                      <Typography
                        variant='dataBody'
                        sx={{ textTransform: 'capitalize' }}
                      >
                        {name}
                      </Typography>
                    </MenuItem>
                  );
                })}
                <MenuItem
                  key='add-beneficiary'
                  value=''
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <Typography
                    variant='dataBody'
                    sx={{ textTransform: 'capitalize' }}
                  >
                    Add new beneficiary
                  </Typography>
                </MenuItem>
              </Select>

              <BeneficaryForm
                open={isAddModalOpen}
                setOpen={setIsAddModalOpen}
              />
            </Grid>
          </>
        )}
        <Grid item display={'flex'} xs={6} alignItems={'center'}>
          <Typography variant='dataLabel'>settlement currency</Typography>
        </Grid>
        <Grid item xs={6} textAlign='right'>
          <Typography variant='dataBody' sx={{ textTransform: 'capitalize' }}>
            {!walletAvailable ? 'USD' : activeHedge.currency}
          </Typography>
        </Grid>
        <Grid item display={'flex'} xs={6} alignItems={'center'}>
          <Typography variant='dataLabel'>settlement date</Typography>
        </Grid>
        <Grid item xs={6} textAlign='right'>
          <Typography variant='dataBody' sx={{ textTransform: 'capitalize' }}>
            {activeHedge.nextSettlementDate.toLocaleDateString()}
          </Typography>
        </Grid>
        <Grid item display={'flex'} xs={6} alignItems={'center'}>
          <Typography variant='dataLabel'>funding source</Typography>
        </Grid>
        <Grid item xs={6} textAlign='right'>
          <Select
            labelId='funding-label'
            name='funding_account'
            id='funding_account'
            value={selectedHedgeItem?.funding_account || ''}
            required
            placeholder='Funding Source'
            label='Funding Source'
            onChange={handleSettlementDetailsChange}
            disabled={isLoadingPurposes}
            input={<BootstrapInput />}
            IconComponent={() =>
              fundingAccounts.length > 1 &&
              selectedHedgeItem?.funding_account ? (
                <Typography
                  variant='dataBody'
                  color={PangeaColors.EarthBlueMedium}
                  sx={{ textTransform: 'capitalize', marginLeft: 1 }}
                >
                  Edit
                </Typography>
              ) : (
                <></>
              )
            }
            displayEmpty
          >
            <MenuItem value={''}>
              <Typography
                variant='dataBody'
                color={PangeaColors.EarthBlueMedium}
                sx={{ textTransform: 'capitalize' }}
              >
                Select a fund account
              </Typography>
            </MenuItem>
            {fundingAccounts.map((account) => {
              const { wallet_id, name } = account;
              return (
                <MenuItem key={wallet_id} value={wallet_id}>
                  <Typography
                    variant='dataBody'
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {name}
                  </Typography>
                </MenuItem>
              );
            })}
          </Select>
        </Grid>
      </Grid>
      <Typography
        variant='subtitle2'
        color={PangeaColors.BlackSemiTransparent60}
      >
        Funds are automatically drafted from the cash settlement account on the
        settlement date. Any additional funds required will be drafted from the
        funding source above.
      </Typography>
    </Stack>
  );
};

export default ReceivingSettlementReview;
