import { InfoOutlined } from '@mui/icons-material';
import { Alert, AlertTitle, Stack, Typography } from '@mui/material';
import { PangeaColors } from 'styles';
import PangeaTooltip from './PangeaTooltip';
import { useRecoilValue } from 'recoil';
import {
  paymentExecutionTimingtData,
  paymentspotRateDataState,
  valueDateTypeState,
} from 'atoms';
import { PangeaDateTypeEnum, PangeaExecutionTimingEnum } from 'lib';

type WidgetType = 'advisory' | 'insight';
type Liquidity = 'good' | 'limited' | 'poor' | 'acceptable' | 'closed';

interface PangeaInsightsAdvisoryWidgetProps {
  widgetType: WidgetType;
  title: string;
  tooltip: string;
  liquidity: string;
  isReviewStep?: boolean;
}

const WIDGET_COPY: Record<WidgetType, Record<Liquidity, string>> = {
  advisory: {
    good: '',
    limited:
      'Be advised, you are executing during a period of limited liquidity. Spreads are wider than average, and market costs may be higher.',
    poor: 'Be advised, you are executing during a period of poor liquidity. Spreads are significantly wider, and market costs will be higher.',
    acceptable:
      'Be advised, you are executing during a period of limited liquidity. Spreads are wider than average, and market costs may be higher.',
    closed: '',
  },
  insight: {
    good: 'Our AI indicates markets are liquid with low spreads, allowing your transaction to execute immediately at a low market cost.',
    limited:
      'Our AI indicates markets have limited liquidity, potentially leading to wider spreads and above-average execution costs.',
    poor: 'Our AI indicates markets are illiquid and spreads are significantly wider, increasing market costs. We recommend strategic execution.',
    acceptable:
      'Our AI indicates markets have limited liquidity, potentially leading to wider spreads and above-average execution costs.',
    closed:
      'This market is closed due to a holiday or weekend. Our AI will execute this trade at the best liquid period after market open.',
  },
};

export const PangeaInsightsAdvisoryWidget = ({
  title,
  liquidity,
  tooltip,
  widgetType,
  isReviewStep = false,
}: PangeaInsightsAdvisoryWidgetProps) => {
  const liquidityCopy = WIDGET_COPY[widgetType][liquidity as Liquidity];
  const valueDateType = useRecoilValue(valueDateTypeState);
  const executionTiming = useRecoilValue(paymentExecutionTimingtData);
  const paymentspotRateData = useRecoilValue(paymentspotRateDataState);
  const isValidNdfCondition =
    isReviewStep &&
    (executionTiming?.value === PangeaExecutionTimingEnum.ImmediateNdf ||
      executionTiming?.value === PangeaExecutionTimingEnum.StrategicNdf) &&
    valueDateType === PangeaDateTypeEnum.FORWARD &&
    paymentspotRateData?.is_ndf;

  return (
    <Stack direction='column' rowGap={2}>
      {isValidNdfCondition ? (
        <Alert
          severity='warning'
          sx={{ border: '1px solid #dbc04b', py: '14px' }}
        >
          <AlertTitle>
            <Typography variant='h6' textTransform='capitalize'>
              Electronic Trading Unavailable
            </Typography>
          </AlertTitle>
          <Typography variant='body2' lineHeight='20px'>
            This market is not presently tradable electronically. Please use the
            rate below for reference, and select &quot;Request Trade Desk
            Quote&quot; for the Trade Desk to begin the quote process.
          </Typography>
        </Alert>
      ) : (
        <Stack
          border={2}
          borderRadius={'8px'}
          borderColor={PangeaColors.SolidSlateMediumSemiTransparent08}
          padding={2}
          spacing={1}
          bgcolor={
            widgetType === 'insight' ? PangeaColors.StoryWhiteMedium : '#fafafa'
          }
        >
          <Stack
            flexDirection={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Typography
              variant='dataLabel'
              color={PangeaColors.BlackSemiTransparent87}
            >
              {title}
            </Typography>
            <PangeaTooltip title={<>{tooltip}</>} placement='right' arrow>
              <InfoOutlined />
            </PangeaTooltip>
          </Stack>
          <Typography
            variant={'h5'}
            color={
              liquidity === 'good'
                ? PangeaColors.SecurityGreenMedium
                : liquidity === 'closed'
                ? PangeaColors.Black
                : PangeaColors.WarmOrangeMedium
            }
          >
            {liquidity === 'closed'
              ? 'Market Closed'
              : `${liquidity} Liquidity`}
          </Typography>
          <Typography
            variant='body2'
            color={PangeaColors.BlackSemiTransparent60}
          >
            {liquidityCopy}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};

export default PangeaInsightsAdvisoryWidget;
