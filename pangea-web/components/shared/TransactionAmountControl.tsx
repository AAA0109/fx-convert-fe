import { InfoOutlined } from '@mui/icons-material';
import LockIcon from '@mui/icons-material/Lock';
import { IconButton, Skeleton, Stack, Typography } from '@mui/material';
import {
  beneficiaryValidationSchemaRequestDataState,
  buyCurrencyState,
  fxFetchingSpotRateState,
  paymentBuyCurrencyState,
  paymentSellCurrencyState,
  paymentspotRateDataState,
  sellCurrencyState,
  valueDateTypeState,
} from 'atoms';
import { useWalletAndPaymentHelpers } from 'hooks';
import {
  CreateOrUpdatePaymentArguments,
  PangeaDateTypeEnum,
  PangeaPaymentInstallment,
  TransactionRequestData,
} from 'lib';
import { debounce } from 'lodash';
import { Fragment, Suspense, useCallback } from 'react';
import { SetterOrUpdater, useRecoilValue, useSetRecoilState } from 'recoil';
import { PangeaColors } from 'styles';
import CurrencySelect from './CurrencySelect';
import ForeignCurrencyInput2 from './ForeignCurrencyInput2';
import PangeaLoading from './PangeaLoading';
import PangeaTooltip from './PangeaTooltip';
import PaymentRateDisplay from './PaymentRateDisplay';

type InstallmentDataProps = {
  cashflows: PangeaPaymentInstallment[];
  setCashflows: React.Dispatch<
    React.SetStateAction<PangeaPaymentInstallment[]>
  >;
  isEditMode: boolean;
  nExistingInstallments: number;
  currentIndex: number;
};

type TransactionAmountControlProps = {
  onCreateOrUpdateTransaction: (
    options: CreateOrUpdatePaymentArguments,
  ) => Promise<void>;
  isLoadingCurrency: boolean;
  transactionRequestData: TransactionRequestData;
  setTransactionRequestData: SetterOrUpdater<TransactionRequestData>;
  installmentProps?: Nullable<InstallmentDataProps>;
};

export const TransactionAmountControl = ({
  onCreateOrUpdateTransaction,
  isLoadingCurrency,
  transactionRequestData,
  setTransactionRequestData,
  installmentProps = null,
}: TransactionAmountControlProps): JSX.Element => {
  const setValidationSchemaRequest = useSetRecoilState(
    beneficiaryValidationSchemaRequestDataState,
  );
  const setValueDateType = useSetRecoilState(valueDateTypeState);
  const fetchingSpotRate = useRecoilValue(fxFetchingSpotRateState);
  const spotRateData = useRecoilValue(paymentspotRateDataState);
  const setPaymentBuyCurrency = useSetRecoilState(paymentBuyCurrencyState);
  const setPaymentSellCurrency = useSetRecoilState(paymentSellCurrencyState);
  const sellCurrencyDetails = useRecoilValue(sellCurrencyState);
  const buyCurrencyDetails = useRecoilValue(buyCurrencyState);

  const {
    handleCurrencyChange,
    isSpotRateExpired,
    getPaymentsV2SpotRate,
    paymentSpotRateRequestPayload,
    isLoadingSettlementWallets,
    isLoadingPurposes,
    amountsErrorState,
  } = useWalletAndPaymentHelpers();

  const isOneOfCurrencyEmpty = useCallback((): boolean => {
    return (
      (installmentProps === null &&
        (!transactionRequestData.settlement_currency ||
          !transactionRequestData.payment_currency)) ||
      (installmentProps !== null &&
        (!installmentProps.cashflows[installmentProps.currentIndex]
          .sell_currency ||
          !installmentProps.cashflows[installmentProps.currentIndex]
            .buy_currency))
    );
  }, [
    installmentProps,
    transactionRequestData.payment_currency,
    transactionRequestData.settlement_currency,
  ]);

  const handleAmountChangeOnEmptyCurrency = useCallback(
    (value: number) => {
      if (installmentProps === null) {
        setTransactionRequestData({
          ...transactionRequestData,
          lock_side: transactionRequestData.payment_currency,
          payment_amount: value,
          settlement_amount: value,
        });
      } else {
        installmentProps.setCashflows((currentCashflows) => {
          const modifiedCashflows = [...currentCashflows];
          const cashflowToModify =
            modifiedCashflows[installmentProps.currentIndex];
          cashflowToModify.amount = value;
          cashflowToModify.cntr_amount = value;
          cashflowToModify.lock_side = cashflowToModify.sell_currency;
          return modifiedCashflows;
        });
      }
    },
    [installmentProps, setTransactionRequestData, transactionRequestData],
  );

  const handlePaymentAmountChange = debounce(
    useCallback(
      (value: number) => {
        if (isOneOfCurrencyEmpty()) {
          handleAmountChangeOnEmptyCurrency(value);
          return;
        }
        if (isSpotRateExpired && !fetchingSpotRate) {
          getPaymentsV2SpotRate({
            ...paymentSpotRateRequestPayload,
            buy_currency: transactionRequestData.payment_currency,
            sell_currency: transactionRequestData.settlement_currency,
          });
        }
        const source = spotRateData?.market.substring(0, 3);
        if (spotRateData) {
          if (installmentProps === null) {
            setTransactionRequestData({
              ...transactionRequestData,
              lock_side: transactionRequestData.payment_currency,
              payment_amount: parseFloat(
                value.toFixed(buyCurrencyDetails?.unit ?? 2),
              ),
              settlement_amount:
                transactionRequestData.payment_currency === source
                  ? parseFloat(
                      (spotRateData?.rate * Number(value)).toFixed(
                        sellCurrencyDetails?.unit ?? 2,
                      ),
                    )
                  : parseFloat(
                      (Number(value) / spotRateData?.rate).toFixed(
                        sellCurrencyDetails?.unit ?? 2,
                      ),
                    ),
            });
          } else {
            installmentProps.setCashflows((currentCashflows) => {
              const modifiedCashflows = [...currentCashflows];
              const cashflowToModify =
                modifiedCashflows[installmentProps.currentIndex];
              cashflowToModify.cntr_amount = value;
              cashflowToModify.lock_side = cashflowToModify.buy_currency;
              cashflowToModify.amount =
                cashflowToModify.buy_currency == source
                  ? parseFloat(
                      (spotRateData.rate * Number(value)).toFixed(
                        sellCurrencyDetails?.unit ?? 2,
                      ),
                    )
                  : parseFloat(
                      (Number(value) / spotRateData.rate).toFixed(
                        sellCurrencyDetails?.unit ?? 2,
                      ),
                    );
              return modifiedCashflows;
            });
          }
        } else if (
          installmentProps !== null &&
          installmentProps.cashflows[installmentProps.currentIndex]
            .sell_currency ===
            installmentProps.cashflows[installmentProps.currentIndex]
              .buy_currency
        ) {
          installmentProps.setCashflows((currentCashflows) => {
            const modifiedCashflows = [...currentCashflows];
            const cashflowToModify =
              modifiedCashflows[installmentProps.currentIndex];
            cashflowToModify.amount = parseFloat(
              value.toFixed(sellCurrencyDetails?.unit ?? 2),
            );
            cashflowToModify.cntr_amount = parseFloat(
              value.toFixed(buyCurrencyDetails?.unit ?? 2),
            );
            return modifiedCashflows;
          });
        } else if (
          installmentProps === null &&
          transactionRequestData.settlement_currency ===
            transactionRequestData.payment_currency
        ) {
          setTransactionRequestData({
            ...transactionRequestData,
            lock_side: transactionRequestData.payment_currency,
            payment_amount: parseFloat(
              value.toFixed(buyCurrencyDetails?.unit ?? 2),
            ),
            settlement_amount: parseFloat(
              value.toFixed(sellCurrencyDetails?.unit ?? 2),
            ),
          });
        }
        if (installmentProps === null) {
          onCreateOrUpdateTransaction({});
        }
      },
      [
        isOneOfCurrencyEmpty,
        isSpotRateExpired,
        fetchingSpotRate,
        spotRateData,
        installmentProps,
        transactionRequestData,
        handleAmountChangeOnEmptyCurrency,
        getPaymentsV2SpotRate,
        paymentSpotRateRequestPayload,
        setTransactionRequestData,
        buyCurrencyDetails?.unit,
        sellCurrencyDetails?.unit,
        onCreateOrUpdateTransaction,
      ],
    ),
    600,
  );
  const handleSettlementAmountChange = debounce(
    useCallback(
      (value: number) => {
        if (isOneOfCurrencyEmpty()) {
          handleAmountChangeOnEmptyCurrency(value);
          return;
        }
        if (isSpotRateExpired && !fetchingSpotRate) {
          getPaymentsV2SpotRate({
            ...paymentSpotRateRequestPayload,
            buy_currency: transactionRequestData.payment_currency,
            sell_currency: transactionRequestData.settlement_currency,
          });
        }
        if (spotRateData) {
          const source = spotRateData?.market.substring(0, 3);
          if (installmentProps === null) {
            setTransactionRequestData({
              ...transactionRequestData,
              lock_side: transactionRequestData.settlement_currency,
              settlement_amount: parseFloat(
                value.toFixed(sellCurrencyDetails?.unit ?? 2),
              ),
              payment_amount:
                transactionRequestData.settlement_currency === source
                  ? parseFloat(
                      (spotRateData.rate * Number(value)).toFixed(
                        buyCurrencyDetails?.unit ?? 2,
                      ),
                    )
                  : parseFloat(
                      (Number(value) / spotRateData.rate).toFixed(
                        buyCurrencyDetails?.unit ?? 2,
                      ),
                    ),
            });
          } else {
            installmentProps.setCashflows((currentCashflows) => {
              const modifiedCashflows = [...currentCashflows];
              const cashflowToModify =
                modifiedCashflows[installmentProps.currentIndex];
              cashflowToModify.amount = value;
              cashflowToModify.lock_side = cashflowToModify.sell_currency;
              cashflowToModify.cntr_amount =
                cashflowToModify.sell_currency == source
                  ? parseFloat(
                      (spotRateData.rate * Number(value)).toFixed(
                        buyCurrencyDetails?.unit ?? 2,
                      ),
                    )
                  : parseFloat(
                      (Number(value) / spotRateData.rate).toFixed(
                        buyCurrencyDetails?.unit ?? 2,
                      ),
                    );
              return modifiedCashflows;
            });
          }
        } else if (
          installmentProps !== null &&
          installmentProps.cashflows[installmentProps.currentIndex]
            .sell_currency ===
            installmentProps.cashflows[installmentProps.currentIndex]
              .buy_currency
        ) {
          installmentProps.setCashflows((currentCashflows) => {
            const modifiedCashflows = [...currentCashflows];
            const cashflowToModify =
              modifiedCashflows[installmentProps.currentIndex];
            cashflowToModify.amount = parseFloat(
              value.toFixed(sellCurrencyDetails?.unit ?? 2),
            );
            cashflowToModify.cntr_amount = parseFloat(
              value.toFixed(buyCurrencyDetails?.unit ?? 2),
            );
            return modifiedCashflows;
          });
        } else if (
          installmentProps === null &&
          transactionRequestData.settlement_currency ===
            transactionRequestData.payment_currency
        ) {
          setTransactionRequestData({
            ...transactionRequestData,
            lock_side: transactionRequestData.settlement_currency,
            settlement_amount: parseFloat(
              value.toFixed(sellCurrencyDetails?.unit ?? 2),
            ),
            payment_amount: parseFloat(
              value.toFixed(buyCurrencyDetails?.unit ?? 2),
            ),
          });
        }
        if (installmentProps === null) {
          onCreateOrUpdateTransaction({});
        }
      },
      [
        isOneOfCurrencyEmpty,
        isSpotRateExpired,
        fetchingSpotRate,
        spotRateData,
        installmentProps,
        transactionRequestData,
        handleAmountChangeOnEmptyCurrency,
        getPaymentsV2SpotRate,
        paymentSpotRateRequestPayload,
        setTransactionRequestData,
        sellCurrencyDetails?.unit,
        buyCurrencyDetails?.unit,
        onCreateOrUpdateTransaction,
      ],
    ),
    600,
  );

  const isCurrencySelectDisabled = (): boolean => {
    return installmentProps != null
      ? installmentProps.isEditMode ||
          installmentProps.cashflows.length > 1 ||
          installmentProps.nExistingInstallments > 0
      : false;
  };

  const getCustomLabel = (isSell = true): string => {
    if (isSell) {
      if (installmentProps === null) {
        return transactionRequestData.lock_side ===
          transactionRequestData.settlement_currency
          ? 'Selling Exactly.'
          : 'Selling Approx.';
      }
      return installmentProps.cashflows[installmentProps.currentIndex]
        .lock_side ===
        installmentProps.cashflows[installmentProps.currentIndex].sell_currency
        ? 'Selling Exactly.'
        : 'Selling Approx.';
    }

    if (installmentProps === null) {
      return transactionRequestData.lock_side ===
        transactionRequestData.payment_currency
        ? 'Buying Exactly.'
        : 'Buying Approx.';
    }

    return installmentProps.cashflows[installmentProps.currentIndex]
      .lock_side ===
      installmentProps.cashflows[installmentProps.currentIndex].buy_currency
      ? 'Buying Exactly.'
      : 'Buying Approx.';
  };

  const isSellLockSide = (): boolean => {
    if (installmentProps !== null) {
      if (
        !installmentProps.cashflows[installmentProps.currentIndex].buy_currency
      ) {
        return false;
      }
      return (
        installmentProps.cashflows[installmentProps.currentIndex].lock_side ===
          installmentProps.cashflows[installmentProps.currentIndex]
            .sell_currency &&
        installmentProps.cashflows[installmentProps.currentIndex]
          .buy_currency !==
          installmentProps.cashflows[installmentProps.currentIndex]
            .sell_currency
      );
    }
    return (
      transactionRequestData.lock_side ===
        transactionRequestData.settlement_currency &&
      transactionRequestData.payment_currency !==
        transactionRequestData.settlement_currency
    );
  };

  const isBuyLockSide = (): boolean => {
    if (installmentProps !== null) {
      if (
        !installmentProps.cashflows[installmentProps.currentIndex].buy_currency
      ) {
        return false;
      }
      return (
        installmentProps.cashflows[installmentProps.currentIndex].lock_side ===
          installmentProps.cashflows[installmentProps.currentIndex]
            .buy_currency &&
        installmentProps.cashflows[installmentProps.currentIndex]
          .buy_currency !==
          installmentProps.cashflows[installmentProps.currentIndex]
            .sell_currency
      );
    }
    return (
      transactionRequestData.lock_side ===
        transactionRequestData.payment_currency &&
      transactionRequestData.payment_currency !==
        transactionRequestData.settlement_currency
    );
  };

  const getCurrencyInputRounding = (isSell = true): number | undefined => {
    if (isSell) {
      if (installmentProps !== null) {
        return installmentProps.cashflows[installmentProps.currentIndex]
          .sell_currency
          ? sellCurrencyDetails?.unit
          : buyCurrencyDetails?.unit;
      }
      return transactionRequestData.settlement_currency
        ? sellCurrencyDetails?.unit
        : buyCurrencyDetails?.unit;
    }

    if (installmentProps !== null) {
      return installmentProps.cashflows[installmentProps.currentIndex]
        .buy_currency
        ? buyCurrencyDetails?.unit
        : sellCurrencyDetails?.unit;
    }

    return transactionRequestData.payment_currency
      ? buyCurrencyDetails?.unit
      : sellCurrencyDetails?.unit;
  };

  return (
    <Stack>
      <Typography
        variant='body2'
        pb={1}
        color={PangeaColors.BlackSemiTransparent87}
      >
        Amount
      </Typography>
      <Stack direction='row'>
        <Stack spacing={1} sx={{ width: '75%' }}>
          <Stack direction='row' spacing={1}>
            <Suspense
              fallback={
                <Skeleton
                  variant='rectangular'
                  width={120}
                  height={57}
                  sx={{ marginLeft: '0!important' }}
                />
              }
            >
              <CurrencySelect
                value={
                  installmentProps === null
                    ? transactionRequestData.settlement_currency
                    : installmentProps.cashflows[installmentProps.currentIndex]
                        .sell_currency
                }
                type='sell'
                label={'Sell Currency'}
                isDisabled={isCurrencySelectDisabled()}
                testId='sellCurrencySelect'
                onChange={debounce((val) => {
                  handleCurrencyChange(val, 'sell_currency');
                  setValueDateType(PangeaDateTypeEnum.SPOT);
                  setPaymentSellCurrency(val);
                  if (installmentProps == null) {
                    setTransactionRequestData({
                      ...transactionRequestData,
                      settlement_currency: val,
                      payment_amount: 0,
                      settlement_amount: 0,
                      delivery_date: null,
                      settlementDetails: {
                        account_id: '',
                        delivery_method: null,
                      },
                      paymentDetails: {
                        beneficiary_id: '',
                        delivery_method: null,
                      },
                    });
                  } else {
                    installmentProps.setCashflows((currentCashflows) => {
                      const modifiedCashflows = [...currentCashflows];
                      const cashflowToModify =
                        modifiedCashflows[installmentProps.currentIndex];
                      cashflowToModify.sell_currency = val;
                      cashflowToModify.amount = 0;
                      cashflowToModify.cntr_amount = 0;
                      cashflowToModify.lock_side = val;
                      return modifiedCashflows;
                    });
                  }
                }, 600)}
              />
            </Suspense>
            <ForeignCurrencyInput2
              value={
                installmentProps === null
                  ? transactionRequestData.settlement_amount
                  : installmentProps.cashflows[installmentProps.currentIndex]
                      .amount
              }
              rounding={getCurrencyInputRounding()}
              onChange={handleSettlementAmountChange}
              direction={'paying'}
              foreignCurrency={null}
              customLabel={getCustomLabel()}
              testId='sellCurrencyAmountInput'
              disabled={
                fetchingSpotRate ||
                isLoadingSettlementWallets ||
                isLoadingPurposes
              }
              checkCurrencyProp={false}
            />
            <Stack flex={1} justifyContent={'center'}>
              {isSellLockSide() && (
                <PangeaTooltip
                  title={
                    <Fragment>
                      The lock ensures the specified amount is guaranteed. Enter
                      an amount in the sell currency to lock it, or in the buy
                      currency to lock that instead.
                    </Fragment>
                  }
                  placement='right'
                  arrow
                >
                  <IconButton
                    aria-label='lock settlement amount'
                    data-testid='lockSideSettlementButton'
                    sx={{
                      width: '36px',
                    }}
                  >
                    <LockIcon />
                  </IconButton>
                </PangeaTooltip>
              )}
            </Stack>
          </Stack>

          <Stack direction='row' spacing={1}>
            <Suspense
              fallback={
                <Skeleton
                  variant='rectangular'
                  width={120}
                  height={57}
                  sx={{ marginLeft: '0!important' }}
                />
              }
            >
              <CurrencySelect
                value={
                  installmentProps === null
                    ? transactionRequestData.payment_currency
                    : installmentProps.cashflows[installmentProps.currentIndex]
                        .buy_currency
                }
                type='buy'
                label='Buy Currency'
                testId='buyCurrencySelect'
                isDisabled={isCurrencySelectDisabled()}
                onChange={debounce((val) => {
                  handleCurrencyChange(val, 'buy_currency');
                  setPaymentBuyCurrency(val);
                  setValueDateType(PangeaDateTypeEnum.SPOT);
                  if (installmentProps === null) {
                    setTransactionRequestData({
                      ...transactionRequestData,
                      payment_currency: val,
                      payment_amount: 0,
                      settlement_amount: 0,
                      delivery_date: null,
                      paymentDetails: {
                        beneficiary_id: '',
                        delivery_method: null,
                      },
                    });
                  } else {
                    installmentProps.setCashflows((currentCashflows) => {
                      const modifiedCashflows = [...currentCashflows];
                      const cashflowToModify =
                        modifiedCashflows[installmentProps.currentIndex];
                      cashflowToModify.buy_currency = val;
                      cashflowToModify.amount = 0;
                      cashflowToModify.cntr_amount = 0;
                      cashflowToModify.lock_side = val;
                      return modifiedCashflows;
                    });
                  }
                  setValidationSchemaRequest((payload) => ({
                    ...payload,
                    bank_currency: val,
                  }));
                }, 600)}
              />
            </Suspense>
            <ForeignCurrencyInput2
              customLabel={getCustomLabel(false)}
              value={
                installmentProps === null
                  ? transactionRequestData.payment_amount
                  : installmentProps.cashflows[installmentProps.currentIndex]
                      .cntr_amount ?? 0
              }
              rounding={getCurrencyInputRounding(false)}
              onChange={handlePaymentAmountChange}
              direction={'paying'}
              foreignCurrency={null}
              isValidForm={
                !amountsErrorState.isAmountError &&
                amountsErrorState.isAmountError
              }
              customError={amountsErrorState.errorMessage}
              disabled={
                fetchingSpotRate ||
                isLoadingSettlementWallets ||
                isLoadingPurposes
              }
              showBlockError={true}
              checkCurrencyProp={false}
              testId='buyCurrencyAmountInput'
            />
            <Stack flex={1} justifyContent={'center'}>
              {isBuyLockSide() && (
                <PangeaTooltip
                  title={
                    <Fragment>
                      The lock ensures the specified amount is guaranteed. Enter
                      an amount in the sell currency to lock it, or in the buy
                      currency to lock that instead.
                    </Fragment>
                  }
                  placement='right'
                  arrow
                >
                  <IconButton
                    aria-label='lock settlement amount'
                    data-testid='lockSideSettlementButton'
                    sx={{
                      width: '36px',
                    }}
                  >
                    <LockIcon />
                  </IconButton>
                </PangeaTooltip>
              )}
            </Stack>
          </Stack>
        </Stack>

        <Stack sx={{ margin: '0 auto' }} justifyContent='center'>
          {fetchingSpotRate || isLoadingCurrency ? (
            <Stack>
              <PangeaLoading />
            </Stack>
          ) : (
            <Stack flexDirection='row' alignItems='center'>
              {spotRateData &&
                (installmentProps === null ||
                  (installmentProps !== null &&
                    installmentProps.cashflows[installmentProps.currentIndex]
                      .buy_currency)) && (
                  <>
                    <PaymentRateDisplay
                      sourceRounding={sellCurrencyDetails?.unit}
                      destinationRounding={buyCurrencyDetails?.unit}
                    />
                    <PangeaTooltip
                      arrow
                      placement='right'
                      title={
                        <Fragment>
                          Currency prices are current as of yesterday&apos;s
                          close.
                        </Fragment>
                      }
                    >
                      <InfoOutlined
                        sx={{
                          color: PangeaColors.BlackSemiTransparent38,
                        }}
                      />
                    </PangeaTooltip>
                  </>
                )}
            </Stack>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default TransactionAmountControl;
