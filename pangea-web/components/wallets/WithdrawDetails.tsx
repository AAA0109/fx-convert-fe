import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

import { Add } from '@mui/icons-material';
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  CorPayRateDisplay,
  ForeignCurrencyInput2,
  PangeaLoading,
  PangeaTooltip,
} from 'components/shared';
import BeneficaryForm from 'components/shared/BeneficiaryForms/BeneficiaryForm';
import { useRouterParts, useWalletAndPaymentHelpers } from 'hooks';
import {
  PangeaCorpayLockSideEnum,
  PangeaInstructDealRequestSettlement,
  PangeaPurposeEnum,
  PangeaInstructDealRequestDeliveryMethodEnum,
  PangeaBeneficiary,
  PangeaWallet,
} from 'lib';
import { debounce } from 'lodash';
import { Fragment, Suspense, useCallback, useState } from 'react';
import { PangeaColors } from 'styles';
import BeneficiaryAccountDetails from './BeneficiaryAccountDetails';
import { WalletAccountDetails } from './WalletAccountDetails';

export const WithdrawDetails = (): JSX.Element => {
  const {
    routerParts: [, , sourceWalletId],
  } = useRouterParts();
  const [isAddBeneModalOpen, setIsAddBeneModalOpen] = useState(false);

  const {
    handleSettlementAmountChange,
    allWallets,
    renderHelperText,
    corPayQuotePaymentResponse: spotRateData,
    paymentDetails,
    settlementDetails,
    isLoadingSettlementWallets,
    selectedAccountForDetails,
    isWalletAccount,
    isBeneficiaryAccount,
    openDialog,
    setOpenDialog,
    handlePaymentAmountChange,
    setBookAndInstructDealRequest,
    bookAndInstructDealRequest,
    CustomDialog,
    beneficiaryAccounts,
    setPaymentLockSide,
    paymentLockSide,
    amountsErrorState,
    isLoadingFxRate,
  } = useWalletAndPaymentHelpers();

  // Functions & Handlers
  const handleTransferFromChanged = debounce(
    useCallback(
      (event: SelectChangeEvent) => {
        const selectedWallet: Optional<PangeaWallet> = allWallets?.find(
          (wallet) => wallet.wallet_id === event.target.value,
        );
        setBookAndInstructDealRequest((payload) => {
          return {
            ...payload,
            instruct_request: {
              ...payload.instruct_request,
              settlements: [
                {
                  delivery_method:
                    PangeaInstructDealRequestDeliveryMethodEnum.C,
                  account_id: selectedWallet?.wallet_id ?? '',
                  currency: selectedWallet?.currency ?? '',
                  purpose: PangeaPurposeEnum.Spot,
                },
                {
                  delivery_method:
                    PangeaInstructDealRequestDeliveryMethodEnum.C,
                  account_id: paymentDetails?.beneficiary_id ?? '',
                  currency: paymentDetails?.currency ?? '',
                  purpose: PangeaPurposeEnum.Fee,
                },
              ],
            },
          };
        });
      },
      [
        allWallets,
        paymentDetails?.beneficiary_id,
        paymentDetails?.currency,
        setBookAndInstructDealRequest,
      ],
    ),
    600,
  );
  const handleTransferToChanged = debounce(
    useCallback(
      (event: SelectChangeEvent) => {
        const selectedAccount: Optional<PangeaBeneficiary> =
          beneficiaryAccounts?.find(
            (account) => account.beneficiary_id === event.target.value,
          );
        setBookAndInstructDealRequest((payload) => {
          const settlementSpotPayload =
            bookAndInstructDealRequest.instruct_request.settlements.find(
              (settlement) => settlement.purpose === PangeaPurposeEnum.Spot,
            ) ?? ({} as PangeaInstructDealRequestSettlement);
          return {
            ...payload,
            instruct_request: {
              ...payload.instruct_request,
              payments: [
                {
                  ...paymentDetails,
                  beneficiary_id: selectedAccount?.beneficiary_id ?? '',
                  delivery_method:
                    (selectedAccount
                      ?.payment_methods[0] as unknown as PangeaInstructDealRequestDeliveryMethodEnum) ??
                    PangeaInstructDealRequestDeliveryMethodEnum.W,
                  currency: selectedAccount?.destination_currency ?? '',
                  purpose_of_payment: 'Withdrawal',
                },
              ],
              settlements: [
                { ...settlementSpotPayload },
                {
                  delivery_method: settlementSpotPayload.delivery_method,
                  account_id: settlementSpotPayload.account_id,
                  currency: settlementSpotPayload.currency,
                  purpose: PangeaPurposeEnum.Fee,
                },
              ],
            },
          };
        });
      },
      [
        bookAndInstructDealRequest.instruct_request.settlements,
        paymentDetails,
        setBookAndInstructDealRequest,
        beneficiaryAccounts,
      ],
    ),
    600,
  );
  return (
    <Stack spacing={3} sx={{ minHeight: '320px' }}>
      <Suspense
        fallback={<PangeaLoading loadingPhrase='Loading ...' centerPhrase />}
      >
        <Stack spacing={1}>
          <FormControl>
            <InputLabel id='transfer-from-label'>Origin</InputLabel>
            <Select
              labelId='transfer-from-label'
              id='transfer-from'
              value={settlementDetails.account_id}
              label={
                isLoadingSettlementWallets
                  ? 'Loading wallets ...'
                  : 'Transfer from'
              }
              required
              onChange={handleTransferFromChanged}
              disabled={isLoadingSettlementWallets || Boolean(sourceWalletId)}
              MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
            >
              {allWallets?.map((wallet) => {
                const { name, wallet_id } = wallet;
                return (
                  <MenuItem key={wallet_id} value={wallet_id}>
                    {name}
                  </MenuItem>
                );
              })}
            </Select>
            {renderHelperText(settlementDetails.account_id)}
          </FormControl>
          <FormControl>
            <InputLabel id='transfer-to-label'>Destination</InputLabel>
            <Select
              labelId='transfer-to-label'
              id='transfer-to'
              value={paymentDetails.beneficiary_id}
              label={
                isLoadingSettlementWallets
                  ? 'Loading wallets ...'
                  : 'Transfer to'
              }
              required
              onChange={handleTransferToChanged}
              disabled={isLoadingSettlementWallets}
              MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
            >
              {beneficiaryAccounts?.map((account) => {
                const {
                  beneficiary_id,
                  beneficiary_name,
                  destination_currency,
                  bank_name,
                } = account;
                return (
                  <MenuItem key={beneficiary_id} value={beneficiary_id}>
                    {`${beneficiary_name} - ${destination_currency} - ${bank_name}`}
                  </MenuItem>
                );
              })}
              <MenuItem
                onClick={() => {
                  setIsAddBeneModalOpen(true);
                }}
              >
                <Add /> Add New Withdrawal Account
              </MenuItem>
            </Select>
            {renderHelperText(paymentDetails.beneficiary_id)}
          </FormControl>

          <TextField
            required
            id='withdrawal-reference'
            label='Memo'
            value={paymentDetails.payment_reference}
            variant='filled'
            helperText='Enter a memo for this payment'
            onChange={(event) => {
              setBookAndInstructDealRequest((payload) => {
                return {
                  ...payload,
                  instruct_request: {
                    ...payload.instruct_request,
                    payments: [
                      {
                        ...paymentDetails,
                        payment_reference: event.target.value,
                      },
                    ],
                  },
                };
              });
            }}
            sx={{ width: '50%' }}
          />
        </Stack>
        <Stack direction='row'>
          <Stack spacing={1} sx={{ width: '65%' }}>
            <Typography>Amount</Typography>
            <Stack direction='row' spacing={1} alignItems='center'>
              <ForeignCurrencyInput2
                id='settlement-amount'
                value={spotRateData?.settlement.amount ?? 0}
                onChange={(value) =>
                  handleSettlementAmountChange(value, 'Withdrawals')
                }
                direction={'paying'}
                foreignCurrency={settlementDetails.currency}
                customLabel='Sending Approx.'
                disabled={
                  isLoadingFxRate ||
                  paymentLockSide !== PangeaCorpayLockSideEnum.Settlement
                }
                width='250px'
                checkCurrencyProp={false}
              />
              <PangeaTooltip
                title={
                  <Fragment>
                    Lock the Withdrawal Amount if you would like to guarantee
                    the amount displayed will draft from your &ldquo;transfer
                    from&ldquo; wallet.
                  </Fragment>
                }
                placement='right'
                arrow
              >
                <IconButton
                  aria-label='lock withdrawal amount'
                  data-testid='lockSideWithdrawalButton'
                  onClick={() =>
                    setPaymentLockSide(PangeaCorpayLockSideEnum.Settlement)
                  }
                >
                  {paymentLockSide === PangeaCorpayLockSideEnum.Settlement ? (
                    <LockIcon />
                  ) : (
                    <LockOpenIcon />
                  )}
                </IconButton>
              </PangeaTooltip>
            </Stack>
            <Stack direction='row' spacing={1} alignItems='center'>
              <ForeignCurrencyInput2
                id='payment-amount'
                customLabel='Receiving Exactly'
                value={paymentDetails.amount ?? 0}
                onChange={(value) =>
                  handlePaymentAmountChange(value, 'Withdrawals')
                }
                direction={'paying'}
                foreignCurrency={
                  paymentDetails.currency ? paymentDetails.currency : 'USD'
                }
                isValidForm={!amountsErrorState.isAmountError}
                customError={amountsErrorState.errorMessage}
                disabled={
                  isLoadingFxRate ||
                  paymentLockSide !== PangeaCorpayLockSideEnum.Payment
                }
                showBlockError={true}
                checkCurrencyProp={false}
                width='250px'
              />
              <PangeaTooltip
                arrow
                placement='right'
                title={
                  <Fragment>
                    Lock the Receiving Amount if you would like to guarantee the
                    amount received by &rdquo;transfer to&rdquo; wallet.
                  </Fragment>
                }
              >
                <IconButton
                  aria-label='lock receiving amount'
                  data-testid='lockSideReceiveButton'
                  onClick={() =>
                    setPaymentLockSide(PangeaCorpayLockSideEnum.Payment)
                  }
                >
                  {paymentLockSide === PangeaCorpayLockSideEnum.Payment ? (
                    <LockIcon />
                  ) : (
                    <LockOpenIcon />
                  )}
                </IconButton>
              </PangeaTooltip>
            </Stack>
            <Typography
              variant='body1'
              sx={{
                width: '100%',
                fontSize: '14px',
                fontWeight: '400',
                lineHeight: '16px',
                color: PangeaColors.SolidSlateLight,
              }}
            >
              Rate reflects average price over the last 15 minutes. The final
              rate will be determined at execution.
            </Typography>
          </Stack>
          <Stack sx={{ margin: '0 auto' }} justifyContent='center'>
            <Typography>&nbsp;</Typography>
            {isLoadingFxRate ? (
              <Stack>
                <PangeaLoading />
              </Stack>
            ) : (
              <CorPayRateDisplay />
            )}
          </Stack>
        </Stack>

        <CustomDialog onClose={() => setOpenDialog(false)} open={openDialog}>
          {selectedAccountForDetails &&
            isBeneficiaryAccount(selectedAccountForDetails) && (
              <BeneficiaryAccountDetails
                account={selectedAccountForDetails}
                onCloseModal={() => setOpenDialog(false)}
              />
            )}
          {selectedAccountForDetails &&
            isWalletAccount(selectedAccountForDetails) && (
              <WalletAccountDetails
                account={selectedAccountForDetails}
                onCloseModal={() => setOpenDialog(false)}
              />
            )}
        </CustomDialog>
        <BeneficaryForm
          open={isAddBeneModalOpen}
          setOpen={setIsAddBeneModalOpen}
          isWithdrawalAccount
        />
      </Suspense>
    </Stack>
  );
};

export default WithdrawDetails;
