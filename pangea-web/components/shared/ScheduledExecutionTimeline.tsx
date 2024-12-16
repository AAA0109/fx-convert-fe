import { ArrowDropDown, ArrowDropUp, HelpOutline } from '@mui/icons-material';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  timelineOppositeContentClasses,
  TimelineSeparator,
} from '@mui/lab';
import { Box, BoxProps, IconButton, Stack, Typography } from '@mui/material';
import styled from '@mui/system/styled';
import {
  buyCurrencyState,
  paymentRfqState,
  paymentspotRateDataState,
  sellCurrencyState,
  transactionPaymentState,
  transactionRequestDataState,
  valueDateTypeState,
} from 'atoms';
import { format, parseISO } from 'date-fns';
import { useWalletAndPaymentHelpers } from 'hooks';
import {
  formatCurrency,
  PangeaDateTypeEnum,
  PangeaWalletTypeEnum,
  setAlpha,
} from 'lib';
import { Fragment, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';
import PangeaTooltip from './PangeaTooltip';

interface ScheduledExecutionTimelineProps {
  numerator: string;
  denominator: string;
  rateRounding: number;
}

const DEFAULT_ROUNDING = 0;

const StyledBox = styled(Box)<BoxProps>(() => ({
  borderRadius: '.5rem',
  backgroundColor: '#fafafa',
  border: `1px solid ${PangeaColors.Gray}`,
  padding: '1rem .75rem',
  display: 'flex',
  flexDirection: 'column',
  rowGap: '8px',
}));
export const ScheduledExecutionTimeline = ({
  numerator,
  denominator,
  rateRounding,
}: ScheduledExecutionTimelineProps): JSX.Element => {
  const payment = useRecoilValue(transactionPaymentState);
  const paymentRfq = useRecoilValue(paymentRfqState);
  const spotRateData = useRecoilValue(paymentspotRateDataState);
  const transactionRequestData = useRecoilValue(transactionRequestDataState);
  const buyCurrencyDetails = useRecoilValue(buyCurrencyState);
  const sellCurrencyDetails = useRecoilValue(sellCurrencyState);
  const valueDateType = useRecoilValue(valueDateTypeState);
  const [showDropdown, setShowDropdown] = useState(false);
  const {
    settlementAccounts,
    beneficiaryAccounts,
    allWallets,
    isWalletAccount,
    isSpotRateExpired,
  } = useWalletAndPaymentHelpers();
  const isSameCurrency =
    transactionRequestData.settlement_currency ===
    transactionRequestData.payment_currency;
  const settlementSource =
    allWallets?.find(
      (wallet) => wallet.wallet_id === payment?.origin_account_id,
    ) ??
    settlementAccounts.find(
      (account) => account.wallet_id === payment?.origin_account_id,
    );
  const beneficiaryAccount =
    allWallets?.find(
      (wallet) => wallet.wallet_id === payment?.destination_account_id,
    ) ??
    beneficiaryAccounts?.find(
      (account) => account.beneficiary_id === payment?.destination_account_id,
    );
  const showForwardPoints =
    valueDateType === PangeaDateTypeEnum.FORWARD &&
    Boolean(spotRateData?.fwd_points);
  return (
    <StyledBox>
      <Timeline
        sx={{
          [`& .${timelineOppositeContentClasses.root}`]: {
            flex: 0.3,
            textAlign: 'left',
            paddingLeft: 0,
          },
        }}
      >
        <TimelineItem>
          <TimelineOppositeContent>
            <Typography variant='dataLabel'>
              {format(new Date(), 'dd MMM yyyy')}
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot
              sx={{
                backgroundColor: PangeaColors.WarmOrangeMedium,
                boxShadow: 'none',
              }}
            />
            <TimelineConnector sx={{ backgroundColor: PangeaColors.Gray }} />
          </TimelineSeparator>
          <TimelineContent>
            <Stack>
              <Typography variant='dataBody'>
                {settlementSource?.type === PangeaWalletTypeEnum.Wallet
                  ? settlementSource.currency +
                    ' Wallet (...' +
                    settlementSource.wallet_id.slice(-4) +
                    ') sends'
                  : settlementSource?.type === PangeaWalletTypeEnum.Settlement
                  ? settlementSource.currency +
                    ' Bank Account (...' +
                    settlementSource.wallet_id.slice(-4) +
                    ') sends'
                  : '-'}
              </Typography>
              <Typography
                variant='h5'
                sx={{
                  marginBottom: 2,
                  color:
                    isSpotRateExpired &&
                    transactionRequestData.lock_side ===
                      transactionRequestData.payment_currency
                      ? '#9b9b9b'
                      : 'black',
                }}
              >
                {!isSameCurrency
                  ? formatCurrency(
                      transactionRequestData.settlement_amount,
                      transactionRequestData.settlement_currency,
                      false,
                      sellCurrencyDetails?.unit ?? DEFAULT_ROUNDING,
                      sellCurrencyDetails?.unit ?? DEFAULT_ROUNDING,
                      false,
                      'decimal',
                    ) +
                    ' ' +
                    transactionRequestData.settlement_currency
                  : formatCurrency(
                      transactionRequestData.payment_amount,
                      transactionRequestData.payment_currency,
                      false,
                      buyCurrencyDetails?.unit ?? DEFAULT_ROUNDING,
                      buyCurrencyDetails?.unit ?? DEFAULT_ROUNDING,
                      false,
                      'decimal',
                    ) +
                    ' ' +
                    transactionRequestData.payment_currency}
              </Typography>
            </Stack>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent></TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot
              sx={{
                backgroundColor: PangeaColors.EarthBlueMedium,
                boxShadow: 'none',
              }}
            />
            <TimelineConnector sx={{ backgroundColor: PangeaColors.Gray }} />
          </TimelineSeparator>
          <TimelineContent>
            <Stack>
              <Stack flexDirection={'row'} alignItems={'center'}>
                <Typography
                  variant='body1'
                  sx={{
                    color: isSpotRateExpired ? '#9b9b9b' : 'black',
                  }}
                >
                  {`${formatCurrency(
                    1,
                    numerator,
                    false,
                    0,
                    0,
                    false,
                    'decimal',
                  )} ${numerator} = ${
                    isSameCurrency
                      ? `${formatCurrency(
                          1,
                          numerator,
                          false,
                          rateRounding,
                          rateRounding,
                          false,
                          'decimal',
                        )} ${numerator}`
                      : `${formatCurrency(
                          spotRateData?.spot_rate ?? 0,
                          denominator,
                          false,
                          rateRounding,
                          rateRounding,
                          false,
                          'decimal',
                        )} ${denominator}`
                  } *`}
                </Typography>
                {!isSameCurrency && (
                  <IconButton
                    onClick={() => {
                      setShowDropdown(!showDropdown);
                    }}
                  >
                    {showDropdown ? <ArrowDropUp /> : <ArrowDropDown />}
                  </IconButton>
                )}
              </Stack>
              <Typography
                variant='small'
                color={PangeaColors.BlackSemiTransparent50}
              >
                {paymentRfq?.success[0].indicative && 'this rate is indicative'}
              </Typography>
              {showDropdown && (
                <Box
                  sx={{
                    background: '#f5f5f5',
                    padding: '16px 24px',
                  }}
                >
                  <Stack
                    direction='row'
                    justifyContent='space-between'
                    paddingBottom={1}
                    sx={{
                      borderBottom: `1px solid ${PangeaColors.BlackSemiTransparent12}`,
                    }}
                  >
                    <Stack direction={'row'} alignItems={'center'} spacing={1}>
                      <Typography
                        variant='body2'
                        color={PangeaColors.BlackSemiTransparent87}
                      >
                        All-In Reference Rate
                      </Typography>
                      <PangeaTooltip
                        arrow
                        placement='right'
                        title={
                          <Fragment>
                            The All-In Rate combines combines spot rate and
                            broker spread to give a comprehensive rate for this
                            payment.
                          </Fragment>
                        }
                      >
                        <HelpOutline
                          sx={{
                            color: PangeaColors.BlackSemiTransparent60,
                          }}
                        />
                      </PangeaTooltip>
                    </Stack>
                    <Typography
                      variant='body2'
                      color={
                        isSpotRateExpired
                          ? '#9b9b9b'
                          : PangeaColors.BlackSemiTransparent87
                      }
                    >
                      {spotRateData?.rate
                        ? spotRateData.rate.toFixed(
                            spotRateData?.rate_rounding ?? 2,
                          )
                        : '-'}
                    </Typography>
                  </Stack>

                  {showForwardPoints && (
                    <Stack
                      paddingY={0.5}
                      direction='row'
                      justifyContent='space-between'
                    >
                      <Stack
                        direction={'row'}
                        alignItems={'center'}
                        spacing={1}
                      >
                        <Typography variant='body2'>Forward Points</Typography>
                        <PangeaTooltip
                          arrow
                          placement='right'
                          title={
                            <Fragment>
                              Forward interest rate points measure the interest
                              gap between two currencies. A positive value
                              indicates an interest rate environment that is
                              favorable for this payment.
                            </Fragment>
                          }
                        >
                          <HelpOutline
                            sx={{
                              color: PangeaColors.BlackSemiTransparent60,
                            }}
                          />
                        </PangeaTooltip>
                      </Stack>
                      <Typography
                        variant='body2'
                        color={
                          isSpotRateExpired
                            ? '#9b9b9b'
                            : PangeaColors.BlackSemiTransparent87
                        }
                      >
                        {spotRateData?.fwd_points
                          ? spotRateData.fwd_points_str
                          : '-'}
                      </Typography>
                    </Stack>
                  )}

                  <Stack
                    paddingY={0.5}
                    direction='row'
                    justifyContent='space-between'
                  >
                    <Stack direction={'row'} alignItems={'center'} spacing={1}>
                      <Typography variant='body2'>Broker Fee</Typography>
                      <PangeaTooltip
                        arrow
                        placement='right'
                        title={
                          <Fragment>
                            Pangea is committed to always be transparent about
                            the spread built into your all-in rate.
                          </Fragment>
                        }
                      >
                        <HelpOutline
                          sx={{
                            color: PangeaColors.BlackSemiTransparent60,
                          }}
                        />
                      </PangeaTooltip>
                    </Stack>
                    <Typography
                      variant='body2'
                      color={
                        isSpotRateExpired
                          ? '#9b9b9b'
                          : PangeaColors.BlackSemiTransparent87
                      }
                    >
                      {spotRateData?.broker_fee ?? '-'}
                    </Typography>
                  </Stack>

                  {Boolean(spotRateData?.fee) && (
                    <Stack
                      paddingY={0.5}
                      direction='row'
                      justifyContent='space-between'
                    >
                      <Stack
                        direction={'row'}
                        alignItems={'center'}
                        spacing={1}
                      >
                        <Typography variant='body2'>Pangea Fee</Typography>
                        <PangeaTooltip
                          arrow
                          placement='right'
                          title={
                            <Fragment>
                              Pangea is committed to always be transparent about
                              the spread built into your all-in rate.
                            </Fragment>
                          }
                        >
                          <HelpOutline
                            sx={{
                              color: PangeaColors.BlackSemiTransparent60,
                            }}
                          />
                        </PangeaTooltip>
                      </Stack>
                      <Typography
                        variant='body2'
                        color={
                          isSpotRateExpired
                            ? '#9b9b9b'
                            : PangeaColors.BlackSemiTransparent87
                        }
                      >
                        {spotRateData?.pangea_fee}
                      </Typography>
                    </Stack>
                  )}
                </Box>
              )}
            </Stack>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent>
            <Typography variant='dataLabel'>
              {format(parseISO(payment?.delivery_date ?? ''), 'dd MMM yyyy')}
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot
              sx={{
                backgroundColor: PangeaColors.SecurityGreenMedium,
                boxShadow: 'none',
              }}
            />
          </TimelineSeparator>
          <TimelineContent>
            <Stack>
              <Typography variant='dataBody'>
                {beneficiaryAccount
                  ? isWalletAccount(beneficiaryAccount)
                    ? beneficiaryAccount.currency +
                      ' Wallet (...' +
                      beneficiaryAccount.wallet_id.slice(-4) +
                      ')'
                    : `${beneficiaryAccount.beneficiary_name} - ${beneficiaryAccount.destination_currency} - ${beneficiaryAccount.bank_name} receives.`
                  : '-'}
              </Typography>
              <Typography
                variant='h5'
                sx={{
                  color:
                    isSpotRateExpired &&
                    transactionRequestData.lock_side ===
                      transactionRequestData.settlement_currency
                      ? '#9b9b9b'
                      : 'black',
                }}
              >
                {isSpotRateExpired &&
                !isSameCurrency &&
                transactionRequestData.lock_side ===
                  transactionRequestData.settlement_currency
                  ? `${formatCurrency(
                      transactionRequestData.payment_amount,
                      transactionRequestData.payment_currency,
                      false,
                      sellCurrencyDetails?.unit ?? DEFAULT_ROUNDING,
                      sellCurrencyDetails?.unit ?? DEFAULT_ROUNDING,
                      false,
                      'decimal',
                    )} ${transactionRequestData.payment_currency} *`
                  : isSameCurrency
                  ? `${formatCurrency(
                      transactionRequestData.settlement_amount,
                      transactionRequestData.settlement_currency,
                      false,
                      sellCurrencyDetails?.unit ?? DEFAULT_ROUNDING,
                      sellCurrencyDetails?.unit ?? DEFAULT_ROUNDING,
                      false,
                      'decimal',
                    )} ${transactionRequestData.settlement_currency}`
                  : `${formatCurrency(
                      paymentRfq?.success[0].external_quote &&
                        transactionRequestData.lock_side ===
                          transactionRequestData.settlement_currency
                        ? paymentRfq.success[0].transaction_amount
                        : transactionRequestData.payment_amount,
                      transactionRequestData.payment_currency,
                      false,
                      buyCurrencyDetails?.unit ?? DEFAULT_ROUNDING,
                      buyCurrencyDetails?.unit ?? DEFAULT_ROUNDING,
                      false,
                      'decimal',
                    )} ${transactionRequestData.payment_currency}`}
              </Typography>
            </Stack>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
      <Typography
        variant='small'
        sx={{
          fontWeight: 400,
          color: setAlpha(PangeaColors.Black, 0.6),
        }}
      >
        * This is not a quote. This is the latest market rate available for
        reference only.
      </Typography>
    </StyledBox>
  );
};

export default ScheduledExecutionTimeline;
