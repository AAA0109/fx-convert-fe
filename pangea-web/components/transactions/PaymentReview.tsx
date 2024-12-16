import { PangeaAlert, PangeaPaymentSummary } from '@hedgedesk/common-frontend';
import { Block, WarningAmberOutlined } from '@mui/icons-material';
import { Box, BoxProps, SelectChangeEvent, Stack } from '@mui/material';
import styled from '@mui/system/styled';
import {
  buyCurrencyState,
  clientApiState,
  paymentExecutionTimingtData,
  paymentLiquidityData,
  paymentRfqState,
  paymentspotRateDataState,
  sellCurrencyState,
  transactionPaymentState,
  transactionRequestDataState,
  valueDateTypeState,
} from 'atoms';
import {
  ScheduledExecutionTimeline,
  SummaryDataPoint,
} from 'components/shared';
import ImmediateExecutionTimeline from 'components/shared/ImmediateExecutionTimeline';
import { format } from 'date-fns';
import { useWalletAndPaymentHelpers } from 'hooks';
import {
  PangeaBeneficiary,
  PangeaBlankEnum,
  PangeaDateTypeEnum,
  PangeaExecutionTimingEnum,
  PangeaFwdBrokerEnum,
  PangeaInstallmentCashflow,
  PangeaSingleCashflow,
  PangeaWallet,
  TransactionRequestData,
  formatCurrency,
  getRfqTotalCost,
  getRfqTotalDeliveryFee,
  getRfqTotalTransactionAmount,
} from 'lib';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { PangeaColors } from 'styles';
import PaymentGridReview from './PaymentGridReview';
import ErrorOutline from '@mui/icons-material/ErrorOutline';

type BeneficiarySummary = {
  id: string;
  name: string;
};

interface PaymentReviewProps {
  onCreateOrUpdateTransaction: (data: any) => void;
}

const StyledBox = styled(Box)<BoxProps>(() => ({
  borderRadius: '.5rem',
  backgroundColor: '#fafafa',
  border: `1px solid ${PangeaColors.Gray}`,
  padding: '1rem .75rem',
  display: 'flex',
  flexDirection: 'column',
  rowGap: '8px',
}));

const DEFAULT_ROUNDING = 0;
const DEFAULT_SAME_CCY_FEE = 20;

export const PaymentReview = ({
  onCreateOrUpdateTransaction,
}: PaymentReviewProps): JSX.Element => {
  const executionTiming = useRecoilValue(paymentExecutionTimingtData);
  const payment = useRecoilValue(transactionPaymentState);
  const paymentRfq = useRecoilValue(paymentRfqState);
  const [transactionRequestData, setTransactionRequestData] = useRecoilState(
    transactionRequestDataState,
  );
  const transactionPayment = useRecoilValue(transactionPaymentState);
  const api = useRecoilValue(clientApiState);
  const apiHelper = api.getAuthenticatedApiHelper();
  const spotRateData = useRecoilValue(paymentspotRateDataState);
  const resetPaymentRfq = useResetRecoilState(paymentRfqState);
  const buyCurrencyDetails = useRecoilValue(buyCurrencyState);
  const sellCurrencyDetails = useRecoilValue(sellCurrencyState);
  const valueDateType = useRecoilValue(valueDateTypeState);
  const liquidityData = useRecoilValue(paymentLiquidityData);

  const {
    beneficiaryAccounts,
    allWallets,
    isWalletAccount,
    getDestinationAccountMethod,
  } = useWalletAndPaymentHelpers();
  const beneficiaryOptions = [
    ...(beneficiaryAccounts
      .filter(
        (account) =>
          account.destination_currency ===
            transactionRequestData.payment_currency &&
          spotRateData?.executing_broker != null &&
          account.brokers
            .map(({ broker_provider }) => broker_provider)
            .includes(
              spotRateData.executing_broker.broker_provider as
                | PangeaFwdBrokerEnum
                | PangeaBlankEnum,
            ),
      )
      .map(
        ({
          beneficiary_id,
          beneficiary_name,
          destination_currency,
          bank_name,
        }) => ({
          id: beneficiary_id,
          name: `${beneficiary_name} - ${destination_currency} - ${bank_name}`,
        }),
      ) as BeneficiarySummary[]),
    ...(allWallets
      .filter(
        ({ currency, broker }) =>
          currency === transactionRequestData.payment_currency &&
          broker.broker_provider ===
            spotRateData?.executing_broker?.broker_provider,
      )
      .map(({ wallet_id, name }) => ({
        id: wallet_id,
        name,
      })) as BeneficiarySummary[]),
  ];
  const numerator =
    spotRateData?.market && spotRateData.market.length >= 6
      ? spotRateData?.market.substring(0, 3)
      : '';
  const denominator =
    spotRateData?.market && spotRateData.market.length >= 6
      ? spotRateData?.market.substring(3)
      : '';
  const isSameCurrency =
    transactionRequestData.settlement_currency ===
    transactionRequestData.payment_currency;
  const rateRounding = spotRateData?.rate_rounding ?? DEFAULT_ROUNDING;

  const isBuyLocked =
    transactionRequestData.lock_side === buyCurrencyDetails?.currency;
  const isSellLocked =
    transactionRequestData.lock_side === sellCurrencyDetails?.currency;
  const isNdf =
    spotRateData?.is_ndf && valueDateType === PangeaDateTypeEnum.FORWARD;
  const isImmediate =
    executionTiming?.value &&
    [
      PangeaExecutionTimingEnum.ImmediateForward,
      PangeaExecutionTimingEnum.ImmediateSpot,
      PangeaExecutionTimingEnum.ImmediateNdf,
    ].includes(executionTiming.value as PangeaExecutionTimingEnum);
  const isScheduledOrStrategic =
    executionTiming?.value &&
    [
      PangeaExecutionTimingEnum.ScheduledSpot,
      PangeaExecutionTimingEnum.StrategicForward,
      PangeaExecutionTimingEnum.StrategicNdf,
      PangeaExecutionTimingEnum.StrategicSpot,
    ].includes(executionTiming.value as PangeaExecutionTimingEnum);
  const paymentSummaryBeneficiary = beneficiaryOptions.find(
    ({ id }) => id === transactionRequestData.paymentDetails?.beneficiary_id,
  )?.name;
  const handleBeneficiaryChange = (
    event: SelectChangeEvent<string | string[]>,
  ) => {
    const value = Array.isArray(event.target.value)
      ? event.target.value[0]
      : event.target.value;
    const selectedAccount: Optional<PangeaBeneficiary | PangeaWallet> =
      beneficiaryAccounts?.find(
        ({ beneficiary_name, destination_currency, bank_name }) =>
          `${beneficiary_name} - ${destination_currency} - ${bank_name}` ===
          value,
      ) ?? allWallets?.find((wallet) => wallet.name === value);

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
  };

  useEffect(() => {
    resetPaymentRfq();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!payment) {
    return <></>;
  }

  return (
    <>
      {/* Payment Summary */}
      {executionTiming?.value && (
        <PangeaPaymentSummary<BeneficiarySummary>
          type={executionTiming.value as PangeaExecutionTimingEnum}
          memo={payment.name}
          valueDate={
            transactionRequestData?.delivery_date
              ? format(
                  new Date(transactionRequestData.delivery_date),
                  'MM/dd/yyyy',
                )
              : 'N/A'
          }
          value={paymentSummaryBeneficiary}
          options={beneficiaryOptions}
          handleOptionChange={handleBeneficiaryChange}
          disabledOptions={[]}
        />
      )}

      {/* Start Pangea Alert */}
      {liquidityData?.liquidity_insight.liquidity === 'poor' && (
        <PangeaAlert
          title='Poor Liquidity'
          description='Our AI indicates markets are illiquid and spreads are significantly wider, increasing market costs. We recommend using strategic execution.'
          sxLayoutProps={{
            backgroundColor: '#D32F2F1F',
            borderColor: '#DC4B63',
          }}
          icon={
            <ErrorOutline
              sx={{
                color: PangeaColors.RiskBerryMedium,
              }}
            />
          }
          descriptionColor='#000000DE'
          titleColor='#000000DE'
        />
      )}

      {liquidityData?.liquidity_insight.liquidity === 'closed' && (
        <PangeaAlert
          title='Market is Closed'
          description='This market is closed due to a holiday or weekend. Our AI will execute this trade at the best liquid period after market open.'
          sxLayoutProps={{
            backgroundColor: '#D32F2F1F',
            borderColor: '#DC4B63',
          }}
          icon={
            <Block
              sx={{
                color: PangeaColors.RiskBerryMedium,
              }}
            />
          }
          descriptionColor='#000000DE'
          titleColor='#000000DE'
        />
      )}

      {isNdf && (
        <PangeaAlert
          title='Electronic Trading Unavailable'
          description='This market is not presently tradable electronically. Please use the rate below for reference, and select “Request Trade Desk Quote” for the Trade Desk to begin the quote process.'
          sxLayoutProps={{
            backgroundColor: '#fbf9ed',
            borderColor: PangeaColors.CautionYellowMedium,
          }}
          icon={
            <WarningAmberOutlined
              sx={{
                color: PangeaColors.CautionYellowMedium,
              }}
            />
          }
          descriptionColor='#000000DE'
          titleColor='#000000DE'
        />
      )}

      {/* TODO: Enable alert options when BE has reliable flags */}
      {/* <PangeaAlert
        title='Liquidity & Market Data Unavailable'
        description='We currently do not have any liquidity & market data available for this transaction. We recommend moving forward with caution.'
        sxLayoutProps={{
          backgroundColor: '#fbf9ed',
          borderColor: PangeaColors.CautionYellowMedium,
        }}
        icon={
          <WarningAmberOutlined
            sx={{
              color: PangeaColors.CautionYellowMedium,
            }}
          />
        }
        descriptionColor='#000000DE'
        titleColor='#000000DE'
      /> */}

      {/* End Pangea Alert */}

      {/* Start review component for One-time payments */}
      {transactionRequestData.frequency === 'onetime' &&
        (isImmediate ? (
          <ImmediateExecutionTimeline
            numerator={numerator}
            denominator={denominator}
            rateRounding={rateRounding}
            key='immediate-timeline'
          />
        ) : isScheduledOrStrategic ? (
          <ScheduledExecutionTimeline
            numerator={numerator}
            denominator={denominator}
            rateRounding={rateRounding}
            key='scheduled-se-timeline'
          />
        ) : null)}
      {/* End review component for One-time payments */}

      {/* Start review component for Strip payments */}
      {transactionRequestData.frequency !== 'onetime' && (
        <PaymentGridReview
          rows={transactionRequestData.cashflows ?? []}
          rfqResults={paymentRfq}
          spotInfo={spotRateData}
          sellCurrencyDetails={sellCurrencyDetails}
          buyCurrencyDetails={buyCurrencyDetails}
          onCashflowEdited={async (cashflow) => {
            if (transactionPayment && cashflow) {
              const resp = await apiHelper.updatePaymentCashflowByIdAsync(
                cashflow.cashflow_id,
                transactionPayment?.id,
                {
                  ...cashflow,
                } as PangeaInstallmentCashflow,
              );

              if (resp && 'cashflow_id' in resp) {
                let cashflows = [...(transactionRequestData.cashflows ?? [])];
                cashflows = cashflows.map((item) => {
                  if (item.cashflow_id === cashflow.cashflow_id) {
                    return {
                      ...item,
                      pay_date: resp.pay_date,
                      amount: resp.amount,
                      cntr_amount: resp.cntr_amount,
                      lock_side: resp.lock_side,
                      transaction_date: resp.transaction_date,
                    } as PangeaSingleCashflow;
                  }
                  return item;
                });
                let installments =
                  transactionRequestData.frequency === 'installments'
                    ? [...(transactionRequestData.installments ?? [])]
                    : [];

                installments = installments.map((item) => {
                  if (item.cashflow_id === cashflow.cashflow_id) {
                    return {
                      ...item,
                      date: resp.pay_date.split('T')[0],
                      amount: resp.amount,
                      cntr_amount: resp.cntr_amount,
                      lock_side: resp.lock_side,
                    };
                  }
                  return item;
                });
                setTransactionRequestData({
                  ...transactionRequestData,
                  cashflows: cashflows,
                  installments: installments,
                });
              }
            }
          }}
        />
      )}
      {/* End review component for Strip payments */}

      {isImmediate && !isNdf ? (
        <StyledBox
          mt={4}
          sx={{
            borderRadius: '.5rem',
            backgroundColor: '#fafafa',
            border: `1px solid ${PangeaColors.Gray}`,
            padding: '1rem .75rem',
          }}
        >
          <Stack>
            <SummaryDataPoint
              label='Amount'
              value={
                paymentRfq?.success[0].transaction_amount && !isSameCurrency
                  ? `${formatCurrency(
                      transactionRequestData.frequency === 'recurring' &&
                        transactionRequestData?.cashflows
                        ? getRfqTotalTransactionAmount(paymentRfq.success) *
                            transactionRequestData.cashflows.length
                        : getRfqTotalTransactionAmount(paymentRfq.success),
                      payment?.buy_currency,
                      false,
                      buyCurrencyDetails?.unit ?? DEFAULT_ROUNDING,
                      buyCurrencyDetails?.unit ?? DEFAULT_ROUNDING,
                      false,
                      'decimal',
                    )} ${payment?.buy_currency}`
                  : `${formatCurrency(
                      transactionRequestData.frequency === 'recurring' &&
                        transactionRequestData?.cashflows
                        ? transactionRequestData.payment_amount *
                            transactionRequestData.cashflows.length
                        : transactionRequestData.payment_amount,
                      transactionRequestData.payment_currency,
                      false,
                      buyCurrencyDetails?.unit ?? DEFAULT_ROUNDING,
                      buyCurrencyDetails?.unit ?? DEFAULT_ROUNDING,
                      false,
                      'decimal',
                    )} ${transactionRequestData.payment_currency}`
              }
            />
            <SummaryDataPoint
              toolTip='Delivery fees vary by transaction size and method. Contact Client Services or refer to your client services agreement for details.'
              label='DELIVERY FEE'
              value={`${
                paymentRfq?.success[0].delivery_fee
                  ? `${formatCurrency(
                      getRfqTotalDeliveryFee(paymentRfq.success),
                      'USD',
                    )} USD`
                  : payment?.sell_currency === payment?.buy_currency
                  ? `${formatCurrency(DEFAULT_SAME_CCY_FEE, 'USD')} USD`
                  : 'WAIVED'
              }`}
            />
            <SummaryDataPoint
              label='Total Cost'
              value={
                paymentRfq?.success[0].total_cost && !isSameCurrency
                  ? `${formatCurrency(
                      getRfqTotalCost(paymentRfq.success),
                      transactionRequestData.settlement_currency,
                      false,
                      buyCurrencyDetails?.unit ?? DEFAULT_ROUNDING,
                      buyCurrencyDetails?.unit ?? DEFAULT_ROUNDING,
                      false,
                      'decimal',
                    )} ${transactionRequestData.settlement_currency}`
                  : `${formatCurrency(
                      transactionRequestData.frequency === 'recurring' &&
                        transactionRequestData?.cashflows
                        ? transactionRequestData.settlement_amount *
                            transactionRequestData.cashflows.length
                        : transactionRequestData.settlement_amount,
                      transactionRequestData.settlement_currency,
                      false,
                      buyCurrencyDetails?.unit ?? DEFAULT_ROUNDING,
                      buyCurrencyDetails?.unit ?? DEFAULT_ROUNDING,
                      false,
                      'decimal',
                    )} ${transactionRequestData.settlement_currency}`
              }
            />
          </Stack>
        </StyledBox>
      ) : null}

      {isImmediate && isNdf ? (
        <StyledBox
          mt={4}
          sx={{
            borderRadius: '.5rem',
            backgroundColor: '#fafafa',
            border: `1px solid ${PangeaColors.Gray}`,
            padding: '1rem .75rem',
          }}
        >
          <Stack>
            <SummaryDataPoint
              label='Amount'
              value={
                isBuyLocked
                  ? `${formatCurrency(
                      transactionRequestData.frequency === 'recurring' &&
                        transactionRequestData?.cashflows
                        ? transactionRequestData.payment_amount *
                            transactionRequestData.cashflows.length
                        : transactionRequestData.payment_amount,
                      transactionRequestData.payment_currency,
                      false,
                      buyCurrencyDetails?.unit ?? DEFAULT_ROUNDING,
                      buyCurrencyDetails?.unit ?? DEFAULT_ROUNDING,
                      false,
                      'decimal',
                    )} ${transactionRequestData.payment_currency}`
                  : `Pending Trade Desk Quote`
              }
            />
            <SummaryDataPoint
              toolTip='Delivery fees vary by transaction size and method. Contact Client Services or refer to your client services agreement for details.'
              label='DELIVERY FEE'
              value={`${
                paymentRfq?.success[0].delivery_fee
                  ? `${formatCurrency(
                      getRfqTotalDeliveryFee(paymentRfq.success),
                      'USD',
                    )} USD`
                  : payment?.sell_currency === payment?.buy_currency
                  ? `${formatCurrency(DEFAULT_SAME_CCY_FEE, 'USD')} USD`
                  : 'WAIVED'
              }`}
            />
            <SummaryDataPoint
              label='Total Cost'
              value={
                isSellLocked
                  ? `${formatCurrency(
                      transactionRequestData.frequency === 'recurring' &&
                        transactionRequestData?.cashflows
                        ? transactionRequestData.settlement_amount *
                            transactionRequestData.cashflows.length
                        : transactionRequestData.settlement_amount,
                      transactionRequestData.settlement_currency,
                      false,
                      buyCurrencyDetails?.unit ?? DEFAULT_ROUNDING,
                      buyCurrencyDetails?.unit ?? DEFAULT_ROUNDING,
                      false,
                      'decimal',
                    )} ${transactionRequestData.settlement_currency}`
                  : 'Pending Trade Desk Quote'
              }
            />
          </Stack>
        </StyledBox>
      ) : null}

      {isScheduledOrStrategic ? (
        <StyledBox
          mt={4}
          sx={{
            borderRadius: '.5rem',
            backgroundColor: '#fafafa',
            border: `1px solid ${PangeaColors.Gray}`,
            padding: '1rem .75rem',
          }}
        >
          <Stack>
            <SummaryDataPoint
              label='Amount'
              value={
                isBuyLocked
                  ? `${formatCurrency(
                      transactionRequestData.frequency === 'recurring' &&
                        transactionRequestData?.cashflows
                        ? transactionRequestData.payment_amount *
                            transactionRequestData.cashflows.length
                        : transactionRequestData.payment_amount,
                      transactionRequestData.payment_currency,
                      false,
                      buyCurrencyDetails?.unit ?? DEFAULT_ROUNDING,
                      buyCurrencyDetails?.unit ?? DEFAULT_ROUNDING,
                      false,
                      'decimal',
                    )} ${transactionRequestData.payment_currency}`
                  : 'Pending Strategic Execution'
              }
            />
            <SummaryDataPoint
              toolTip='Delivery fees vary by transaction size and method. Contact Client Services or refer to your client services agreement for details.'
              label='DELIVERY FEE'
              value={`${
                paymentRfq?.success[0].delivery_fee
                  ? `${formatCurrency(
                      getRfqTotalDeliveryFee(paymentRfq.success),
                      'USD',
                    )} USD`
                  : payment?.sell_currency === payment?.buy_currency
                  ? `${formatCurrency(DEFAULT_SAME_CCY_FEE, 'USD')} USD`
                  : 'WAIVED'
              }`}
            />
            <SummaryDataPoint
              label='Total Cost'
              value={
                isSellLocked
                  ? `${formatCurrency(
                      transactionRequestData.frequency === 'recurring' &&
                        transactionRequestData?.cashflows
                        ? transactionRequestData.settlement_amount *
                            transactionRequestData.cashflows.length
                        : transactionRequestData.settlement_amount,
                      transactionRequestData.settlement_currency,
                      false,
                      buyCurrencyDetails?.unit ?? DEFAULT_ROUNDING,
                      buyCurrencyDetails?.unit ?? DEFAULT_ROUNDING,
                      false,
                      'decimal',
                    )} ${transactionRequestData.settlement_currency}`
                  : 'Pending Strategic Execution'
              }
            />
          </Stack>
        </StyledBox>
      ) : null}
    </>
  );
};
export default PaymentReview;
