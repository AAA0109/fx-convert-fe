import AddIcon from '@mui/icons-material/Add';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import {
  FormControl,
  IconButton,
  InputLabel,
  ListSubheader,
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
  PangeaBeneficiary,
  PangeaCorpayLockSideEnum,
  PangeaInstructDealRequestDeliveryMethodEnum,
  PangeaInstructDealRequestSettlement,
  PangeaPurposeEnum,
  PangeaWallet,
} from 'lib';
import { debounce } from 'lodash';
import { Fragment, Suspense, useCallback, useState } from 'react';
import { PangeaColors } from 'styles';
import BeneficiaryAccountDetails from './BeneficiaryAccountDetails';
import { SettlementAccountDetails } from './SettlementAccountDetails';
import { WalletAccountDetails } from './WalletAccountDetails';

export const BeneficiaryDetails = (): JSX.Element => {
  const {
    routerParts: [, , sourceWalletId],
  } = useRouterParts();
  const [openAddBeneficiaryDialog, setOpenAddBeneficiaryDialog] =
    useState(false);

  const {
    allWallets,
    settlementAccounts,
    paymentDetails,
    beneficiaryAccounts,
    amountsErrorState,
    corPayQuotePaymentResponse: spotRateData,
    settlementDetails,
    isLoadingSettlementWallets,
    renderHelperText,
    isLoadingPurposes,
    allPurposes,
    setOpenDialog,
    openDialog,
    selectedAccountForDetails,
    isBeneficiaryAccount,
    isWalletAccount,
    isSettlementAccount,
    handleSettlementAmountChange,
    handlePaymentAmountChange,
    setBookAndInstructDealRequest,
    bookAndInstructDealRequest,
    CustomDialog,
    setPaymentLockSide,
    paymentLockSide,
    isLoadingFxRate,
  } = useWalletAndPaymentHelpers();

  const handleTransferFromChanged = debounce(
    useCallback(
      (event: SelectChangeEvent) => {
        const selectedSource: Optional<PangeaWallet> =
          allWallets?.find(
            (wallet) => wallet.wallet_id === event.target.value,
          ) ??
          settlementAccounts?.find(
            (account) => account.wallet_id === event.target.value,
          );
        setBookAndInstructDealRequest((payload) => {
          return {
            ...payload,
            instruct_request: {
              ...payload.instruct_request,
              settlements: [
                {
                  delivery_method:
                    selectedSource && isWalletAccount(selectedSource)
                      ? PangeaInstructDealRequestDeliveryMethodEnum.C
                      : selectedSource && isSettlementAccount(selectedSource)
                      ? PangeaInstructDealRequestDeliveryMethodEnum.W
                      : PangeaInstructDealRequestDeliveryMethodEnum.W,
                  account_id: selectedSource ? selectedSource?.wallet_id : '',
                  currency:
                    selectedSource &&
                    (isWalletAccount(selectedSource) ||
                      isSettlementAccount(selectedSource))
                      ? selectedSource?.currency
                      : '',
                  purpose: PangeaPurposeEnum.Spot,
                },
                {
                  delivery_method: selectedSource
                    ? (selectedSource?.method as unknown as PangeaInstructDealRequestDeliveryMethodEnum)
                    : (paymentDetails.delivery_method as PangeaInstructDealRequestDeliveryMethodEnum),
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
        isSettlementAccount,
        isWalletAccount,
        paymentDetails?.beneficiary_id,
        paymentDetails?.currency,
        paymentDetails.delivery_method,
        setBookAndInstructDealRequest,
        settlementAccounts,
      ],
    ),
    1000,
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
        beneficiaryAccounts,
        setBookAndInstructDealRequest,
        bookAndInstructDealRequest.instruct_request.settlements,
        paymentDetails,
      ],
    ),
    600,
  );
  const handleOnDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <Stack spacing={3} sx={{ minHeight: '445px' }}>
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
                isLoadingSettlementWallets ? 'Loading accounts ...' : 'Origin'
              }
              required
              onChange={handleTransferFromChanged}
              disabled={Boolean(sourceWalletId) || isLoadingSettlementWallets}
              MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
            >
              <ListSubheader>Wallets</ListSubheader>
              {allWallets?.map((wallet) => {
                const { wallet_id, name } = wallet;
                return (
                  <MenuItem key={wallet_id} value={wallet_id}>
                    {name}
                  </MenuItem>
                );
              })}
              <ListSubheader>Bank Accounts</ListSubheader>
              {settlementAccounts.map((account) => {
                const { wallet_id, name } = account;
                return (
                  <MenuItem key={wallet_id} value={wallet_id}>
                    {name}
                  </MenuItem>
                );
              })}
            </Select>
            {renderHelperText(settlementDetails.account_id)}
          </FormControl>
          <Stack direction='row' spacing={2}>
            <FormControl sx={{ width: '70%' }}>
              <InputLabel id='transfer-to-label'>Destination</InputLabel>
              <Select
                labelId='transfer-to-label'
                id='transfer-to'
                value={paymentDetails.beneficiary_id}
                label='Destination'
                required
                onChange={handleTransferToChanged}
                MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
              >
                {beneficiaryAccounts.map((beneficiary) => {
                  const {
                    beneficiary_id,
                    beneficiary_name,
                    destination_currency,
                    bank_name,
                  } = beneficiary;
                  return (
                    <MenuItem key={beneficiary_id} value={beneficiary_id}>
                      {`${beneficiary_name} - ${destination_currency} - ${bank_name}`}
                    </MenuItem>
                  );
                })}
                <MenuItem
                  value=''
                  key='add_new_beneficiary'
                  onClick={() => setOpenAddBeneficiaryDialog(true)}
                >
                  <AddIcon /> Add new beneficiary
                </MenuItem>
              </Select>
              {renderHelperText(paymentDetails.beneficiary_id)}
            </FormControl>
            <BeneficaryForm
              open={openAddBeneficiaryDialog}
              setOpen={setOpenAddBeneficiaryDialog}
            />
            <FormControl
              disabled={Boolean(!paymentDetails.beneficiary_id)}
              sx={{ width: '30%' }}
            >
              <InputLabel id='transfer-method-label'>
                Transfer Method
              </InputLabel>
              <Select
                disabled
                labelId='transfer-method-label'
                id='transfer-method'
                value={
                  !paymentDetails.beneficiary_id
                    ? ''
                    : paymentDetails.delivery_method
                }
                label='Transfer Method'
                required
                onChange={(event) => {
                  setBookAndInstructDealRequest((payload) => {
                    return {
                      ...payload,
                      instruct_request: {
                        ...payload.instruct_request,
                        payments: [
                          {
                            ...paymentDetails,
                            delivery_method: event.target
                              .value as PangeaInstructDealRequestDeliveryMethodEnum,
                          },
                        ],
                      },
                    };
                  });
                }}
              >
                {beneficiaryAccounts &&
                  beneficiaryAccounts
                    ?.find(
                      (account) =>
                        account.beneficiary_id ===
                        paymentDetails.beneficiary_id,
                    )
                    ?.payment_methods?.map((method) => (
                      <MenuItem key={method} value={method}>
                        {method}
                      </MenuItem>
                    ))}
              </Select>
            </FormControl>
          </Stack>
        </Stack>
        <Stack direction='row' spacing={2}>
          <FormControl sx={{ width: '50%' }}>
            <InputLabel id='purpose-label'>Purpose of Payment</InputLabel>
            <Select
              labelId='purpose-label'
              id='purpose-of-payment'
              value={paymentDetails.purpose_of_payment}
              required
              label='Purpose of Payment'
              onChange={(event) => {
                setBookAndInstructDealRequest((payload) => {
                  return {
                    ...payload,
                    instruct_request: {
                      ...payload.instruct_request,
                      payments: [
                        {
                          ...paymentDetails,
                          purpose_of_payment: event.target.value,
                        },
                      ],
                    },
                  };
                });
              }}
              disabled={isLoadingPurposes}
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
          <TextField
            id='payment-reference'
            label='Memo'
            value={paymentDetails.payment_reference}
            variant='filled'
            helperText='Optional memo for this payment'
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
            <Stack direction='row' spacing={1} alignItems='center'>
              <ForeignCurrencyInput2
                id='settlement-amount'
                value={spotRateData?.settlement.amount ?? 0}
                onChange={(value) =>
                  handleSettlementAmountChange(value, 'BeneficiaryPayments')
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
                  handlePaymentAmountChange(value, 'BeneficiaryPayments')
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
            <Typography
              typography={'small'}
              color={PangeaColors.SolidSlateLight}
              fontSize={12}
            >
              Rate reflects average price over the last 15 minutes. The final
              rate will be determined at execution.
            </Typography>
          </Stack>

          <Stack sx={{ margin: '0 auto' }} justifyContent='center'>
            {isLoadingFxRate ? (
              <Stack>
                <PangeaLoading />
              </Stack>
            ) : (
              <CorPayRateDisplay />
            )}
          </Stack>
        </Stack>

        <CustomDialog onClose={handleOnDialogClose} open={openDialog}>
          {selectedAccountForDetails &&
            isBeneficiaryAccount(selectedAccountForDetails) && (
              <BeneficiaryAccountDetails
                account={selectedAccountForDetails}
                onCloseModal={handleOnDialogClose}
              />
            )}
          {selectedAccountForDetails &&
            isSettlementAccount(selectedAccountForDetails) && (
              <SettlementAccountDetails
                account={selectedAccountForDetails}
                onCloseModal={handleOnDialogClose}
              />
            )}
          {selectedAccountForDetails &&
            isWalletAccount(selectedAccountForDetails) && (
              <WalletAccountDetails
                account={selectedAccountForDetails}
                onCloseModal={handleOnDialogClose}
              />
            )}
        </CustomDialog>
      </Suspense>
    </Stack>
  );
};

export default BeneficiaryDetails;
