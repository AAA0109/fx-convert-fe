import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab';
import { timelineOppositeContentClasses } from '@mui/lab/TimelineOppositeContent';
import { Box, BoxProps, Stack, Typography } from '@mui/material';
import styled from '@mui/system/styled';
import { bookInstructDealRequestDataState, executionTimingtData } from 'atoms';
import { SummaryDataPoint } from 'components/shared';
import { useWalletAndPaymentHelpers } from 'hooks';
import { formatCurrency } from 'lib';
import { ReactNode, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';

const StyledBox = styled(Box)<BoxProps>(() => ({
  borderRadius: '.5rem',
  backgroundColor: '#fafafa',
  border: `1px solid ${PangeaColors.Gray}`,
  padding: '1rem .75rem',
  display: 'flex',
  flexDirection: 'column',
  rowGap: '8px',
}));
export const TransferReview = (): JSX.Element => {
  const {
    allWallets,
    corPayQuotePaymentResponse: spotRateData,
    isSpotRateExpired,
  } = useWalletAndPaymentHelpers();
  const executionTiming = useRecoilValue(executionTimingtData);
  const fxTransferRequestData = useRecoilValue(
    bookInstructDealRequestDataState,
  );
  const {
    instruct_request: {
      payments: [payment],
      settlements: [settlementSpot],
    },
  } = fxTransferRequestData;
  const settlementWallet = allWallets?.find(
    (wallet) => wallet.wallet_id === settlementSpot.account_id,
  );
  const paymentWallet = allWallets?.find(
    (wallet) => wallet.wallet_id === payment.beneficiary_id,
  );

  const [numerator, denominator] = [
    spotRateData?.rate.rate_type.substring(0, 3),
    spotRateData?.rate.rate_type.substring(3),
  ];
  const selectedTimingDetails: Optional<{
    label: string;
    message: ReactNode;
    color: string;
  }> = useMemo(() => {
    switch (executionTiming?.id) {
      case 'now':
        return {
          label: 'Immediately',
          message: (
            <>
              This transfer will be executed immediately. Note: During illiquid
              periods, spreads can widen dramatically increasing the cost of
              this transfer. Using Strategic Execution may save you up to{' '}
              <Typography
                variant='dataBody'
                color={PangeaColors.SecurityGreenDark}
              >
                {executionTiming?.estimated_saving_bps !== null
                  ? `${executionTiming?.estimated_saving_bps} bps`
                  : '-'}
              </Typography>{' '}
              or more.
            </>
          ),
          color: '',
        };
      case 'today':
      case 'today_s__cutoff':
        return {
          label: 'Today',
          message:
            'This transfer will be executed immediately. Note: During illiquid periods, spreads can widen dramatically increasing the cost of this transfer. Using Strategic Execution may save you up to 30 bps or more.',
          color: PangeaColors.CautionYellowDark,
        };
      case 'tomorrow':
      case 'tomorrow_s__cutoff':
        return {
          label: 'Tomorrow',
          message:
            "Pangea's AI will strategically execute this payment for you before today’s bank cutoff to seek a better rate.",
          color: PangeaColors.SecurityGreenDark,
        };
      default:
        break;
    }
  }, [executionTiming?.estimated_saving_bps, executionTiming?.id]);
  return (
    <>
      <StyledBox>
        <Typography variant='body1'>
          Execution Timing: {selectedTimingDetails?.label}
        </Typography>
        <Typography variant='dataBody' sx={{ lineHeight: '24px' }}>
          {selectedTimingDetails?.message}
        </Typography>
        {executionTiming?.id !== 'now' ? (
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
          >
            <Typography
              variant='dataLabel'
              sx={{ lineHeight: '28px', letterSpacing: 'normal' }}
            >
              Estimated savings
            </Typography>
            <Typography
              variant='dataBody'
              color={
                selectedTimingDetails?.color ?? PangeaColors.SecurityGreenDark
              }
            >
              {executionTiming?.estimated_saving_bps !== null
                ? `${executionTiming?.estimated_saving_bps} bps`
                : '-'}
            </Typography>
          </Stack>
        ) : null}
      </StyledBox>
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
              <Typography variant='dataLabel'>Today</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot
                sx={{ backgroundColor: PangeaColors.WarmOrangeMedium }}
              />
              <TimelineConnector sx={{ backgroundColor: PangeaColors.Gray }} />
            </TimelineSeparator>
            <TimelineContent>
              <Stack>
                <Typography variant='dataBody'>
                  {settlementWallet
                    ? `${
                        settlementWallet.currency
                      } Wallet (...${settlementWallet.wallet_id.slice(-4)})`
                    : ''}{' '}
                  sends exactly
                </Typography>
                <Typography
                  variant='h5'
                  data-testid='settlementAmountLabelValue'
                  sx={{
                    marginBottom: 2,
                    color:
                      isSpotRateExpired && executionTiming?.id === 'now'
                        ? '#9b9b9b'
                        : 'black',
                  }}
                >
                  {isSpotRateExpired && executionTiming?.id === 'now'
                    ? 'Needs Rate'
                    : formatCurrency(
                        spotRateData?.settlement.amount ?? '',
                        settlementSpot.currency,
                        false,
                        2,
                        2,
                      )}
                </Typography>
              </Stack>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineOppositeContent>
              <Typography variant='dataLabel'>12:00PM</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot
                sx={{
                  backgroundColor: PangeaColors.EarthBlueMedium,
                  padding: '2px',
                }}
              />
              <TimelineConnector sx={{ backgroundColor: PangeaColors.Gray }} />
            </TimelineSeparator>
            <TimelineContent>
              <Stack>
                <Typography
                  variant='body1'
                  data-testid='spotRateLabelValue'
                  sx={{
                    color:
                      isSpotRateExpired && executionTiming?.id === 'now'
                        ? '#9b9b9b'
                        : 'black',
                  }}
                >
                  {isSpotRateExpired && executionTiming?.id === 'now'
                    ? 'Needs Rate'
                    : `${formatCurrency(
                        1,
                        numerator,
                        false,
                        0,
                        0,
                      )} = ${formatCurrency(
                        spotRateData?.rate.value ?? 0,
                        denominator,
                        false,
                        2,
                        10,
                        false,
                      )} *`}
                </Typography>
                {executionTiming?.id === 'now' ? null : (
                  <Typography variant='small'>
                    * Rate to be optimized & updated at execution.
                  </Typography>
                )}
              </Stack>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineOppositeContent>
              <Typography variant='dataLabel'>Tomorrow</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot
                sx={{ backgroundColor: PangeaColors.SecurityGreenMedium }}
              />
            </TimelineSeparator>
            <TimelineContent>
              <Stack>
                <Typography variant='dataBody'>
                  {paymentWallet
                    ? `${
                        paymentWallet.currency
                      } Wallet (...${paymentWallet.wallet_id.slice(-4)})`
                    : ''}{' '}
                  receives approx.
                </Typography>
                <Typography variant='h5'>
                  {formatCurrency(
                    payment.amount,
                    payment.currency,
                    false,
                    2,
                    2,
                  )}
                </Typography>
              </Stack>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </StyledBox>
      <StyledBox>
        <Stack>
          <SummaryDataPoint label='FEES' value='No fees' />
        </Stack>
      </StyledBox>
    </>
  );
};

export default TransferReview;
