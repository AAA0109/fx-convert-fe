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
  TextField,
  Typography,
} from '@mui/material';
import { bankAccountsDataState } from 'atoms';
import {
  CorPayRateDisplay,
  ForeignCurrencyInput2,
  PangeaLoading,
  PangeaTooltip,
  SummaryDataPoint,
} from 'components/shared';
import { useWalletAndPaymentHelpers } from 'hooks';
import {
  PangeaCorpayLockSideEnum,
  PangeaInstructDealRequestDeliveryMethodEnum,
  PangeaInstructDealRequestSettlement,
  PangeaPurposeEnum,
  PangeaSettlementAccountChildren,
  PangeaWallet,
} from 'lib';
import { debounce } from 'lodash';
import { Fragment, Suspense, useCallback, useMemo } from 'react';
import { useRecoilValueLoadable } from 'recoil';
import { PangeaColors } from 'styles';

export const DepositDetails = (): JSX.Element => {
  const {
    corPayQuotePaymentResponse: spotRateData,
    setPaymentLockSide,
    paymentLockSide,
    paymentDetails,
    settlementDetails,
    amountsErrorState,
    isLoadingFxRate,
    allWallets,
    renderHelperText,
    CustomDialog,
    setOpenDialog,
    openDialog,
    selectedAccountForDetails,
    isSettlementAccount,
    handlePaymentAmountChange,
    handleSettlementAmountChange,
    setBookAndInstructDealRequest,
    bookAndInstructDealRequest,
    isWalletAccount,
  } = useWalletAndPaymentHelpers();

  const sourceAccountsLoadable = useRecoilValueLoadable(bankAccountsDataState);

  const isLoadingSourceAccounts = sourceAccountsLoadable.state === 'loading';
  const hasAllSourceAccounts = sourceAccountsLoadable.state === 'hasValue';
  const sourceAccounts = useMemo(
    () =>
      hasAllSourceAccounts && !isLoadingSourceAccounts
        ? sourceAccountsLoadable.getValue()
        : [],
    [sourceAccountsLoadable, hasAllSourceAccounts, isLoadingSourceAccounts],
  );

  const handleTransferFromChanged = debounce(
    useCallback(
      (event: SelectChangeEvent) => {
        const selectedAccount: Optional<PangeaSettlementAccountChildren> =
          sourceAccounts?.find(
            (account) => account.text === event.target.value,
          );

        setBookAndInstructDealRequest((payload) => {
          return {
            ...payload,
            instruct_request: {
              ...payload.instruct_request,
              settlements: [
                {
                  delivery_method:
                    (selectedAccount?.delivery_method as unknown as PangeaInstructDealRequestDeliveryMethodEnum) ??
                    PangeaInstructDealRequestDeliveryMethodEnum.W,
                  account_id: selectedAccount?.text ?? '',
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
        paymentDetails?.beneficiary_id,
        paymentDetails?.currency,
        setBookAndInstructDealRequest,
        sourceAccounts,
      ],
    ),
    600,
  );
  const handleTransferToChanged = debounce(
    useCallback(
      (event: SelectChangeEvent) => {
        const selectedWallet: Optional<PangeaWallet> = allWallets?.find(
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
                  beneficiary_id: selectedWallet?.wallet_id ?? '',
                  delivery_method:
                    PangeaInstructDealRequestDeliveryMethodEnum.C,
                  currency: selectedWallet?.currency ?? '',
                  purpose_of_payment: 'Payment, Family Assistance',
                },
              ],
              settlements: [
                { ...settlementSpotPayload },
                {
                  delivery_method:
                    PangeaInstructDealRequestDeliveryMethodEnum.C,
                  account_id: selectedWallet?.wallet_id ?? '',
                  currency: selectedWallet?.currency ?? '',
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
    <Stack spacing={3} sx={{ minHeight: '299px' }}>
      <Suspense
        fallback={
          <PangeaLoading loadingPhrase='Initializing ...' centerPhrase />
        }
      >
        <Stack spacing={1}>
          <FormControl>
            <InputLabel id='transfer-from-label'>Origin</InputLabel>
            <Select
              labelId='transfer-from-label'
              id='transfer-from'
              value={settlementDetails.account_id}
              label='Transfer from'
              required
              onChange={handleTransferFromChanged}
              MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
            >
              {sourceAccounts.map((account) => {
                const { text, method, currency, bank_account, id } = account;
                return (
                  <MenuItem key={id} value={text}>
                    {`${text} (${
                      bank_account ? '...' + bank_account?.slice(-4) + '-' : ''
                    }${currency}) - ${method.text}`}
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
              label='Transfer to'
              required
              onChange={handleTransferToChanged}
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
          <FormControl sx={{ width: '50%' }}>
            <TextField
              required
              id='payment-reference'
              label='Memo'
              value={paymentDetails.payment_reference}
              variant='filled'
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
            />
          </FormControl>
        </Stack>
        <Stack direction='row'>
          <Stack spacing={1} sx={{ width: '65%' }}>
            <Typography>Amount</Typography>
            <Stack direction='row' spacing={1} alignItems='center'>
              <ForeignCurrencyInput2
                id='settlement-amount'
                value={spotRateData?.settlement.amount ?? 0}
                onChange={(value) =>
                  handleSettlementAmountChange(value, 'Deposits')
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
                onChange={(value) =>
                  handlePaymentAmountChange(value, 'Deposits')
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
          Rate reflects the average price over the last 15 minutes. The final
          rate will be determined at execution.
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
                {isWalletAccount(selectedAccountForDetails) ||
                isSettlementAccount(selectedAccountForDetails)
                  ? selectedAccountForDetails.name
                  : selectedAccountForDetails.beneficiary_alias}
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
            isSettlementAccount(selectedAccountForDetails) ? (
              <Stack>
                <SummaryDataPoint
                  label='Account identifier'
                  value={selectedAccountForDetails.wallet_id}
                />
                <SummaryDataPoint
                  label='Account holder name'
                  value={selectedAccountForDetails.name ?? 'N/A'}
                />
                <SummaryDataPoint
                  label='Account number'
                  value={selectedAccountForDetails.account_number ?? 'N/A'}
                />
                <SummaryDataPoint
                  label='Payment method'
                  value={selectedAccountForDetails.method ?? 'N/A'}
                />
                <SummaryDataPoint
                  label='Currency'
                  value={selectedAccountForDetails.currency}
                />
                <SummaryDataPoint label='Account address' value='N/A' />
                <SummaryDataPoint
                  label='Bank name'
                  value={selectedAccountForDetails.bank_name ?? 'N/A'}
                />
                <SummaryDataPoint label='Bank address' value='N/A' />
              </Stack>
            ) : (
              <Stack>
                <SummaryDataPoint
                  label='Account number'
                  value={selectedAccountForDetails.beneficiary_id}
                />
              </Stack>
            )
          ) : (
            <PangeaLoading />
          )}
        </CustomDialog>
      </Suspense>
    </Stack>
  );
};

export default DepositDetails;
