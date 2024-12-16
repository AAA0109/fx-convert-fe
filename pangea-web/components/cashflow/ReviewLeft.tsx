import { HelpOutline } from '@mui/icons-material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {
  AccordionDetails,
  AccordionProps,
  AccordionSummary,
  Box,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import MuiAccordion from '@mui/material/Accordion';
import styled from '@mui/system/styled';
import {
  activeHedgeState,
  autoPilotFeesDetailsState,
  bulkUploadItemsState,
  clientApiState,
  currentForwardHedgeItem,
  domesticCurrencyState,
  hedgeLosspreventionTargetState,
  hedgeMaxLossThresholdState,
  hedgeRiskReductionAmountState,
  hedgeSafeGuardState,
  hedgeSafeGuardTargetState,
  marginAndFeesDetailsState,
  pangeaAlertNotificationMessageState,
  selectedAccountState,
  selectedHedgeStrategy,
  userCompanyState,
} from 'atoms';
import STRATEGY_OPTIONS from 'components/shared/StrategyOptions';
import {
  useAuthHelper,
  useCashflow,
  useCashflowHelpers,
  useChartData,
  useFeatureFlags,
  useLoading,
  useUserGroupsAndPermissions,
} from 'hooks';
import {
  Cashflow,
  CashflowEditMode,
  CashflowStrategyEnum,
  Installment,
  PangeaAlert,
  PangeaAutopilotWhatIfResponse,
  PangeaFeeResponse,
  PangeaMarginAndFeesResponse,
  PangeaParachuteWhatIfResponse,
  formatCurrency,
} from 'lib';
import { isError, isNull } from 'lodash';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  Fragment,
  MouseEventHandler,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  useRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import { PangeaColors } from 'styles';
import PortfolioIcon from '../../public/images/portfolio.svg';
import {
  FeatureFlag,
  PangeaLoading,
  PangeaTooltip,
  StepperShell,
} from '../shared';
import ReviewSettlementUpdate from './ReviewSettlementUpdate';
const CORPAY_FW_FF_NAME = 'corpay-forwards-strategy';
const AUTOPILOT_FF_NAME = 'autopilot';
const HARD_LIMITS_FEATURE_FLAG = 'autopilot-hard-limits';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: 'transparent',
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AutoPilotReviewDetails = () => {
  const [brokerFees, setBrokerFees] =
    useState<Nullable<PangeaFeeResponse>>(null);
  const domesticCurrency = useRecoilValue(domesticCurrencyState);
  const riskReductionState = useRecoilValue(hedgeRiskReductionAmountState);

  const bulkItems = useRecoilValue(bulkUploadItemsState);
  const autopilotFeeData = useRecoilValue(autoPilotFeesDetailsState);
  const { loadingState } = useLoading();
  const safeGuarded = useRecoilValue(hedgeSafeGuardState);
  const selectedStrategy = useRecoilValue(selectedHedgeStrategy);
  const insufficientCredit = useMemo(() => {
    return (
      Math.min(
        Math.max(Number(autopilotFeeData?.credit_usage.available), 0) -
          Number(autopilotFeeData?.credit_usage.required),
        0,
      ) > 0
    );
  }, [autopilotFeeData]);
  useEffect(() => {
    if (autopilotFeeData) {
      setBrokerFees(
        autopilotFeeData?.fee.find((fee) => fee.fee_type === 'broker') ?? null,
      );
    }
  }, [autopilotFeeData, setBrokerFees]);

  if (!autopilotFeeData) {
    return (
      <PangeaLoading
        loadingPhrase='Calculating review data. This may take a moment.'
        useBackdrop
      />
    );
  }
  return (
    <Stack gap={1}>
      <Typography variant='h5' component='h5'>
        Transaction Details
      </Typography>
      <Box>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            sx={{
              paddingX: 2,
              // border: 1,
              // borderRadius: 1,
              // borderColor: PangeaColors.Gray,
            }}
          >
            <Stack direction='column' spacing={1}>
              <Typography
                variant='dataLabel'
                color={PangeaColors.BlackSemiTransparent60}
              >
                Current Reference Rate
              </Typography>
              <Typography
                color={PangeaColors.BlackSemiTransparent87}
                variant='h5'
                component='h5'
              >
                {formatCurrency(
                  (1 / parseFloat(autopilotFeeData.rate.fwd_rate)).toFixed(4),
                  bulkItems[0].currency ?? domesticCurrency,
                )}{' '}
                = 1 {bulkItems[0].currency}
              </Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              paddingTop: 3,
              borderTop: `1px solid ${PangeaColors.BlackSemiTransparent12}`,
            }}
          >
            <Stack direction='column' spacing={2}>
              <Typography
                variant='caption'
                color={PangeaColors.BlackSemiTransparent87}
              >
                Rate Details
              </Typography>
              <Box
                sx={{
                  background: '#f5f5f5',
                  padding: '16px 24px',
                }}
              >
                <Stack
                  paddingY={0.5}
                  direction='row'
                  justifyContent='space-between'
                >
                  <Stack direction={'row'} alignItems={'center'} spacing={1}>
                    <Typography
                      variant='body2'
                      color={PangeaColors.BlackSemiTransparent87}
                    >
                      Spot Rate
                    </Typography>
                    <PangeaTooltip
                      arrow
                      placement='right'
                      title={
                        <Fragment>
                          The current exchange rate at which a currency can be
                          bought or sold for immediate delivery or settlement.
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
                    color={PangeaColors.BlackSemiTransparent87}
                  >
                    {Number(autopilotFeeData.rate.spot_rate).toFixed(2)}%
                  </Typography>
                </Stack>
                <Stack
                  paddingY={0.5}
                  direction='row'
                  justifyContent='space-between'
                >
                  <Stack direction={'row'} alignItems={'center'} spacing={1}>
                    <Typography variant='body2'>
                      Forward Interest Rate Points
                    </Typography>
                    <PangeaTooltip
                      arrow
                      placement='right'
                      title={
                        <Fragment>
                          In FX hedging, forward interest rate points measure
                          the interest gap between two currencies. A positive
                          value indicates an interest rate environment that is
                          favorable to this hedge.
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
                  <Typography variant='body2'>
                    {(1 / parseFloat(autopilotFeeData.rate.fwd_rate)).toFixed(
                      4,
                    )}
                  </Typography>
                </Stack>
                <Stack
                  paddingY={0.5}
                  direction='row'
                  justifyContent='space-between'
                >
                  <Stack direction={'row'} alignItems={'center'} spacing={1}>
                    <Typography
                      variant='body2'
                      color={PangeaColors.BlackSemiTransparent87}
                    >
                      Spot Rate
                    </Typography>
                    <PangeaTooltip
                      arrow
                      placement='right'
                      title={
                        <Fragment>
                          The current exchange rate at which a currency can be
                          bought or sold for immediate delivery or settlement.
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
                    color={PangeaColors.BlackSemiTransparent87}
                  >
                    {Number(autopilotFeeData.rate.spot_rate).toFixed(2)}%
                  </Typography>
                </Stack>
                <Stack
                  paddingY={0.5}
                  direction='row'
                  justifyContent='space-between'
                >
                  <Stack direction={'row'} alignItems={'center'} spacing={1}>
                    <Typography variant='body2'>
                      Forward Interest Rate Points
                    </Typography>
                    <PangeaTooltip
                      arrow
                      placement='right'
                      title={
                        <Fragment>
                          In FX hedging, forward interest rate points measure
                          the interest gap between two currencies. A positive
                          value indicates an interest rate environment that is
                          favorable to this hedge.
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
                  <Typography variant='body2'>
                    {(1 / parseFloat(autopilotFeeData.rate.fwd_rate)).toFixed(
                      4,
                    )}
                  </Typography>
                </Stack>
                <Stack
                  paddingY={0.5}
                  direction='row'
                  justifyContent='space-between'
                >
                  <Stack direction={'row'} alignItems={'center'} spacing={1}>
                    <Typography variant='body2'>Broker Spread</Typography>
                    <PangeaTooltip
                      arrow
                      placement='right'
                      title={
                        <Fragment>
                          Pangea is committed to always be transparent about the
                          spread built into your all-in rate.
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
                  <Typography variant='body2'>
                    {parseFloat(
                      autopilotFeeData.fee.find(
                        (fee) => fee.fee_type === 'broker_max',
                      )?.percentage ?? '0',
                    ).toFixed(2)}
                    %
                  </Typography>
                </Stack>
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  paddingTop={1}
                  sx={{
                    borderTop: `1px solid ${PangeaColors.BlackSemiTransparent12}`,
                  }}
                >
                  <Stack direction={'row'} alignItems={'center'} spacing={1}>
                    <Typography
                      variant='body2'
                      color={PangeaColors.BlackSemiTransparent87}
                    >
                      Current All-In Rate
                    </Typography>

                    <PangeaTooltip
                      arrow
                      placement='right'
                      title={
                        <Fragment>
                          The Current All-In Rate combines the mid-market spot
                          rate, forward points, and broker spread to give a
                          comprehensive cost of the forward FX contracts
                          required for this hedge.
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
                    color={PangeaColors.BlackSemiTransparent87}
                  >
                    {parseFloat(
                      autopilotFeeData.fee.find(
                        (fee) => fee.fee_type === 'total_max',
                      )?.percentage ?? '0',
                    ).toFixed(2)}
                    %
                  </Typography>
                </Stack>
              </Box>
              <Typography
                variant='small'
                color={PangeaColors.BlackSemiTransparent60}
                textAlign={'justify'}
              >
                {selectedStrategy === CashflowStrategyEnum.AUTOPILOT
                  ? `The Current All-In Rate above is for reference only.
                Pangea's AI will swiftly and strategically execute the
                hedge, aiming to optimize price and liquidity to improve your
                forward rate. ${
                  (riskReductionState ?? 0) < 100
                    ? 'The unhedged portion of your cash flow will remain  exposed to market volatility, which may result in a better or worse rate than is currently available.'
                    : ''
                }`
                  : `The Current All-In Rate above is for reference only. The final rate won’t be able to be determined until either the end of the hedge or until 100% of Parachute ${
                      safeGuarded ? 'and/or Safeguard AI' : ''
                    } has been activated.`}
              </Typography>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Box>
      <Box>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            sx={{
              paddingX: 2,
            }}
          >
            <Stack flexDirection={'row'} gap={4}>
              <Stack direction='column' spacing={1}>
                <Typography
                  variant='dataLabel'
                  color={PangeaColors.BlackSemiTransparent60}
                >
                  Settlement
                </Typography>
                <Typography
                  color={PangeaColors.BlackSemiTransparent87}
                  variant='h6'
                  component='h6'
                >
                  Cash settled in usd
                </Typography>
              </Stack>
              <Stack direction='column' spacing={1}>
                <Typography
                  variant='dataLabel'
                  color={PangeaColors.BlackSemiTransparent60}
                >
                  Credit
                </Typography>
                <Typography
                  color={PangeaColors.BlackSemiTransparent87}
                  variant='h6'
                  component='h6'
                >
                  {insufficientCredit ? 'INSUFFICIENT' : 'sufficient'}
                </Typography>
              </Stack>
            </Stack>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              paddingTop: 3,
              borderTop: `1px solid ${PangeaColors.BlackSemiTransparent12}`,
            }}
          >
            <Stack direction='column' spacing={2}>
              <Box>
                <Stack
                  flexDirection={'row'}
                  alignItems={'center'}
                  paddingBottom={1}
                  gap={1}
                >
                  <Typography
                    variant='caption'
                    color={PangeaColors.BlackSemiTransparent87}
                  >
                    Settlement
                  </Typography>
                  <PangeaTooltip
                    color={PangeaColors.Gray}
                    arrow
                    placement='right'
                    title={
                      <Fragment>
                        Any profits or losses from this hedge will be deposited
                        or drafted from your settlement account on the
                        settlement date. Any additional funds required will be
                        drafted from the specified funding source.
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
                <FeatureFlag name={CORPAY_FW_FF_NAME}>
                  {loadingState.isLoading ? (
                    <PangeaLoading />
                  ) : (
                    <ReviewSettlementUpdate brokerFees={brokerFees} />
                  )}
                </FeatureFlag>
              </Box>
              <Stack
                sx={{
                  borderTop: `1px solid ${PangeaColors.BlackSemiTransparent12}`,
                  paddingTop: 2,
                }}
              >
                <Stack
                  flexDirection={'row'}
                  alignItems={'center'}
                  paddingBottom={1}
                  gap={1}
                >
                  <Typography
                    variant='caption'
                    color={PangeaColors.BlackSemiTransparent87}
                  >
                    Credit Usage
                  </Typography>
                  <PangeaTooltip
                    color={PangeaColors.Gray}
                    arrow
                    placement='right'
                    title={
                      <Fragment>
                        This indicates the maximum value of your hedges at any
                        given time and the necessary credit to initiate this
                        hedge.
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
                {insufficientCredit && (
                  <Stack
                    paddingY={2}
                    sx={{
                      background: '#f5f5f5',
                      paddingX: 2,
                    }}
                    direction='column'
                    spacing={1}
                  >
                    <Typography
                      variant='body2'
                      color={PangeaColors.RiskBerryDark}
                    >
                      You do not have enough credit available on your credit
                      line. This hedge will be marked as “Pending Credit” until
                      this is resolved. Contact your account manager for more
                      information.
                    </Typography>
                  </Stack>
                )}
                <Stack direction='column' spacing={1} paddingTop={1}>
                  <Stack direction='row' justifyContent='space-between' pl={1}>
                    <Typography variant='body2'>
                      Credit needed for this forward
                    </Typography>
                    <Typography variant='body2'>
                      {formatCurrency(
                        Math.abs(
                          Math.min(
                            Math.max(
                              Number(autopilotFeeData?.credit_usage.available),
                              0,
                            ) - Number(autopilotFeeData.credit_usage.required),
                            0,
                          ),
                        ),
                      )}
                    </Typography>
                  </Stack>
                  <Stack direction='row' justifyContent='space-between' pl={1}>
                    <Typography variant='body2'>
                      Your available credit
                    </Typography>
                    <Typography variant='body2'>
                      {formatCurrency(
                        Math.max(
                          Number(autopilotFeeData?.credit_usage.available),
                          0,
                        ),
                      )}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Stack>
  );
};
const ZeroGravityReviewDetails = () => {
  const bulkItems = useRecoilValue(bulkUploadItemsState);
  const domesticCurrency = useRecoilValue(domesticCurrencyState);

  //TODO: It's dumb we call this twice on consecutive pages.
  const marginAndFeeDataLoadable = useRecoilValueLoadable(
    marginAndFeesDetailsState({
      draft_ids: bulkItems
        .flatMap((hI) =>
          hI.type === 'installments'
            ? (hI as Installment).cashflows.map((c) => c.id)
            : (hI as Cashflow).id,
        )
        .sort((a, b) => a - b),
      account_id:
        bulkItems && bulkItems.length > 0 ? bulkItems[0]?.accountId : -1,
    }),
  );
  let marginAndFeeData: Nullable<PangeaMarginAndFeesResponse> = null;
  if (marginAndFeeDataLoadable.state == 'hasValue') {
    marginAndFeeData = marginAndFeeDataLoadable.getValue();
  }

  const showLoader = useMemo(() => {
    return (
      marginAndFeeDataLoadable.state == 'loading' || isNull(marginAndFeeData)
    );
  }, [marginAndFeeData, marginAndFeeDataLoadable.state]);
  return showLoader || isNull(marginAndFeeData) ? (
    <PangeaLoading
      loadingPhrase='Calculating review data. This may take a moment.'
      useBackdrop
    />
  ) : (
    <Stack direction='column' spacing={4}>
      <Stack direction='column' spacing={1}>
        <Typography variant='h5' component='h5'>
          Margin Required
        </Typography>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />} sx={{ padding: 2 }}>
            <Stack direction='column'>
              <Typography variant='h5' component='h5'>
                {formatCurrency(
                  marginAndFeeData.margin_required,
                  domesticCurrency,
                  true,
                  0,
                  0,
                  false,
                )}
              </Typography>
              <Typography variant='body2'>
                Calculated from total hedged amount across all portfolios.
              </Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              borderTop: `1px solid ${PangeaColors.BlackSemiTransparent12}`,
            }}
          >
            <Stack direction='column' spacing={1}>
              <Typography variant='caption'>Margin Details</Typography>
              <Stack direction='row' justifyContent='space-between' pl={1}>
                <Typography variant='body2'>
                  Margin already deposited
                </Typography>
                <Typography variant='body2'>
                  {formatCurrency(marginAndFeeData.margin_available)}
                </Typography>
              </Stack>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Stack>
      <Box>
        <Stack direction='column' spacing={1}>
          <Typography variant='h5' component='h5'>
            FEE
          </Typography>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />} sx={{ padding: 2 }}>
              <Stack direction='column'>
                <Stack direction='row' alignItems='flex-start' spacing={0.5}>
                  <Typography variant='h5' component='h5'>
                    {formatCurrency(
                      marginAndFeeData.fee_details.totals.amount,
                      domesticCurrency,
                      true,
                      0,
                      0,
                      false,
                    )}
                  </Typography>
                  <Typography
                    variant='h5'
                    component='h5'
                    color={PangeaColors.BlackSemiTransparent12}
                  >
                    |
                  </Typography>
                  <Typography variant='h5' component='h5'>
                    {(marginAndFeeData.fee_details.totals.rate * 100).toFixed(
                      1,
                    )}
                    %
                  </Typography>
                </Stack>
                <Typography variant='body2'>
                  Fees are calculated from your newly added cash flow.
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                borderTop: `1px solid ${PangeaColors.BlackSemiTransparent12}`,
              }}
            >
              <Stack direction='column' spacing={2}>
                {marginAndFeeData.fee_details.fee_groups.map((feeGroup) => (
                  <Stack direction='column' spacing={1} key={feeGroup.name}>
                    <Typography variant='caption'>{feeGroup.name}</Typography>
                    {feeGroup.fees.map((fee) => (
                      <Stack
                        direction='row'
                        justifyContent='space-between'
                        pl={1}
                        key={fee.name}
                      >
                        <Typography variant='body2'>{fee.name}</Typography>
                        <Typography variant='body2'>
                          {formatCurrency(
                            fee.amount,
                            domesticCurrency,
                            true,
                            0,
                            0,
                            false,
                          )}{' '}
                          {fee.rate > 0
                            ? '(' +
                              fee.rate.toLocaleString('en-us', {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 0,
                                style: 'percent',
                              } as Intl.NumberFormatOptions) +
                              ')'
                            : null}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                ))}
                <Stack direction='row' justifyContent='space-between'>
                  <Typography variant='body2'>Estimated Hedge Cost:</Typography>
                  <Typography variant='body2'>
                    {formatCurrency(
                      marginAndFeeData.fee_details.totals.amount,
                      domesticCurrency,
                      true,
                      0,
                      0,
                      false,
                    )}{' '}
                    (
                    {marginAndFeeData.fee_details.totals.rate.toLocaleString(
                      'en-US',
                      {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 0,
                        style: 'percent',
                      },
                    )}
                    )
                  </Typography>
                </Stack>
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Stack>
      </Box>
    </Stack>
  );
};

const ReviewLeftContents = () => {
  const { isFeatureEnabled } = useFeatureFlags();
  const shouldShowStrategySelector = isFeatureEnabled(CORPAY_FW_FF_NAME);
  const domesticCurrency = useRecoilValue(domesticCurrencyState);
  const selectedHedgeItem = useRecoilValue(currentForwardHedgeItem);
  const riskReductionState = useRecoilValue(hedgeRiskReductionAmountState);
  const maxLoss = useRecoilValue(hedgeMaxLossThresholdState);
  const safeGuarded = useRecoilValue(hedgeSafeGuardState);
  const bulkHedgeItems = useRecoilValue(bulkUploadItemsState);
  const autopilotFeeData = useRecoilValue(autoPilotFeesDetailsState);
  const safeGuardTaget = useRecoilValue(hedgeSafeGuardTargetState);
  const lossPreventionTaget = useRecoilValue(hedgeLosspreventionTargetState);
  const account = useRecoilValue(selectedAccountState);
  const [selectedStrategy, setSelectedStrategy] = useRecoilState(
    selectedHedgeStrategy,
  );
  const selectedStrategyData = selectedStrategy
    ? STRATEGY_OPTIONS[selectedStrategy]
    : undefined;
  const hedgeRiskReductionAmount = riskReductionState ?? 0;
  const { initialHedgeGraphHoverData } = useChartData({
    selectedAccountId: account?.id ?? -1,
    riskReduction: hedgeRiskReductionAmount,
    maxLoss,
  });
  const authHelper = useRecoilValue(clientApiState);
  const showLoader = useMemo(() => {
    return (
      selectedStrategy !== CashflowStrategyEnum.PARACHUTE &&
      isNaN(hedgeRiskReductionAmount)
    );
  }, [selectedStrategy, hedgeRiskReductionAmount]);
  useEffect(() => {
    // This is here to allow refreshing the review page without losing the selected strategy
    const loadHedgeItem = async () => {
      if (selectedHedgeItem && selectedHedgeItem.id) {
        const api = authHelper.getAuthenticatedApiHelper();
        const hedgeItemResponse = await api.getHedgeForwardByIdAsync(
          selectedHedgeItem.id,
        );
        if (isError(hedgeItemResponse)) {
          setSelectedStrategy(CashflowStrategyEnum.ZEROGRAVITY);
        } else {
          setSelectedStrategy(CashflowStrategyEnum.AUTOPILOT);
        }
      }
    };
    if (selectedStrategy === CashflowStrategyEnum.AUTOPILOT) {
      loadHedgeItem();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account?.id]);

  if (!initialHedgeGraphHoverData) {
    return null;
  }
  const cashflowTotalAmount = initialHedgeGraphHoverData?.initialValue ?? 0;
  const upsideAmount = initialHedgeGraphHoverData.upsideUnlimited
    ? Math.abs(
        cashflowTotalAmount * initialHedgeGraphHoverData.upsideUnlimited,
      ) + cashflowTotalAmount
    : 0;
  const downsideAmount = initialHedgeGraphHoverData.downsideUnlimited
    ? cashflowTotalAmount -
      Math.abs(
        cashflowTotalAmount * initialHedgeGraphHoverData.downsideUnlimited,
      )
    : 0;
  const isInstallment = bulkHedgeItems[0]?.type === 'installments';
  const cashflow = isInstallment
    ? (bulkHedgeItems[0] as Installment)
    : (bulkHedgeItems[0] as Cashflow);
  return showLoader ? (
    <PangeaLoading
      loadingPhrase='Calculating review data. This may take a moment.'
      useBackdrop
    />
  ) : (
    <Stack direction='column' spacing={4}>
      <Typography
        variant='body2'
        color={PangeaColors.BlackSemiTransparent60}
      >{`Congratulations, using ${selectedStrategy?.toUpperCase()} with the selected parameters has lowered this cash flow"s risk, projecting a ${
        cashflow?.direction === 'paying' ? 'cost' : 'cash flow value'
      } of ${
        hedgeRiskReductionAmount == 1
          ? '0%'
          : formatCurrency(downsideAmount, domesticCurrency, true, 0, 0)
      } or ${
        cashflow?.direction === 'paying' ? 'less' : 'better'
      }`}</Typography>
      <Stack spacing={1}>
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          sx={
            shouldShowStrategySelector
              ? {
                  background: '#f5f5f5',
                  padding: '16px 24px',
                }
              : {}
          }
        >
          <Stack direction='column' width={246}>
            <FeatureFlag name={CORPAY_FW_FF_NAME}>
              {selectedStrategyData && (
                <Stack direction='row' sx={{ margin: '12px 0 32px 0' }}>
                  <Stack>
                    <Typography variant='dataLabel'>Strategy</Typography>
                    <Stack direction='row' alignItems='center'>
                      <Typography variant='h5'>
                        {selectedStrategyData.reviewLabel}
                      </Typography>
                      {selectedStrategyData.icon}
                    </Stack>
                  </Stack>

                  {account &&
                    selectedStrategy === CashflowStrategyEnum.ZEROGRAVITY && (
                      <Stack
                        direction='row'
                        alignItems='center'
                        sx={{ marginLeft: '48px' }}
                      >
                        <PortfolioIcon sx={{ width: '34px' }} />
                        <Stack sx={{ marginLeft: '8px' }}>
                          <Typography variant='dataLabel'>Portfolio</Typography>
                          <Typography variant='h5'>{account.name}</Typography>
                        </Stack>
                      </Stack>
                    )}
                </Stack>
              )}
            </FeatureFlag>
            <Stack>
              <Stack direction={'row'} alignItems={'center'} spacing={1}>
                <Typography variant='body1' color='primary'>
                  Potential Loss mitigated
                </Typography>
                <PangeaTooltip
                  arrow
                  placement='right'
                  title={
                    <Fragment>
                      The risk reduction percentage is assessed by contrasting
                      the potential loss probabilities before and after applying
                      a hedging approach. It is precisely calculated by
                      subtracting the residual potential loss post-hedging from
                      the three-sigma (3σ) potential loss pre-hedging.
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
                color={PangeaColors.BlackSemiTransparent60}
              >
                {Math.round(
                  autopilotFeeData?.hedge_metric.potential_loss_mitigated ??
                    0 * 100,
                )}
                %
              </Typography>
            </Stack>
          </Stack>
          <Box>
            <Stack direction={'row'} spacing={2}>
              {['low', 'moderate', 'high'].indexOf(account?.name ?? '') < 0 ? (
                <Box>
                  {selectedStrategy === CashflowStrategyEnum.ZEROGRAVITY ? (
                    <Image
                      src='/images/50-percent-reduction-bar-graph.jpg'
                      width='48'
                      height='192'
                      alt='bar graph'
                    />
                  ) : (
                    <Image
                      src={`/images/${selectedStrategy}-percent-reduction-bar-graph.jpg`}
                      width='48'
                      height='192'
                      alt='bar graph'
                    />
                  )}
                </Box>
              ) : (
                <Image
                  src={`/images/${Math.round(
                    hedgeRiskReductionAmount * 100,
                  )}-percent-reduction-bar-graph.jpg`}
                  width='48'
                  height='192'
                  alt='bar graph'
                />
              )}
              <Stack justifyContent={'space-around'}>
                <Stack spacing={1}>
                  {selectedStrategy === CashflowStrategyEnum.PARACHUTE && (
                    <Stack direction={'row'} alignItems={'center'} spacing={1}>
                      <Typography
                        variant='h6'
                        color={PangeaColors.SecurityGreenDarker}
                      >
                        {safeGuarded ? 'SAFEGUARDED' : 'UNCAPPED'}
                      </Typography>
                      <PangeaTooltip
                        arrow
                        placement='right'
                        title={
                          <Fragment>
                            This represents your gain potential. With Safeguard
                            AI off, potential gains are uncapped but remain
                            vulnerable to volatility. If Safeguard AI is
                            enabled, your gains will be protected but may
                            limited.
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
                  )}
                  <Stack direction={'row'} spacing={1}>
                    <Typography
                      variant='h6'
                      color={
                        selectedStrategy === CashflowStrategyEnum.AUTOPILOT
                          ? PangeaColors.SecurityGreenDarker
                          : PangeaColors.BlackSemiTransparent87
                      }
                    >
                      {hedgeRiskReductionAmount == 1
                        ? '0%'
                        : formatCurrency(
                            upsideAmount,
                            domesticCurrency,
                            true,
                            0,
                            0,
                          )}
                    </Typography>
                    {selectedStrategy === CashflowStrategyEnum.AUTOPILOT && (
                      <>
                        <Typography variant='body2' component={'span'}>
                          ({((safeGuardTaget ?? 0) * 100).toFixed(2)}%)
                        </Typography>
                        <PangeaTooltip
                          arrow
                          placement='right'
                          title={
                            <Fragment>
                              This represents your gain potential. With
                              Safeguard Target off, potential gains on the
                              unhedged portion of your cash flow are uncapped,
                              but will rise and fall with the market. If
                              Safeguard Target is enabled, your gains will lock
                              in if the target is reached.
                            </Fragment>
                          }
                        >
                          <HelpOutline
                            sx={{
                              color: PangeaColors.BlackSemiTransparent60,
                            }}
                          />
                        </PangeaTooltip>
                      </>
                    )}
                  </Stack>
                </Stack>

                {selectedStrategy === CashflowStrategyEnum.AUTOPILOT && (
                  <Typography
                    variant='body2'
                    component={'span'}
                    color={PangeaColors.BlackSemiTransparent87}
                  >
                    {formatCurrency(
                      cashflowTotalAmount,
                      domesticCurrency,
                      true,
                      0,
                      0,
                    )}
                  </Typography>
                )}
                <Stack direction={'row'} spacing={1}>
                  <Typography variant='h6' color={PangeaColors.RiskBerryMedium}>
                    {hedgeRiskReductionAmount == 1
                      ? '0%'
                      : formatCurrency(
                          downsideAmount,
                          domesticCurrency,
                          true,
                          0,
                          0,
                        )}
                  </Typography>{' '}
                  <Typography variant='body2' component={'span'}>
                    (
                    {(
                      ((selectedStrategy === CashflowStrategyEnum.AUTOPILOT
                        ? lossPreventionTaget
                        : maxLoss) ?? 0) * 100
                    ).toFixed(2)}
                    %)
                  </Typography>
                  <PangeaTooltip
                    arrow
                    placement='right'
                    title={
                      <Fragment>
                        This signifies the greatest anticipated loss on this
                        hedge, incorporating your chosen risk reduction
                        percentage and factoring in your selected Max Loss
                        Threshold.
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
              </Stack>
            </Stack>
          </Box>
        </Stack>
        <FeatureFlag name={[HARD_LIMITS_FEATURE_FLAG, AUTOPILOT_FF_NAME]}>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            sx={
              shouldShowStrategySelector
                ? {
                    background: '#f5f5f5',
                    padding: '16px 24px',
                    marginTop: '2rem',
                  }
                : {}
            }
          >
            <Stack direction='column' width={246}>
              <Typography variant='body1' color='primary'>
                With Hard Limits
              </Typography>
              <Typography
                variant='body2'
                color={PangeaColors.BlackSemiTransparent60}
              >
                If currency prices hit your limit, you will lock in at the
                following prices:
              </Typography>
              <Typography
                variant='dataBody'
                sx={{ color: PangeaColors.RiskBerryMedium }}
              >
                Lower Limit -2%
              </Typography>
              <Typography
                variant='dataBody'
                sx={{ color: PangeaColors.SecurityGreenMedium }}
              >
                Upper Limit +2%
              </Typography>
            </Stack>
            <Box>
              <Stack direction={'row'} spacing={2}>
                <Image
                  src={`/images/${Math.round(
                    85,
                  )}-percent-reduction-bar-graph.jpg`}
                  width='48'
                  height='192'
                  alt='bar graph'
                />
                <Stack justifyContent={'space-evenly'}>
                  <Typography variant='h4' component={'span'}>
                    {hedgeRiskReductionAmount == 1
                      ? '0%'
                      : formatCurrency(
                          upsideAmount,
                          domesticCurrency,
                          true,
                          0,
                          0,
                        )}
                  </Typography>

                  <Typography
                    variant='body2'
                    component={'span'}
                    color={PangeaColors.SolidSlateLighter}
                  >
                    {formatCurrency(
                      cashflowTotalAmount,
                      domesticCurrency,
                      true,
                      0,
                      0,
                    )}
                  </Typography>
                  <Typography variant='h4' component={'span'}>
                    {hedgeRiskReductionAmount == 1
                      ? '0%'
                      : formatCurrency(
                          downsideAmount,
                          domesticCurrency,
                          true,
                          0,
                          0,
                        )}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </FeatureFlag>
        <Stack flexDirection={'row'} gap={1}>
          {(selectedStrategy === CashflowStrategyEnum.AUTOPILOT
            ? (autopilotFeeData as PangeaAutopilotWhatIfResponse)?.hedge_metric
                ?.upside_preservation
            : (autopilotFeeData as PangeaParachuteWhatIfResponse)?.hedge_metric
                ?.return_risk_ratio) && (
            <Box flex={1}>
              <Stack
                sx={
                  shouldShowStrategySelector
                    ? {
                        background: '#f5f5f5',
                        padding: '16px 24px',
                      }
                    : {}
                }
              >
                <Stack direction={'row'} alignItems={'center'} spacing={1}>
                  <Typography
                    variant='dataLabel'
                    fontSize={12}
                    color={PangeaColors.BlackSemiTransparent60}
                  >
                    {selectedStrategy === CashflowStrategyEnum.AUTOPILOT
                      ? 'UPSIDE PRESERVATION'
                      : 'Return / Risk Ratio'}
                  </Typography>
                  <PangeaTooltip
                    arrow
                    placement='right'
                    title={
                      <Fragment>
                        This ratio compares potential gains to residual risk
                        after hedging, where a higher value indicates gains
                        increasingly outweighing losses. Regardless of Safeguard
                        AI’s status, gains are theoretically uncapped, so we
                        calculate the ratio by dividing the three-sigma (3σ)
                        potential gain by the Maximum Loss Threshold.
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
                  variant='h5'
                  color={PangeaColors.BlackSemiTransparent87}
                >
                  {(selectedStrategy === CashflowStrategyEnum.AUTOPILOT
                    ? (autopilotFeeData as PangeaAutopilotWhatIfResponse)
                        ?.hedge_metric?.upside_preservation
                    : (autopilotFeeData as PangeaParachuteWhatIfResponse)
                        ?.hedge_metric?.return_risk_ratio
                  )?.toFixed(2) ?? 0}
                </Typography>
              </Stack>
            </Box>
          )}

          {autopilotFeeData?.hedge_metric.hedge_efficiency_ratio && (
            <Box flex={1}>
              <Stack
                sx={
                  shouldShowStrategySelector
                    ? {
                        background: '#f5f5f5',
                        padding: '16px 24px',
                      }
                    : {}
                }
              >
                <Stack direction={'row'} alignItems={'center'} spacing={1}>
                  <Typography
                    variant='dataLabel'
                    fontSize={12}
                    color={PangeaColors.BlackSemiTransparent60}
                  >
                    HEDGE EFFICIENCY RATIO
                  </Typography>
                  <PangeaTooltip
                    arrow
                    placement='right'
                    title={
                      <Fragment>
                        This shows the balance between mitigated risk and its
                        mitigation cost. A higher ratio indicates more
                        capital-efficient risk reduction. It’s simply calculated
                        by taking the Potential Loss Mitigated divided by
                        Pangea’s Transparent Hedge Fee.
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
                  variant='h5'
                  color={PangeaColors.BlackSemiTransparent87}
                >
                  {autopilotFeeData?.hedge_metric.hedge_efficiency_ratio?.toFixed(
                    2,
                  ) ?? '0'}
                </Typography>
              </Stack>
            </Box>
          )}
        </Stack>
      </Stack>

      <FeatureFlag name={CORPAY_FW_FF_NAME}>
        {selectedStrategy !== CashflowStrategyEnum.ZEROGRAVITY && (
          <Box>
            <AutoPilotReviewDetails />
          </Box>
        )}
      </FeatureFlag>

      <Stack sx={{ background: '#f5f5f5', padding: '16px 24px' }}>
        <Box flex={1}>
          <Stack
            flexDirection={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            paddingY={1}
            sx={{
              borderBottom: 1,
              borderColor: '#E0E0E0',
            }}
          >
            <Stack direction={'row'} alignItems={'center'} spacing={1}>
              <Typography
                fontSize={12}
                variant='dataLabel'
                color={PangeaColors.BlackSemiTransparent60}
              >
                Pangea Transparent Hedge Fee
              </Typography>
              <PangeaTooltip
                arrow
                placement='right'
                title={
                  <Fragment>
                    This is the fee Pangea charges to manage and execute this
                    hedge strategy. It&apos;s always one-time, upfront, and
                    transparent.
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
            <Typography color={PangeaColors.BlackSemiTransparent87}>
              {selectedStrategy === CashflowStrategyEnum.PARACHUTE
                ? '0% -'
                : ''}{' '}
              {parseFloat(
                autopilotFeeData?.fee.find((fee) => fee.fee_type === 'total')
                  ?.percentage ?? '0',
              ).toFixed(2)}
              %
            </Typography>
          </Stack>
        </Box>
        <Box flex={1}>
          <Stack
            paddingY={1}
            flexDirection={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Typography
              fontSize={12}
              variant='dataLabel'
              color={PangeaColors.BlackSemiTransparent60}
            >
              Total Due Today
            </Typography>
            <Typography color={PangeaColors.BlackSemiTransparent87}>
              {formatCurrency(
                Math.abs(
                  Math.min(
                    Math.max(
                      Number(autopilotFeeData?.credit_usage.available),
                      0,
                    ) - Number(autopilotFeeData?.credit_usage.required),
                    0,
                  ),
                ),
                domesticCurrency,
              )}
            </Typography>
          </Stack>
        </Box>
      </Stack>
      {(selectedStrategy === CashflowStrategyEnum.ZEROGRAVITY ||
        !shouldShowStrategySelector) && <ZeroGravityReviewDetails />}
    </Stack>
  );
};

export const ReviewLeft = ({ mode }: { mode: CashflowEditMode }) => {
  const { isLoaded } = useCashflow({
    loadDraftIfAvailable: true,
    useRouter: true,
  });
  const authHelper = useAuthHelper();
  const router = useRouter();
  const setErrorMsg = useSetRecoilState(pangeaAlertNotificationMessageState);
  const company = useRecoilValue(userCompanyState);
  const selectedHedgeItem = useRecoilValue(currentForwardHedgeItem);
  const resetStoredHedgeItem = useResetRecoilState(currentForwardHedgeItem);
  const selectedStrategy = useRecoilValue(selectedHedgeStrategy);

  const resetSelectedHedgeStrategy = useResetRecoilState(selectedHedgeStrategy);
  const activeHedge = useRecoilValue(activeHedgeState);
  const {
    activateCashflowsAsync,
    approveCashflowsAsync,
    activateFwHedgeItemsAsync,
  } = useCashflowHelpers();

  const { loadingState: executeLoading, loadingPromise: executeAsyncLoader } =
    useLoading();
  const { isAdmin, isManager } = useUserGroupsAndPermissions();
  const isCashflowPendingApproval =
    activeHedge.ui_status.includes('pending_approval');
  const shouldApproveHedge =
    isCashflowPendingApproval && (isAdmin || isManager);
  const continueButtonText = shouldApproveHedge
    ? 'Approve'
    : isAdmin || isManager
    ? 'Execute Hedge'
    : 'Submit for Approval';
  const failureType = isAdmin || isManager ? 'approving' : 'executing';
  useEffect(() => {
    if (!company?.stripe_customer_id) {
      setErrorMsg({
        severity: 'warning',
        text: 'Hedge execution is not enabled until fee payment information is provided. Go to Account > Settings > Banking to update payment information.',
      });
    }
  }, [company, setErrorMsg]);
  const handleClicked: MouseEventHandler<HTMLButtonElement> = async (event) => {
    await executeAsyncLoader(
      (async () => {
        event.preventDefault();
        if (
          selectedStrategy !== CashflowStrategyEnum.ZEROGRAVITY &&
          selectedHedgeItem?.id
        ) {
          const fwHedgeActivate = await activateFwHedgeItemsAsync(
            selectedHedgeItem.id,
          );
          if (!fwHedgeActivate) {
            setErrorMsg({
              text: `Failure ${failureType} activating hedge.`,
              severity: 'error',
            } as PangeaAlert);
            return;
          }
        } else {
          const cashflowsExecuted = shouldApproveHedge
            ? await approveCashflowsAsync
            : await activateCashflowsAsync();
          if (!cashflowsExecuted) {
            setErrorMsg({
              text: `Failure ${failureType} cash flows.`,
              severity: 'error',
            } as PangeaAlert);
            return;
          }
        }
        if (selectedHedgeItem) {
          resetStoredHedgeItem();
          resetSelectedHedgeStrategy();
        }
        router.push(`/${mode == 'create' ? 'cashflow' : 'manage'}/success`);
      })(),
    );
  };

  if (!isLoaded) {
    return (
      <PangeaLoading
        useBackdrop
        loadingPhrase='Loading cash flow review details'
      />
    );
  }
  return (
    <StepperShell
      spacing={0}
      title='Review your hedge'
      continueButtonText={continueButtonText}
      continueButtonEnabled={
        !!company?.stripe_customer_id &&
        authHelper.canTrade &&
        (selectedStrategy === CashflowStrategyEnum.AUTOPILOT
          ? Boolean(selectedHedgeItem?.funding_account)
          : true)
      }
      onClickContinueButton={handleClicked}
      continueButtonProps={{
        color: isAdmin || isManager ? 'secondary' : 'primary',
        endIcon: undefined,
        loading: executeLoading.isLoading,
      }}
      backButtonHref={`/${mode == 'create' ? 'cashflow' : 'manage'}/hedge${
        window.location.search
      }`}
    >
      <Suspense fallback={<Skeleton height={300} />}>
        <ReviewLeftContents />
      </Suspense>
    </StepperShell>
  );
};
export default ReviewLeft;
