import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import {
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import {
  CorPayRateDisplay,
  ForeignCurrencyInput2,
  PangeaLoading,
  PangeaTooltip,
  SummaryDataPoint,
} from 'components/shared';
import { useRouterParts, useWalletAndPaymentHelpers } from 'hooks';
import {
  PangeaCorpayLockSideEnum,
  PangeaInstructDealRequestDeliveryMethodEnum,
  PangeaWallet,
  PangeaInstructDealRequestSettlement,
  PangeaPurposeEnum,
} from 'lib';
import { debounce } from 'lodash';
import { Fragment, useCallback } from 'react';
import { PangeaColors } from 'styles';

export const TransferDetails = (): JSX.Element => {
  const {
    routerParts: [, , sourceWalletId],
  } = useRouterParts();

  const {
    allWallets,
    renderHelperText,
    amountsErrorState,
    corPayQuotePaymentResponse,
    paymentDetails,
    settlementDetails,
    isLoadingSettlementWallets,
    selectedAccountForDetails,
    isWalletAccount,
    openDialog,
    setOpenDialog,
    handlePaymentAmountChange,
    handleSettlementAmountChange,
    setBookAndInstructDealRequest,
    bookAndInstructDealRequest,
    CustomDialog,
    paymentLockSide,
    setPaymentLockSide,
    isLoadingFxRate,
  } = useWalletAndPaymentHelpers();

  // Functions & Handlers
  const handleTransferFromChanged = debounce(
    useCallback(
      (event: SelectChangeEvent) => {
        const selectedAccount: Optional<PangeaWallet> = allWallets?.find(
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
                  account_id: selectedAccount?.wallet_id ?? '',
                  currency: selectedAccount?.currency ?? '',
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
        const selectedAccount: Optional<PangeaWallet> = allWallets?.find(
          (wallet) => wallet.wallet_id === event.target.value,
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
                  beneficiary_id: selectedAccount?.wallet_id ?? '',
                  currency: selectedAccount?.currency ?? '',
                  purpose_of_payment: 'INTERCOMPANY PAYMENT',
                  payment_reference: 'Wallet Transfer',
                },
              ],
              settlements: [
                { ...settlementSpotPayload },
                {
                  delivery_method:
                    PangeaInstructDealRequestDeliveryMethodEnum.C,
                  account_id: selectedAccount?.wallet_id ?? '',
                  currency: selectedAccount?.currency ?? '',
                  purpose: PangeaPurposeEnum.Fee,
                },
              ],
            },
          };
        });
      },
      [
        allWallets,
        bookAndInstructDealRequest.instruct_request.settlements,
        paymentDetails,
        setBookAndInstructDealRequest,
      ],
    ),
    600,
  );
  return (
    <Stack spacing={3} sx={{ minHeight: '320px' }}>
      <Stack spacing={1}>
        <FormControl>
          <InputLabel id='transfer-from-label'>Origin</InputLabel>
          <Select
            labelId='transfer-from-label'
            id='transfer-from'
            value={settlementDetails.account_id}
            label={
              isLoadingSettlementWallets ? 'Loading wallets ...' : 'Origin'
            }
            required
            onChange={handleTransferFromChanged}
            disabled={isLoadingSettlementWallets || Boolean(sourceWalletId)}
            MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
          >
            {allWallets?.map((wallet) => {
              const { wallet_id, name } = wallet;
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
              isLoadingSettlementWallets ? 'Loading wallets ...' : 'Destination'
            }
            required
            onChange={handleTransferToChanged}
            disabled={isLoadingSettlementWallets}
            MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
          >
            {allWallets?.map((wallet) => {
              const { wallet_id, name } = wallet;
              return (
                <MenuItem key={wallet_id} value={wallet_id}>
                  {name}
                </MenuItem>
              );
            })}
          </Select>
          {renderHelperText(paymentDetails.beneficiary_id)}
        </FormControl>
      </Stack>
      <Stack direction='row'>
        <Stack spacing={1} sx={{ width: '65%' }}>
          <Typography>Amount</Typography>
          <Stack direction='row' spacing={1} alignItems='center'>
            <ForeignCurrencyInput2
              id='settlement-amount'
              value={corPayQuotePaymentResponse?.settlement.amount ?? 0}
              onChange={(value) =>
                handleSettlementAmountChange(value, 'FXWallet')
              }
              direction={'paying'}
              foreignCurrency={settlementDetails.currency}
              customLabel='Sending Approx.'
              disabled={
                isLoadingFxRate ||
                paymentLockSide === PangeaCorpayLockSideEnum.Payment
              }
              width='250px'
              checkCurrencyProp={false}
            />
            <PangeaTooltip
              title={
                <Fragment>
                  Lock the settlement currency if you would like to guarantee
                  the amount displayed will draft from your &ldquo;transfer
                  from&rdquo; wallet.
                </Fragment>
              }
              placement='right'
              arrow
            >
              <IconButton
                aria-label='lock settlement amount'
                data-testid='lockSideSettlementButton'
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
              onChange={(value) => handlePaymentAmountChange(value, 'FXWallet')}
              direction={'paying'}
              foreignCurrency={
                paymentDetails.currency ? paymentDetails.currency : 'USD'
              }
              isValidForm={!amountsErrorState.isAmountError}
              customError={amountsErrorState.errorMessage}
              disabled={
                isLoadingFxRate ||
                paymentLockSide === PangeaCorpayLockSideEnum.Settlement
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
                  Lock the payment currency if you would like to guarantee the
                  amount received by &ldquo;transfer to&rdquo; wallet.
                </Fragment>
              }
            >
              <IconButton
                aria-label='lock payment amount'
                data-testid='lockSidePaymentButton'
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
      <Typography
        variant='body1'
        sx={{
          width: '70%',
          fontSize: '14px',
          fontWeight: '400',
          lineHeight: '16px',
          color: PangeaColors.SolidSlateLight,
        }}
      >
        Rate reflects the average price over the last 15 minutes. The final rate
        will be determined at execution.
      </Typography>
      <CustomDialog onClose={() => setOpenDialog(false)} open={openDialog}>
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
          }}
        >
          {selectedAccountForDetails && (
            <Typography variant='h4' component='span'>
              {isWalletAccount(selectedAccountForDetails)
                ? `${selectedAccountForDetails.currency} Wallet`
                : 'N/A'}
            </Typography>
          )}
          <IconButton
            aria-label='close'
            onClick={() => setOpenDialog(false)}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {selectedAccountForDetails ? (
          <Stack>
            <SummaryDataPoint
              label='Account number'
              value={
                isWalletAccount(selectedAccountForDetails)
                  ? selectedAccountForDetails.account_number ?? 'N/A'
                  : selectedAccountForDetails.bank_account_number
              }
            />
          </Stack>
        ) : (
          <PangeaLoading />
        )}
      </CustomDialog>
    </Stack>
  );
};

export default TransferDetails;
