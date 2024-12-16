import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { settlementDetailsState } from 'atoms';
import { useWalletAndPaymentHelpers } from 'hooks';
import { AnyHedgeItem } from 'lib';
import React, { useMemo } from 'react';
import { useRecoilState } from 'recoil';
import { PangeaColors } from 'styles';

interface ReceivingSettlementReviewProps {
  walletAvailable: boolean;
  activeHedge: AnyHedgeItem;
}

const ReceivingSettlementReview: React.FC<ReceivingSettlementReviewProps> = ({
  walletAvailable,
  activeHedge,
}) => {
  const { allWallets, settlementAccounts, isLoadingPurposes } =
    useWalletAndPaymentHelpers();
  const [editSettlementDetails, setEditSettlementDetails] = useRecoilState(
    settlementDetailsState,
  );
  const cashSettlementAccounts = useMemo(() => {
    return allWallets.filter((wallet) => wallet.currency === 'USD');
  }, [allWallets]);
  const destinationAccounts = useMemo(() => {
    return allWallets.filter(
      (wallet) => wallet.currency === activeHedge.currency,
    );
  }, [activeHedge.currency, allWallets]);
  const filteredSettlementAccounts = useMemo(() => {
    return settlementAccounts.filter(
      ({ currency }) => activeHedge.currency === currency,
    );
  }, [activeHedge.currency, settlementAccounts]);

  return (
    <Stack gap={1}>
      <FormControl>
        <InputLabel id='origin-label'>
          {!walletAvailable ? 'cash settlement account' : 'origin'}
        </InputLabel>
        {walletAvailable ? (
          <Select
            labelId='settlement-label'
            name='cash_settle_account'
            id='cash_settle_account'
            value={
              editSettlementDetails?.cash_settle_account ||
              destinationAccounts[0]?.wallet_id
            }
            required
            placeholder='Settlement Account'
            label='Settlement Account'
            onChange={(e) => {
              setEditSettlementDetails((payload) => {
                return {
                  ...payload,
                  cash_settle_account: e.target.value,
                };
              });
            }}
            disabled={isLoadingPurposes}
          >
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
            value={
              editSettlementDetails?.cash_settle_account ||
              cashSettlementAccounts[0]?.wallet_id
            }
            required
            placeholder='Settlement Account'
            label='Settlement Account'
            onChange={(e) => {
              setEditSettlementDetails((payload) => {
                return {
                  ...payload,
                  cash_settle_account: e.target.value,
                };
              });
            }}
            disabled={isLoadingPurposes}
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
      </FormControl>

      {walletAvailable && (
        <>
          <FormControl>
            <InputLabel id='origin-label'>destination</InputLabel>
            <Select
              labelId='destination-label'
              name='destination_account'
              id='destination_account'
              value={
                editSettlementDetails?.destination_account ||
                cashSettlementAccounts[0]?.wallet_id
              }
              required
              placeholder='Destination Account'
              label='Destination Account'
              onChange={(e) => {
                setEditSettlementDetails((payload) => {
                  return {
                    ...payload,
                    destination_account: e.target.value,
                  };
                });
              }}
              disabled={isLoadingPurposes}
            >
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
            </Select>
          </FormControl>
        </>
      )}

      <FormControl>
        <InputLabel id='origin-label'>funding source</InputLabel>

        <Select
          labelId='funding-label'
          name='funding_account'
          id='funding_account'
          value={
            editSettlementDetails?.funding_account ||
            filteredSettlementAccounts[0]?.wallet_id
          }
          required
          placeholder='Funding Source'
          label='Funding Source'
          onChange={(e) => {
            setEditSettlementDetails((payload) => {
              return {
                ...payload,
                funding_account: e.target.value,
              };
            });
          }}
          disabled={isLoadingPurposes}
        >
          {filteredSettlementAccounts.map((purpose) => {
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
        </Select>
      </FormControl>
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
