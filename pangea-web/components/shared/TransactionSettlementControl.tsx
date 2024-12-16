import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import { fxFetchingSpotRateState, paymentspotRateDataState } from 'atoms';
import {
  BeneficiaryAccountDetails,
  SettlementAccountDetails,
  WalletAccountDetails,
} from 'components/wallets';
import { useWalletAndPaymentHelpers } from 'hooks';
import {
  CreateOrUpdatePaymentArguments,
  PangeaBeneficiary,
  PangeaBeneficiaryStatusEnum,
  PangeaBlankEnum,
  PangeaBroker,
  PangeaFwdBrokerEnum,
  PangeaWallet,
  TransactionRequestData,
} from 'lib';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { SetterOrUpdater, useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';
import { BeneficaryForm } from './BeneficiaryForms';
import BeneficiaryStatusChip from './BeneficiaryStatusChip';
import EmptyAccountItem from './EmptyAccountItem';
import React from 'react';

type TransactionSettlementControlProps = {
  transactionRequestData: TransactionRequestData;
  setTransactionRequestData: SetterOrUpdater<TransactionRequestData>;
  onCreateOrUpdateTransaction: (
    options: CreateOrUpdatePaymentArguments,
  ) => Promise<void>;
};

export const TransactionSettlementControl = ({
  transactionRequestData,
  setTransactionRequestData,
  onCreateOrUpdateTransaction,
}: TransactionSettlementControlProps): JSX.Element => {
  const [openAddBeneficiaryDialog, setOpenAddBeneficiaryDialog] =
    useState(false);
  const fetchingSpotRate = useRecoilValue(fxFetchingSpotRateState);
  const initialMarketData = useRecoilValue(paymentspotRateDataState);
  const {
    isLoadingSettlementWallets,
    allWallets,
    settlementAccounts,
    beneficiaryAccounts,
    getOriginAccountMethod,
    isWalletAccount,
    getDestinationAccountMethod,
    setOpenDialog,
    renderHelperText,
    isLoadingPurposes,
    CustomDialog,
    isBeneficiaryAccount,
    isSettlementAccount,
    openDialog,
    selectedAccountForDetails,
    allPurposes,
  } = useWalletAndPaymentHelpers();
  const [settlementBroker, setSettlementBroker] =
    useState<Nullable<PangeaBroker>>(null);

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
        setTransactionRequestData(
          (prev) =>
            ({
              ...prev,
              paymentDetails: {},
              settlementDetails: {
                ...prev.settlementDetails,
                account_id: selectedSource ? selectedSource?.wallet_id : '',
              },
              origin_account_method: getOriginAccountMethod(selectedSource),
            } as TransactionRequestData),
        );
        onCreateOrUpdateTransaction({});
      },
      [
        allWallets,
        setTransactionRequestData,
        settlementAccounts,
        onCreateOrUpdateTransaction,
        getOriginAccountMethod,
      ],
    ),
    600,
  );

  const handleTransferToChanged = debounce(
    useCallback(
      (event: SelectChangeEvent) => {
        const selectedAccount: Optional<PangeaBeneficiary | PangeaWallet> =
          beneficiaryAccounts?.find(
            (account) => account.beneficiary_id === event.target.value,
          ) ??
          allWallets?.find((wallet) => wallet.wallet_id === event.target.value);

        setTransactionRequestData(
          (prev) =>
            ({
              ...prev,
              paymentDetails: {
                ...prev.paymentDetails,
                beneficiary_id:
                  selectedAccount && isWalletAccount(selectedAccount)
                    ? selectedAccount.wallet_id
                    : selectedAccount?.beneficiary_id ?? '',
              },
              destination_account_method:
                getDestinationAccountMethod(selectedAccount),
            } as TransactionRequestData),
        );
        onCreateOrUpdateTransaction({});
      },
      [
        beneficiaryAccounts,
        onCreateOrUpdateTransaction,
        allWallets,
        setTransactionRequestData,
        isWalletAccount,
        getDestinationAccountMethod,
      ],
    ),
    600,
  );
  const handleOnDialogClose = () => {
    setOpenDialog(false);
  };
  const isDestinationRequired =
    settlementBroker !== null &&
    settlementBroker.broker_provider === PangeaFwdBrokerEnum.CORPAY;

  const isDestinationInvalid =
    isDestinationRequired &&
    !transactionRequestData.paymentDetails?.beneficiary_id;

  useEffect(() => {
    if (transactionRequestData?.settlementDetails?.account_id) {
      const selectedSource: Optional<PangeaWallet> =
        allWallets?.find(
          (wallet) =>
            wallet.wallet_id ===
            transactionRequestData?.settlementDetails?.account_id,
        ) ??
        settlementAccounts?.find(
          (account) =>
            account.wallet_id ===
            transactionRequestData?.settlementDetails?.account_id,
        );
      if (selectedSource?.broker.id) {
        setSettlementBroker(selectedSource.broker);
      }
    }
  }, [
    transactionRequestData?.settlementDetails?.account_id,
    allWallets,
    settlementAccounts,
  ]);

  const [buySellCurrencySelected, setBuySellCurrencySelected] = useState(false);

  useEffect(() => {
    setBuySellCurrencySelected(
      !!(
        transactionRequestData.payment_currency &&
        transactionRequestData.settlement_currency
      ),
    );
  }, [transactionRequestData]);

  return (
    <>
      <Stack spacing={1} pt={2}>
        <Typography
          variant='body2'
          pb={1}
          color={PangeaColors.BlackSemiTransparent87}
        >
          Settlement Details
        </Typography>
        <FormControl>
          <InputLabel id='transfer-from-label'>Origin</InputLabel>
          <Select
            labelId='transfer-from-label'
            id='transfer-from'
            value={transactionRequestData.settlementDetails?.account_id ?? ''}
            label={
              isLoadingSettlementWallets ? 'Loading accounts ...' : 'Origin'
            }
            onChange={handleTransferFromChanged}
            disabled={
              isLoadingSettlementWallets ||
              fetchingSpotRate ||
              !buySellCurrencySelected
            }
            MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
            sx={{
              '& div:not(.MuiChip-root)': {
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                paddingRight: '10px',
              },
            }}
          >
            <ListSubheader
              sx={{
                backgroundColor: PangeaColors.SolidSlateDarker,
                color: PangeaColors.LightPrimaryContrast,
              }}
              color='inherit'
            >
              Wallets
            </ListSubheader>
            {allWallets?.length === 0 ||
            allWallets?.filter(
              ({ currency, broker }) =>
                currency === transactionRequestData.settlement_currency &&
                broker.broker_provider ===
                  initialMarketData?.executing_broker?.broker_provider,
            ).length === 0 ? (
              <EmptyAccountItem
                type='wallet'
                currency={transactionRequestData.settlement_currency}
              />
            ) : (
              allWallets
                ?.filter(
                  ({ currency, broker }) =>
                    currency === transactionRequestData.settlement_currency &&
                    broker.broker_provider ===
                      initialMarketData?.executing_broker?.broker_provider,
                )
                .map((wallet) => {
                  const { wallet_id, name, latest_balance } = wallet;
                  const shouldDisable =
                    initialMarketData?.executing_broker?.broker_provider !==
                      PangeaFwdBrokerEnum.MONEX && latest_balance <= 1;
                  return (
                    <MenuItem
                      key={wallet_id}
                      value={wallet_id}
                      disabled={shouldDisable}
                      data-testid='originWallet'
                    >
                      <Stack
                        direction='row'
                        justifyContent='space-between'
                        alignItems='center'
                        width='100%'
                      >
                        <Box>
                          {name}:{' '}
                          <span style={{ fontWeight: 700 }}>
                            ${latest_balance}
                          </span>
                        </Box>
                      </Stack>
                    </MenuItem>
                  );
                })
            )}
            <ListSubheader
              sx={{
                backgroundColor: PangeaColors.SolidSlateDarker,
                color: PangeaColors.LightPrimaryContrast,
              }}
              color='inherit'
            >
              Bank Accounts
            </ListSubheader>
            {settlementAccounts?.filter(
              ({ currency, broker }) =>
                currency === transactionRequestData.settlement_currency &&
                broker.broker_provider ===
                  initialMarketData?.executing_broker?.broker_provider,
            ).length === 0 ? (
              <EmptyAccountItem
                type='settlement'
                currency={transactionRequestData.settlement_currency}
              />
            ) : (
              settlementAccounts
                ?.filter(
                  ({ currency, broker }) =>
                    currency === transactionRequestData.settlement_currency &&
                    broker.broker_provider ===
                      initialMarketData?.executing_broker?.broker_provider,
                )
                .map((account) => {
                  const { wallet_id, account_number, name } = account;
                  return (
                    <MenuItem
                      key={wallet_id}
                      value={wallet_id}
                      data-testid='originBankAccount'
                    >
                      <Stack
                        direction='row'
                        justifyContent='space-between'
                        alignItems='center'
                        width='100%'
                      >
                        {`${name} (${
                          account_number
                            ? '...' + account_number?.slice(-4)
                            : ''
                        })`}
                      </Stack>
                    </MenuItem>
                  );
                })
            )}
          </Select>
          {renderHelperText(
            transactionRequestData?.settlementDetails?.account_id,
          )}
        </FormControl>
        <Stack direction='row' spacing={2}>
          <FormControl sx={{ width: '100%' }}>
            <InputLabel id='transfer-to-label'>Destination</InputLabel>
            <Select
              labelId='transfer-to-label'
              id='transfer-to'
              value={
                transactionRequestData.paymentDetails?.beneficiary_id ?? ''
              }
              required={isDestinationRequired}
              error={isDestinationInvalid}
              label='Destination'
              onChange={handleTransferToChanged}
              MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
              disabled={isLoadingSettlementWallets || !buySellCurrencySelected}
              sx={{
                '& div:not(.MuiChip-root)': {
                  maxWidth: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  paddingRight: '10px',
                },
              }}
            >
              <ListSubheader
                sx={{
                  backgroundColor: PangeaColors.SolidSlateDarker,
                  color: PangeaColors.LightPrimaryContrast,
                }}
                color='inherit'
              >
                Beneficiaries
              </ListSubheader>
              {beneficiaryAccounts
                ?.filter(
                  (account) =>
                    account.destination_currency ===
                      transactionRequestData.payment_currency &&
                    initialMarketData?.executing_broker != null &&
                    account.brokers
                      .map(({ broker_provider }) => broker_provider)
                      .includes(
                        initialMarketData.executing_broker.broker_provider as
                          | PangeaFwdBrokerEnum
                          | PangeaBlankEnum,
                      ),
                )
                .map((beneficiary) => {
                  const {
                    beneficiary_id,
                    beneficiary_name,
                    destination_currency,
                    bank_name,
                    status,
                    brokers,
                  } = beneficiary;
                  const shouldDisable = (() => {
                    if (!settlementBroker) {
                      return false;
                    }
                    return (
                      !brokers
                        .map(({ id }) => id)
                        .includes(settlementBroker.id) &&
                      ![PangeaBeneficiaryStatusEnum.Synced].includes(status)
                    );
                  })();
                  return (
                    <MenuItem
                      key={beneficiary_id}
                      value={beneficiary_id}
                      disabled={shouldDisable}
                      data-testid='destinationWallet'
                    >
                      <Stack
                        direction='row'
                        justifyContent='space-between'
                        width='100%'
                        columnGap={0.5}
                      >
                        <Box
                          sx={{ flex: 1 }}
                        >{`${beneficiary_name} - ${destination_currency} - ${bank_name}`}</Box>
                        <Box display='flex' flexDirection='row' columnGap={0.5}>
                          <BeneficiaryStatusChip status={status} />
                        </Box>
                      </Stack>
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
              <ListSubheader
                sx={{
                  backgroundColor: PangeaColors.SolidSlateDarker,
                  color: PangeaColors.LightPrimaryContrast,
                }}
                color='inherit'
              >
                Wallets
              </ListSubheader>
              {allWallets?.length === 0 ||
              allWallets?.filter(
                ({ currency, broker }) =>
                  currency === transactionRequestData.payment_currency &&
                  broker.broker_provider ===
                    initialMarketData?.executing_broker?.broker_provider,
              ).length === 0 ? (
                <EmptyAccountItem
                  type='wallet'
                  currency={transactionRequestData.payment_currency}
                />
              ) : (
                allWallets
                  ?.filter(
                    ({ currency, broker }) =>
                      currency === transactionRequestData.payment_currency &&
                      broker.broker_provider ===
                        initialMarketData?.executing_broker?.broker_provider,
                  )
                  ?.map((wallet) => {
                    const { wallet_id, name, broker, latest_balance } = wallet;
                    const shouldDisable = settlementBroker
                      ? settlementBroker.id !== broker.id
                      : false;
                    return (
                      <MenuItem
                        key={wallet_id}
                        value={wallet_id}
                        disabled={shouldDisable}
                        data-testid='destinationBankAccount'
                      >
                        <Stack
                          direction='row'
                          justifyContent='space-between'
                          alignItems='center'
                          width='100%'
                        >
                          <Box>
                            {name}:{' '}
                            <span style={{ fontWeight: 700 }}>
                              ${latest_balance}
                            </span>
                          </Box>
                        </Stack>
                      </MenuItem>
                    );
                  })
              )}
            </Select>
            {isDestinationInvalid && (
              <FormHelperText sx={{ color: PangeaColors.RiskBerryMedium }}>
                All Corpay settlement accounts need a valid Corpay destination
              </FormHelperText>
            )}
            {renderHelperText(
              transactionRequestData?.paymentDetails?.beneficiary_id,
            )}
          </FormControl>

          <BeneficaryForm
            open={openAddBeneficiaryDialog}
            setOpen={setOpenAddBeneficiaryDialog}
          />
        </Stack>
        <FormControl fullWidth>
          <InputLabel id='purpose-label'>Purpose of Payment</InputLabel>
          <Select
            labelId='purpose-label'
            id='purpose-of-payment'
            value={transactionRequestData.purpose_of_payment}
            label='Purpose of Payment'
            onChange={(event) => {
              setTransactionRequestData({
                ...transactionRequestData,
                purpose_of_payment: event.target.value,
              });
              onCreateOrUpdateTransaction({});
            }}
            disabled={isLoadingPurposes}
          >
            {allPurposes.map((key) => {
              return (
                <MenuItem key={key.id} value={key.id}>
                  {key.text}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
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
    </>
  );
};

export default TransactionSettlementControl;
