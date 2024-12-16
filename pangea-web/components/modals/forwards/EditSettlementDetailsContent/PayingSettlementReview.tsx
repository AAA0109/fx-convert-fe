import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { allCurrencyDefinitionState, settlementDetailsState } from 'atoms';
import { useWalletAndPaymentHelpers } from 'hooks';
import { AnyHedgeItem, PangeaInstructDealRequestDeliveryMethodEnum } from 'lib';
import React, { useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';

interface PayingSettlementReviewProps {
  walletAvailable: boolean;
  activeHedge: AnyHedgeItem;
}

const PayingSettlementReview: React.FC<PayingSettlementReviewProps> = ({
  walletAvailable,
  activeHedge,
}) => {
  const {
    allWallets,
    settlementAccounts,
    isLoadingPurposes,
    allPurposes,
    beneficiaryAccounts,
  } = useWalletAndPaymentHelpers();
  const allCurrencies = useRecoilValue(allCurrencyDefinitionState);
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
  const isCurrencyNDF = (() => {
    const selectedCurrency = allCurrencies.find(
      (currency) => currency.currency.mnemonic === activeHedge.currency,
    );
    return Boolean(selectedCurrency?.ndf) ?? false;
  })();
  return (
    <Stack gap={1}>
      <ToggleButtonGroup
        fullWidth
        color='primary'
        value={editSettlementDetails.is_cash_settle}
        exclusive
        onChange={(_event, value) => {
          if (value !== null) {
            setEditSettlementDetails((payload) => {
              return {
                ...payload,
                is_cash_settle: value,
              };
            });
          }
        }}
        sx={{ marginBottom: 2 }}
        aria-label='Method of Payment'
      >
        <ToggleButton value={true}>CASH SETTLED IN USD</ToggleButton>
        {!isCurrencyNDF ? (
          <ToggleButton value={false}>
            DELIVER IN {activeHedge.currency}
          </ToggleButton>
        ) : null}
      </ToggleButtonGroup>
      <FormControl>
        <InputLabel id='origin-label'>
          {editSettlementDetails.is_cash_settle
            ? 'Cash Settle Account'
            : 'Origin'}
        </InputLabel>
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
      </FormControl>
      {!editSettlementDetails.is_cash_settle && (
        <>
          {walletAvailable ? (
            <FormControl>
              <InputLabel id='origin-label'>Destination Account</InputLabel>
              <Select
                labelId='destination-label'
                name='destination_account'
                id='destination_account'
                value={
                  editSettlementDetails?.destination_account ||
                  destinationAccounts[0]?.wallet_id
                }
                required
                displayEmpty
                placeholder='Destination Account'
                label='Destination Account'
                onChange={(e) => {
                  setEditSettlementDetails((payload) => {
                    return {
                      ...payload,
                      destination_account: e.target.value,
                      destination_account_type:
                        PangeaInstructDealRequestDeliveryMethodEnum.C,
                    };
                  });
                }}
                disabled={isLoadingPurposes}
              >
                {destinationAccounts.map((purpose) => {
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
          ) : (
            <FormControl>
              <InputLabel id='origin-label'>Beneficiary</InputLabel>
              <Select
                labelId='destination-label-beneficiary'
                name='destination_account'
                id='destination_account'
                value={editSettlementDetails?.destination_account ?? ''}
                required
                placeholder='Beneficiary'
                label='Beneficiary'
                onChange={(e) => {
                  setEditSettlementDetails((payload) => {
                    return {
                      ...payload,
                      destination_account: e.target.value,
                      destination_account_type:
                        (beneficiaryAccounts.find(
                          (account) =>
                            account.beneficiary_id === e.target.value,
                        )
                          ?.payment_methods[0] as unknown as PangeaInstructDealRequestDeliveryMethodEnum) ??
                        PangeaInstructDealRequestDeliveryMethodEnum.W,
                    };
                  });
                }}
                disabled={isLoadingPurposes}
                displayEmpty
              >
                {beneficiaryAccounts.map((purpose) => {
                  const {
                    beneficiary_id,
                    destination_currency,
                    beneficiary_name,
                  } = purpose;
                  return (
                    <MenuItem key={beneficiary_id} value={beneficiary_id}>
                      {`${beneficiary_name} - ${destination_currency}`}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          )}
          <FormControl>
            <InputLabel id='origin-label'>Purpose of payment</InputLabel>
            <Select
              labelId='purpose-label'
              name='purpose_of_payment'
              id='purpose-of-payment'
              value={
                editSettlementDetails?.purpose_of_payment ??
                'INTERCOMPANY PAYMENT'
              }
              required
              placeholder='Purpose of Payment'
              label='Purpose of Payment'
              onChange={(e) => {
                setEditSettlementDetails((payload) => {
                  return {
                    ...payload,
                    purpose_of_payment: e.target.value,
                  };
                });
              }}
              disabled={isLoadingPurposes}
              displayEmpty
            >
              {allPurposes.map((purpose) => {
                const { text, id } = purpose;
                return (
                  <MenuItem key={id} value={id}>
                    {text}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </>
      )}
      <FormControl>
        <InputLabel id='origin-label'>Funding Source</InputLabel>
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

export default PayingSettlementReview;
