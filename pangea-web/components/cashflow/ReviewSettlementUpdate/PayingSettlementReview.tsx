import {
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import InputBase from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';
import {
  allCurrencyDefinitionState,
  currentForwardHedgeItem,
  domesticCurrencyState,
} from 'atoms';
import BeneficaryForm from 'components/shared/BeneficiaryForms/BeneficiaryForm';
import { useWalletAndPaymentHelpers } from 'hooks';
import {
  AnyHedgeItem,
  PangeaInstructDealRequestDeliveryMethodEnum,
  PangeaFeeResponse,
  PangeaPatchedDraftFxForward,
  formatCurrency,
} from 'lib';
import React, { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
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

interface PayingSettlementReviewProps {
  walletAvailable: boolean;
  activeHedge: AnyHedgeItem;
  handleSettlementDetailsChange: (event: SelectChangeEvent) => void;
  brokerFees?: Nullable<PangeaFeeResponse>;
  updateSettlementDetails: (val: PangeaPatchedDraftFxForward) => void;
}

const PayingSettlementReview: React.FC<PayingSettlementReviewProps> = ({
  walletAvailable,
  activeHedge,
  handleSettlementDetailsChange,
  updateSettlementDetails,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const selectedHedgeItem = useRecoilValue(currentForwardHedgeItem);
  const allCurrencies = useRecoilValue(allCurrencyDefinitionState);
  const {
    allWallets,
    settlementAccounts,
    isLoadingPurposes,
    beneficiaryAccounts,
  } = useWalletAndPaymentHelpers();

  const domesticCurrency = useRecoilValue(domesticCurrencyState);
  const cashSettlementAccounts = useMemo(() => {
    return allWallets.filter((wallet) => wallet.currency === 'USD');
  }, [allWallets]);
  const destinationAccounts = useMemo(() => {
    return allWallets.filter(
      (wallet) => wallet.currency === activeHedge.currency,
    );
  }, [activeHedge.currency, allWallets]);
  const isCurrencyNDF = (() => {
    const selectedCurrency = allCurrencies.find(
      (currency) => currency.currency.mnemonic === activeHedge.currency,
    );
    return Boolean(selectedCurrency?.ndf) ?? false;
  })();
  useEffect(() => {
    const destinationAccountValue = walletAvailable
      ? destinationAccounts[0]?.wallet_id
      : beneficiaryAccounts[0]?.beneficiary_id;

    updateSettlementDetails({
      ...selectedHedgeItem,
      funding_account: [...settlementAccounts].filter(
        (account) => account.currency === domesticCurrency,
      )[0]?.wallet_id,
      destination_account: destinationAccountValue,
      destination_account_type: walletAvailable
        ? PangeaInstructDealRequestDeliveryMethodEnum.C
        : (beneficiaryAccounts.find(
            (account) => account.beneficiary_id === destinationAccountValue,
          )
            ?.payment_methods[0] as unknown as PangeaInstructDealRequestDeliveryMethodEnum) ??
          PangeaInstructDealRequestDeliveryMethodEnum.W, // TODO: Update this to get method from beneficiary account.
      cash_settle_account: cashSettlementAccounts[0]?.wallet_id,
      origin_account: cashSettlementAccounts[0]?.wallet_id,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    settlementAccounts,
    cashSettlementAccounts,
    destinationAccounts,
    beneficiaryAccounts,
  ]);
  return (
    <Stack>
      <ToggleButtonGroup
        fullWidth
        color='primary'
        value={selectedHedgeItem?.is_cash_settle}
        exclusive
        onChange={(_event, value) => {
          if (value !== null) {
            handleSettlementDetailsChange({
              target: {
                value,
                name: 'is_cash_settle',
              },
            } as SelectChangeEvent);
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
      {!walletAvailable && (
        <Typography variant='body2' color={PangeaColors.BlackSemiTransparent60}>
          Pangea does not yet offer wallets in this currency. Hedged funds will
          become available on the settlement date, but must be sent directly to
          a beneficiary.
        </Typography>
      )}
      <Grid
        container
        sx={{
          background: '#f5f5f5',
          paddingX: 2,
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
            {selectedHedgeItem?.is_cash_settle
              ? 'settlement account'
              : 'origin'}
          </Typography>
        </Grid>
        <Grid item xs={6} textAlign='right'>
          <Select
            labelId='settlement-label'
            name='cash_settle_account'
            id={
              selectedHedgeItem?.is_cash_settle
                ? 'cash_settle_account'
                : 'origin_account'
            }
            value={
              (selectedHedgeItem?.is_cash_settle
                ? selectedHedgeItem?.cash_settle_account
                : selectedHedgeItem?.origin_account) ?? ''
            }
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
                  sx={{
                    textTransform: 'capitalize',
                    marginLeft: 1,
                    height: '24px',
                  }}
                >
                  Edit
                </Typography>
              ) : (
                <Typography
                  variant='dataBody'
                  sx={{ textTransform: 'capitalize', height: '24px' }}
                >
                  USD
                </Typography>
              )
            }
            displayEmpty
          >
            {cashSettlementAccounts.map((account) => {
              const { name, wallet_id } = account;
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
        </Grid>
        <Grid item display={'flex'} xs={6} alignItems={'center'}>
          <Typography variant='dataLabel'>settlement currency</Typography>
        </Grid>
        <Grid item xs={6} textAlign='right'>
          <Typography variant='dataBody' sx={{ textTransform: 'capitalize' }}>
            {selectedHedgeItem?.is_cash_settle ? 'USD' : activeHedge.currency}
          </Typography>
        </Grid>
        {!selectedHedgeItem?.is_cash_settle && (
          <>
            <Grid item display={'flex'} xs={6} alignItems={'center'}>
              <Typography variant='dataLabel'>settlement amount</Typography>
            </Grid>
            <Grid item xs={6} textAlign='right'>
              <Typography
                variant='dataBody'
                sx={{ textTransform: 'capitalize' }}
              >
                {formatCurrency(
                  activeHedge.amount,
                  activeHedge?.currency ?? 'USD',
                  true,
                  0,
                  0,
                )}
              </Typography>
            </Grid>
            {walletAvailable ? (
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
                      destinationAccounts.length > 1 ? (
                        <Typography
                          variant='dataBody'
                          color={PangeaColors.EarthBlueMedium}
                          sx={{
                            textTransform: 'capitalize',
                            marginLeft: 1,
                            height: '24px',
                          }}
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
                    {[...destinationAccounts].map((purpose) => {
                      const { name, wallet_id } = purpose;
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
            ) : (
              <>
                <Grid item display={'flex'} xs={6} alignItems={'center'}>
                  <Typography variant='dataLabel'>Beneficiary</Typography>
                </Grid>
                <Grid item xs={6} textAlign='right'>
                  <Select
                    labelId='purpose-label'
                    name='destination_account'
                    id='destination_account'
                    value={selectedHedgeItem?.destination_account ?? ''}
                    required
                    placeholder='Destination Account'
                    label='Destination Account'
                    onChange={handleSettlementDetailsChange}
                    disabled={isLoadingPurposes}
                    input={<BootstrapInput />}
                    IconComponent={() => <></>}
                    displayEmpty
                  >
                    <MenuItem value={''}>
                      <Typography
                        variant='dataBody'
                        color={PangeaColors.EarthBlueMedium}
                        sx={{ textTransform: 'capitalize' }}
                      >
                        Select Beneficiary (Optional)
                      </Typography>
                    </MenuItem>
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
                </Grid>
              </>
            )}
          </>
        )}
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
            value={selectedHedgeItem?.funding_account ?? ''}
            required
            placeholder='Funding Source'
            label='Funding Source'
            onChange={handleSettlementDetailsChange}
            disabled={isLoadingPurposes}
            input={<BootstrapInput />}
            IconComponent={() => <></>}
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
            {settlementAccounts
              .filter((account) => account.currency === domesticCurrency)
              .map((account) => {
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
    </Stack>
  );
};

export default PayingSettlementReview;
