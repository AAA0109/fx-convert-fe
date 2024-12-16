import CloseIcon from '@mui/icons-material/Close';
import EastIcon from '@mui/icons-material/East';
import {
  Box,
  BoxProps,
  Dialog,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import {
  fxFetchingSpotRateState,
  paymentspotRateDataState,
  transactionRequestDataState,
} from 'atoms';
import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';
import { FeatureFlag } from '../FeatureFlag';
import PangeaButton from '../PangeaButton';
import HistoricalChart from './HistoricalChart';
import VolatilityChart from './VolatilityChart';
import LiquidityChart from './LiquidityChart';
import TypographyLoader from '../TypographyLoader';

type CurrencyInsightPreviewProps = BoxProps;

enum InsightTabEnum {
  Historical = 'historical',
  Volatility = 'volatility',
  Liquidity = 'liquidity',
}

const InsightsModal = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiDialog-paper': {
    minWidth: '45rem',
    minHeight: '40.5rem',
    maxWidth: '80%',
    boxSizing: 'border-box',
    backgroundColor: PangeaColors.CurrencyInsightsDialogBg,
    padding: theme.spacing(3, 3, 2),
  },
}));

export const CurrencyInsightPreview = ({
  ...boxProps
}: CurrencyInsightPreviewProps): JSX.Element => {
  const paymentSpotRateData = useRecoilValue(paymentspotRateDataState);
  const fetchingSpotRate = useRecoilValue(fxFetchingSpotRateState);
  const transactionRequestData = useRecoilValue(transactionRequestDataState);
  const [openInsightsModal, setOpenInsightsModal] = useState(false);
  const [activeInsightsTab, setActiveInsightsTab] = useState<
    Nullable<InsightTabEnum>
  >(InsightTabEnum.Historical);

  const isSameCurrency =
    transactionRequestData?.payment_currency !== '' &&
    transactionRequestData?.settlement_currency !== '' &&
    transactionRequestData?.payment_currency ===
      transactionRequestData?.settlement_currency;
  const marketAvailable = paymentSpotRateData?.status;
  const insightsReady = marketAvailable && !isSameCurrency;

  const handleCloseInsightsModal = useCallback(
    (
      _event: Record<string, unknown>,
      reason: 'backdropClick' | 'escapeKeyDown',
    ) => {
      if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
        return;
      }
      setOpenInsightsModal(false);
    },
    [],
  );

  const handleToggleGroupChange = (
    _event: React.MouseEvent<HTMLElement>,
    newTab: InsightTabEnum | null,
  ) => {
    setActiveInsightsTab(newTab);
  };

  const visibleChartDisplay = useMemo(() => {
    switch (activeInsightsTab) {
      case InsightTabEnum.Historical:
        return <HistoricalChart />;
      case InsightTabEnum.Volatility:
        return <VolatilityChart />;
      case InsightTabEnum.Liquidity:
        return <LiquidityChart />;
      default:
        return <>Nothing to see</>;
    }
  }, [activeInsightsTab]);

  const [disableViewCcyInsights, extraStepLabel] = useMemo(() => {
    switch (transactionRequestData.frequency) {
      case 'recurring':
        return [
          !transactionRequestData.periodicity_start_date ||
            !transactionRequestData.periodicity_end_date,
          'Complete minimum payment requirements',
        ];
      case 'installments':
        return [
          !transactionRequestData?.cashflows ||
            transactionRequestData.cashflows.length < 1,
          'Complete minimum payment requirements',
        ];
      default:
        return [!transactionRequestData.delivery_date, 'Select a value date'];
    }
  }, [transactionRequestData]);

  return (
    <Stack>
      <FeatureFlag name='currency-insights'>
        <Box
          borderRadius='4px'
          border={`1px solid ${PangeaColors.Gray}`}
          bgcolor={PangeaColors.White}
          p={3}
          {...boxProps}
          data-testid='currencyInsightsPreview'
        >
          <Stack direction='row' columnGap={1} alignItems='center'>
            <Typography variant='h6'>Currency Insights</Typography>
            <Typography
              variant='dataLabel'
              color={PangeaColors.SolidSlateMedium}
            >
              (BETA)
            </Typography>
          </Stack>

          <>
            <TypographyLoader
              isLoading={fetchingSpotRate}
              variant='h6'
              lineHeight='24px'
              my='8px'
              color={
                marketAvailable
                  ? alpha(PangeaColors.Black, 0.68)
                  : alpha(PangeaColors.Black, 0.38)
              }
              skeletonProps={{
                width: 70,
              }}
            >
              {marketAvailable ? marketAvailable.market : '--'}
            </TypographyLoader>
            <Typography
              variant='body1'
              fontWeight={400}
              fontSize='13px'
              lineHeight='18px'
              fontFamily='SuisseIntl'
              color={
                insightsReady
                  ? alpha(PangeaColors.Black, 0.68)
                  : alpha(PangeaColors.Black, 0.38)
              }
            >
              {insightsReady
                ? "Leverage AI to analyze a currency pair's historical performance, volatility, and liquidity."
                : isSameCurrency
                ? 'No chart data available for same currency pairs'
                : 'Enter a currency pair and value date to view our AI-driven insights on its historical performance, volatility, and liquidity.'}
            </Typography>
            <Image
              src='/images/insights-preview.png'
              alt='Currency Insights'
              width={500}
              height={300}
              style={{
                objectFit: 'contain',
                width: '100%',
                height: '100%',
                opacity: marketAvailable ? 1 : 0.2,
              }}
            />
            {insightsReady ? (
              <PangeaButton
                variant='text'
                color='primary'
                sx={{
                  minWidth: 110,
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  pl: 0,
                }}
                disabled={fetchingSpotRate || disableViewCcyInsights}
                onClick={() => {
                  setOpenInsightsModal(true);
                }}
              >
                {disableViewCcyInsights ? (
                  extraStepLabel
                ) : (
                  <>
                    View Now
                    <EastIcon />
                  </>
                )}
              </PangeaButton>
            ) : null}
          </>
        </Box>
        <InsightsModal
          onClose={handleCloseInsightsModal}
          aria-labelledby='currency-insights-dialog'
          open={openInsightsModal}
          data-testid='currencyInsightsDialog'
          disableEscapeKeyDown
        >
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            mb={2}
          >
            <Stack direction='row' columnGap={1}>
              <Typography variant='h5' color={alpha(PangeaColors.Black, 0.87)}>
                Currency Insights
              </Typography>
              {marketAvailable ? (
                <Typography
                  variant='h5'
                  color={alpha(PangeaColors.Black, 0.38)}
                >
                  {marketAvailable.market}
                </Typography>
              ) : null}
            </Stack>
            <IconButton onClick={() => setOpenInsightsModal(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <ToggleButtonGroup
            color='primary'
            onChange={handleToggleGroupChange}
            value={activeInsightsTab}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              mb: 2,
              '& .MuiToggleButtonGroup-grouped': {
                flex: 1,
                padding: 0.5,
              },
            }}
            aria-label='currency insight selector'
            exclusive
          >
            <ToggleButton
              value={InsightTabEnum.Historical}
              aria-label='historical chart'
              disabled={activeInsightsTab === InsightTabEnum.Historical}
            >
              Historical
            </ToggleButton>
            <ToggleButton
              value={InsightTabEnum.Volatility}
              aria-label='volatility risk cone'
              disabled={activeInsightsTab === InsightTabEnum.Volatility}
            >
              Volatility
            </ToggleButton>
            <ToggleButton
              value={InsightTabEnum.Liquidity}
              aria-label='liquidity insights'
              disabled
            >
              Liquidity/Spread
            </ToggleButton>
          </ToggleButtonGroup>

          {visibleChartDisplay}
        </InsightsModal>
      </FeatureFlag>
    </Stack>
  );
};

export default CurrencyInsightPreview;
