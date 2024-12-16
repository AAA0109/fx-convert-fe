import {
  PangeaExecutionTypeOption,
  PangeaInsightsWidget,
} from '@hedgedesk/common-frontend';
import { DateRangeOutlined, InfoOutlined } from '@mui/icons-material';
import Close from '@mui/icons-material/Close';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import LockIcon from '@mui/icons-material/Lock';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { alpha, SxProps } from '@mui/material/styles';
import styled from '@mui/system/styled';
import {
  clientApiState,
  paymentExecutionTimingtData,
  paymentLiquidityData,
  transactionPaymentState,
  transactionRequestDataState,
  valueDateTypeState,
} from 'atoms';
import { CurrencyAmountDisplay, PangeaTooltip } from 'components/shared';
import { useCacheableAsyncData } from 'hooks';
import {
  CreateOrUpdatePaymentArguments,
  getExecutionTimingNote,
  PangeaDateTypeEnum,
  PangeaExecutionTimingEnum,
  setAlpha,
} from 'lib';
import { isError } from 'lodash';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { PangeaColors } from 'styles';

const CustomDialog = styled(Dialog)(() => ({
  '.MuiPaper-root': {
    backgroundColor: PangeaColors.StoryWhiteMedium,
    padding: '1.5rem',
  },
  '& .MuiDialog-paper': {
    width: '440px',
    maxWidth: '100%',
    boxSizing: 'border-box',
  },
}));

export const PaymentExecutionDetails = ({
  isPaymentValid,
  onCreateOrUpdateTransaction,
}: {
  isPaymentValid: boolean;
  onCreateOrUpdateTransaction: (
    options: CreateOrUpdatePaymentArguments,
  ) => Promise<void>;
}): JSX.Element => {
  const executionTiming = useRecoilValue(paymentExecutionTimingtData);
  const transactionRequestData = useRecoilValue(transactionRequestDataState);
  const transactionPayment = useRecoilValue(transactionPaymentState);
  const valueDateType = useRecoilValue(valueDateTypeState);
  const isSameCurrency =
    transactionRequestData?.payment_currency !== '' &&
    transactionRequestData?.settlement_currency !== '' &&
    transactionRequestData?.payment_currency ===
      transactionRequestData?.settlement_currency;

  return (
    <Box
      display='flex'
      flexDirection='column'
      bgcolor={PangeaColors.White}
      border={`1px solid ${PangeaColors.Gray}`}
      margin='2rem auto 0 auto'
      width='100%'
      maxWidth='35.35rem'
      p={3}
    >
      <Typography variant='heroBody' mb={4}>
        Execution Details
      </Typography>
      {isSameCurrency ? (
        <Box padding='25px 35px' bgcolor='#F0F0F0' textAlign='center'>
          <Typography
            variant='dataBody'
            color={alpha(PangeaColors.Black, 0.38)}
          >
            Best execution options are not available for same currency pairs
          </Typography>
        </Box>
      ) : !isPaymentValid ? (
        <>
          <Box padding='25px 35px' bgcolor='#F0F0F0' textAlign='center'>
            <Typography
              variant='dataBody'
              color={alpha(PangeaColors.Black, 0.38)}
            >
              Complete Transaction Details above to view current market
              conditions and execution timing options
            </Typography>
          </Box>
          <Stack
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
            mt={2}
          >
            <Stack flexDirection={'row'} gap={1}>
              <Typography
                variant='dataLabel'
                color={PangeaColors.BlackSemiTransparent60}
              >
                Delivery Fee
              </Typography>
              <PangeaTooltip
                title={
                  <>
                    Delivery fees vary by transaction size and method. Contact
                    Client Services or refer to your client services agreement
                    for details.
                  </>
                }
                placement='right'
                arrow
              >
                <InfoOutlined />
              </PangeaTooltip>
            </Stack>
            <Typography
              color={PangeaColors.BlackSemiTransparent87}
              variant='dataBody'
            >
              --
            </Typography>
          </Stack>
          {valueDateType === PangeaDateTypeEnum.FORWARD && (
            <Stack
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <Stack flexDirection={'row'} gap={1}>
                <Typography
                  variant='dataLabel'
                  color={PangeaColors.BlackSemiTransparent60}
                >
                  Forward Points
                </Typography>
                <PangeaTooltip title={<></>} placement='right' arrow>
                  <InfoOutlined />
                </PangeaTooltip>
              </Stack>
              <Typography
                color={PangeaColors.BlackSemiTransparent87}
                variant='dataBody'
              >
                --
              </Typography>
            </Stack>
          )}
        </>
      ) : (
        <Stack spacing={3}>
          {!transactionPayment ? (
            <>
              <Stack
                border={2}
                borderRadius={'8px'}
                borderColor={PangeaColors.SolidSlateMediumSemiTransparent08}
                padding={2}
                spacing={1}
                bgcolor={PangeaColors.StoryWhiteMedium}
              >
                <Skeleton variant='rectangular' height={18} width={'10%'} />
                <Skeleton variant='rectangular' height={22} width={'20%'} />
                <Skeleton variant='rectangular' height={18} width={'95%'} />
                <Skeleton variant='rectangular' height={18} width={'65%'} />
              </Stack>
              <Skeleton variant='rectangular' height={24} width={'28%'} />
              <Stack
                direction='column'
                justifyContent={'space-between'}
                alignItems={'start'}
                spacing={1}
                p={2}
                borderRadius={2}
                border={2}
                borderColor={PangeaColors.SolidSlateMediumSemiTransparent08}
                style={{ cursor: 'pointer' }}
                bgcolor={PangeaColors.SolidSlateMediumSemiTransparent08}
              >
                <Skeleton variant='rectangular' height={20} width={'40%'} />
                <Skeleton variant='rectangular' height={18} width={'95%'} />
                <Skeleton variant='rectangular' height={18} width={'25%'} />
              </Stack>
              <Stack
                direction='column'
                justifyContent={'space-between'}
                alignItems={'start'}
                spacing={1}
                p={2}
                borderRadius={2}
                border={2}
                borderColor={PangeaColors.SolidSlateMediumSemiTransparent08}
                style={{ cursor: 'pointer' }}
                bgcolor={PangeaColors.SolidSlateMediumSemiTransparent08}
              >
                <Skeleton variant='rectangular' height={20} width={'40%'} />
                <Skeleton variant='rectangular' height={18} width={'95%'} />
                <Skeleton variant='rectangular' height={18} width={'25%'} />
              </Stack>
            </>
          ) : (
            <AllTimingOptions
              id={transactionPayment.id}
              onUpdate={onCreateOrUpdateTransaction}
            />
          )}
          {executionTiming ? (
            <Stack
              display={'none'}
              borderColor={PangeaColors.SolidSlateMediumSemiTransparent08}
              padding={2}
              spacing={1}
              bgcolor={PangeaColors.SkyBlueLight}
            >
              <Typography
                variant='body2'
                color={PangeaColors.BlackSemiTransparent60}
              >
                {getExecutionTimingNote(executionTiming.value)}
              </Typography>
            </Stack>
          ) : (
            ''
          )}
          <Stack>
            <Stack
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <Stack flexDirection={'row'} gap={1}>
                <Typography
                  variant='dataLabel'
                  color={PangeaColors.BlackSemiTransparent60}
                >
                  Delivery Fee
                </Typography>
                <PangeaTooltip
                  title={
                    <>
                      Delivery fees vary by transaction size and method. Contact
                      Client Services or refer to your client services agreement
                      for details.
                    </>
                  }
                  placement='right'
                  arrow
                >
                  <InfoOutlined />
                </PangeaTooltip>
              </Stack>
              {transactionRequestData.fees ? (
                <CurrencyAmountDisplay
                  color={PangeaColors.BlackSemiTransparent87}
                  variant='dataBody'
                  amount={transactionRequestData.fees}
                  rounding={0}
                />
              ) : (
                <Typography
                  color={PangeaColors.BlackSemiTransparent87}
                  variant='dataBody'
                >
                  WAIVED
                </Typography>
              )}
            </Stack>
            {valueDateType === PangeaDateTypeEnum.FORWARD && (
              <Stack
                flexDirection={'row'}
                alignItems={'center'}
                justifyContent={'space-between'}
              >
                <Stack flexDirection={'row'} gap={1}>
                  <Typography
                    variant='dataLabel'
                    color={PangeaColors.BlackSemiTransparent60}
                  >
                    Forward Points
                  </Typography>
                  <PangeaTooltip title={<></>} placement='right' arrow>
                    <InfoOutlined />
                  </PangeaTooltip>
                </Stack>
                <Typography
                  color={PangeaColors.BlackSemiTransparent87}
                  variant='dataBody'
                >
                  --
                </Typography>
              </Stack>
            )}
          </Stack>
        </Stack>
      )}
    </Box>
  );
};
interface CircleIconProps {
  iconBackgroundColor?: string;
  iconColor?: string;
  icon: React.ComponentType<{ sx?: SxProps }>;
  sxIconProps?: SxProps;
  sxBgProps?: SxProps;
  testId?: string;
}

const CircleIcon: React.FC<CircleIconProps> = ({
  iconBackgroundColor = '#0000000A',
  iconColor = PangeaColors.SolidSlateDarker,
  icon: IconComponent,
  testId = 'CircleIcon',
  sxIconProps,
  sxBgProps,
}) => {
  return (
    <Box
      data-testid={testId}
      sx={{
        backgroundColor: iconBackgroundColor,
        borderRadius: '100%',
        width: '48px',
        height: '48px',
        minWidth: '48px',
        maxWidth: '48px',
        display: 'grid',
        placeItems: 'center',
        ...sxBgProps,
      }}
    >
      <IconComponent sx={{ color: iconColor, ...sxIconProps }} />
    </Box>
  );
};

function AllTimingOptions({
  id,
  onUpdate,
}: {
  id: number;
  onUpdate: (options: CreateOrUpdatePaymentArguments) => Promise<void>;
}): JSX.Element {
  const [openLaernMoreModal, setOpenLearnMoreModal] = useState(false);
  const api = useRecoilValue(clientApiState);
  const apiHelper = api.getAuthenticatedApiHelper();
  const [executionTiming, setExecutionTiming] = useRecoilState(
    paymentExecutionTimingtData,
  );
  const transactionPayment = useRecoilValue(transactionPaymentState);
  const setPaymentLiquidity = useSetRecoilState(paymentLiquidityData);

  const {
    data: timingOptions,
    isLoading,
    isRefetching,
    isError: isAsyncError,
    isLoadingError,
  } = useCacheableAsyncData('paymentTimingOptions', async () => {
    return await apiHelper.getPaymentsExecutionTimingOptionsAsync(id);
  });

  const executionOptions =
    timingOptions && !isError(timingOptions)
      ? timingOptions.execution_timings
      : [];

  const messageMap: Partial<
    Record<
      PangeaExecutionTimingEnum,
      {
        message: string;
        title: string;
        icon?: React.ReactNode;
      }
    >
  > = {
    [PangeaExecutionTimingEnum.ImmediateForward]: {
      title: 'IMMEDIATE FORWARD FX',
      message:
        'Execute a forward contract at the current forward rate now. This will settle on the specified future date.',
      icon: <CircleIcon icon={CompareArrowsIcon} />,
    },
    [PangeaExecutionTimingEnum.ImmediateSpot]: {
      title: 'IMMEDIATE SPOT FX',
      message: 'Execute a spot transaction for immediate settlement.',
      icon: <CircleIcon icon={LockIcon} />,
    },
    [PangeaExecutionTimingEnum.ScheduledSpot]: {
      title: 'SCHEDULED SPOT FX',
      message:
        "Schedule a spot transaction to be executed by Pangea's AI at the optimal rate within 24 hours of the specified future date. This will settle immediately after the future execution date.",
      icon: (
        <CircleIcon
          icon={DateRangeOutlined}
          iconColor='#9C42C0'
          iconBackgroundColor='#CE93D829'
        />
      ),
    },
    [PangeaExecutionTimingEnum.StrategicForward]: {
      title: 'STRATEGIC FORWARD FX',
      message:
        "Initiate a forward contract to be executed by Pangea's AI at an optimal rate during the best liquidity period within 24 hours. This will settle on the specified future date.",
      icon: (
        <CircleIcon
          icon={LockIcon}
          iconColor='#42A5F5'
          iconBackgroundColor='#90CAF91F'
        />
      ),
    },
    [PangeaExecutionTimingEnum.StrategicSpot]: {
      title: 'STRATEGIC SPOT FX',
      message:
        "Initiate a spot transaction to be executed by Pangea's AI at an optimal rate during the best liquidity period within 24 hours. This will settle immediately after execution.",
      icon: (
        <CircleIcon
          icon={CompareArrowsIcon}
          iconColor='#42A5F5'
          iconBackgroundColor='#90CAF91F'
        />
      ),
    },
  };

  useEffect(() => {
    if (
      !executionTiming &&
      timingOptions &&
      !isError(timingOptions) &&
      transactionPayment?.execution_timing
    ) {
      const selectedTiming = timingOptions.execution_timings.find(
        (item) => item.value === transactionPayment.execution_timing,
      );
      if (selectedTiming) {
        setExecutionTiming(selectedTiming);
      }
    }
    if (timingOptions && !isError(timingOptions)) {
      setPaymentLiquidity(timingOptions.execution_data ?? null);
    }
  }, [
    executionTiming,
    setExecutionTiming,
    setPaymentLiquidity,
    timingOptions,
    transactionPayment,
  ]);

  if (isLoading || isRefetching) {
    return (
      <>
        <Stack
          border={2}
          borderRadius={'8px'}
          borderColor={PangeaColors.SolidSlateMediumSemiTransparent08}
          padding={2}
          spacing={1}
          bgcolor={PangeaColors.StoryWhiteMedium}
        >
          <Skeleton variant='rectangular' height={18} width={'10%'} />
          <Skeleton variant='rectangular' height={22} width={'20%'} />
          <Skeleton variant='rectangular' height={18} width={'95%'} />
          <Skeleton variant='rectangular' height={18} width={'65%'} />
        </Stack>
        <Skeleton variant='rectangular' height={24} width={'28%'} />
        <Stack
          direction='column'
          justifyContent={'space-between'}
          alignItems={'start'}
          spacing={1}
          p={2}
          borderRadius={2}
          border={2}
          borderColor={PangeaColors.SolidSlateMediumSemiTransparent08}
          style={{ cursor: 'pointer' }}
          bgcolor={PangeaColors.SolidSlateMediumSemiTransparent08}
        >
          <Skeleton variant='rectangular' height={20} width={'40%'} />
          <Skeleton variant='rectangular' height={18} width={'95%'} />
          <Skeleton variant='rectangular' height={18} width={'25%'} />
        </Stack>
        <Stack
          direction='column'
          justifyContent={'space-between'}
          alignItems={'start'}
          spacing={1}
          p={2}
          borderRadius={2}
          border={2}
          borderColor={PangeaColors.SolidSlateMediumSemiTransparent08}
          style={{ cursor: 'pointer' }}
          bgcolor={PangeaColors.SolidSlateMediumSemiTransparent08}
        >
          <Skeleton variant='rectangular' height={20} width={'40%'} />
          <Skeleton variant='rectangular' height={18} width={'95%'} />
          <Skeleton variant='rectangular' height={18} width={'25%'} />
        </Stack>
      </>
    );
  }
  if (
    !timingOptions ||
    isAsyncError ||
    isLoadingError ||
    isError(timingOptions)
  ) {
    return <></>;
  }
  return (
    <>
      {timingOptions.execution_data?.liquidity_insight && (
        <PangeaInsightsWidget
          liquidity={timingOptions.execution_data.liquidity_insight.liquidity}
          widgetType='insight'
        />
      )}
      <Stack spacing={1}>
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'
        >
          <Typography variant='body1'>
            Select your execution strategy:
          </Typography>
          <Typography variant='dataLabel'>
            Learn MORE
            <IconButton onClick={() => setOpenLearnMoreModal(true)}>
              <InfoOutlined />
            </IconButton>
          </Typography>
        </Stack>
        {executionOptions.length > 0 && (
          <Stack spacing={2}>
            {executionOptions
              .sort((a, b) => (b.recommend ? 1 : 0) - (a.recommend ? 1 : 0))
              .map((item, index) => {
                const { value, recommend } = item;
                const title =
                  messageMap[value as PangeaExecutionTimingEnum]?.title ?? '';
                const description =
                  messageMap[value as PangeaExecutionTimingEnum]?.message ?? '';
                const icon =
                  messageMap[value as PangeaExecutionTimingEnum]?.icon;
                return (
                  <PangeaExecutionTypeOption
                    onClick={() => {
                      setExecutionTiming(item);
                      setPaymentLiquidity(timingOptions.execution_data ?? null);
                      onUpdate({ shouldUpdateBestEx: false });
                    }}
                    title={title}
                    message={description}
                    key={index}
                    recommended={recommend}
                    icon={icon}
                    checked={executionTiming?.value === value}
                  />
                );
              })}
          </Stack>
        )}
      </Stack>
      <CustomDialog
        onClose={() => setOpenLearnMoreModal(false)}
        open={openLaernMoreModal}
      >
        <DialogTitle
          style={{
            padding: '0px',
          }}
        >
          <Stack
            direction={'row'}
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
            }}
          >
            <Typography variant='h5' component={'h2'}>
              About Execution
            </Typography>
            <IconButton
              aria-label='close'
              onClick={() => setOpenLearnMoreModal(false)}
            >
              <Close
                style={{
                  width: '24px',
                  height: '24px',
                  color: setAlpha(PangeaColors.Black, 0.54),
                }}
              />
            </IconButton>
          </Stack>
        </DialogTitle>
        <Stack gap={1}>
          <Typography
            fontFamily='SuisseIntlCond'
            textTransform='uppercase'
            fontWeight={600}
            fontSize={16}
          >
            Products &amp; Strategies
          </Typography>
          <Typography variant='h6' textTransform='capitalize'>
            Spot
          </Typography>
          <Typography variant='componentsChip' mb={2}>
            Spot transactions settle immediately at the current market rate.
            This is often the preferred option for immediate currency exchange
            needs without waiting for specific conditions.
          </Typography>

          <Typography variant='h6' textTransform='capitalize'>
            Forward
          </Typography>
          <Typography variant='componentsChip' mb={2}>
            Forwards lock in today’s exchange rate, hedging against future
            changes. Forward Points, based on country interest rates, adjust the
            cost up or down, with details provided at booking.
          </Typography>

          <Typography variant='h6' textTransform='none'>
            Non-Deliverable Forward (NDF)
          </Typography>
          <Typography variant='componentsChip'>
            NDFs apply to currencies with delivery restrictions. Instead of
            exchanging currencies, only the difference between the agreed rate
            and the settlement rate is settled in cash (cash-settled).
          </Typography>
        </Stack>

        <Stack gap={1} my={2}>
          <Typography
            fontFamily='SuisseIntlCond'
            textTransform='uppercase'
            fontWeight={600}
            fontSize={16}
          >
            Execution Timing
          </Typography>
          <Typography variant='h6' textTransform='capitalize'>
            Immediate Execution
          </Typography>
          <Typography variant='componentsChip' mb={2}>
            Immediate execution locks in a price right away, providing quick
            settlement at the current market rate. Ideal for trades that need to
            go through without waiting for optimal conditions.
          </Typography>

          <Typography variant='h6' textTransform='capitalize'>
            Strategic Execution
          </Typography>
          <Typography variant='componentsChip' mb={2}>
            Pangea’s AI-driven strategy monitors market volatility and liquidity
            within a 24-hour window to minimize the bid/ask spread (market cost)
            and reduce the overall cost of the transaction.
          </Typography>

          <Typography variant='h6' textTransform='capitalize'>
            Scheduled Spot
          </Typography>
          <Typography variant='componentsChip'>
            Schedule a future trade, planning a known transaction without
            locking today’s price. Strategic execution optimizes the rate as the
            date nears, ensuring timely fund arrival.
          </Typography>
        </Stack>

        <Button
          variant='outlined'
          fullWidth
          size='large'
          onClick={() => setOpenLearnMoreModal(false)}
        >
          Close
        </Button>
      </CustomDialog>
    </>
  );
}

export default PaymentExecutionDetails;
