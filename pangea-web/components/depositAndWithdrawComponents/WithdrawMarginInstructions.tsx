import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Stack, Typography, TypographyProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  clientApiState,
  domesticCurrencyState,
  marginDepositAPISendDataState,
  marginHealthDetailsState,
  pangeaAlertNotificationMessageState,
} from 'atoms';
import { PangeaButton } from 'components/shared';
import { useLoading } from 'hooks';
import {
  PangeaCreateECASSOActionEnum,
  PangeaCreateECASSOResponse,
  PangeaMarginHealthResponse,
  formatCurrency,
  getIPAddressAsync,
} from 'lib';
import { isError } from 'lodash';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { PangeaColors } from 'styles';

interface WithdrawMarginInstructionsProps {
  handleBack: () => void;
}

type MarginProp = keyof Pick<
  PangeaMarginHealthResponse,
  'margin_balance' | 'recommended_withdrawl' | 'maximum_withdrawl'
>;

const StyledTypography = styled(Typography)<TypographyProps>({
  lineHeight: '20px',
  color: PangeaColors.BlackSemiTransparent99,
});

const SUGGESTED_VALUES: Record<MarginProp, string> = {
  margin_balance: 'Excess Liquidity',
  recommended_withdrawl: 'Suggested Max',
  maximum_withdrawl: 'Custom Amount Range:',
};

export const WithdrawMarginInstructions = ({
  handleBack,
}: WithdrawMarginInstructionsProps): JSX.Element => {
  const domesticCurrency = useRecoilValue(domesticCurrencyState);

  const marginDepositAPISendData = useRecoilValue(
    marginDepositAPISendDataState,
  );
  const dashboardMarginData =
    useRecoilValue(
      marginHealthDetailsState(
        marginDepositAPISendData?.depositDetails?.deposit_amount,
      ),
    ) ?? null;

  const selectedMargin = dashboardMarginData?.margins[0];

  const shouldShowSuggestions =
    selectedMargin && selectedMargin.health_score * 100 > 55;

  const authHelper = useRecoilValue(clientApiState);
  const { loadingPromise, loadingState } = useLoading();
  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );

  const handleGoToIB = useEventCallback(async () => {
    const getSSOWithdrawURL = async () => {
      const ipAddress = await getIPAddressAsync();
      const api = authHelper.getAuthenticatedApiHelper();
      const compData = await api.getCompanyAsync();
      if (!isError(compData) && compData.ibkr_application[0]?.username) {
        try {
          const ssoUrl = await api.getSsoUrlAsync(
            compData.ibkr_application[0].username,
            ipAddress,
            PangeaCreateECASSOActionEnum.WireWithdrawal,
          );
          if (isError(ssoUrl)) {
            setPangeaAlertNotificationMessage({
              severity: 'error',
              text: 'Failed to get portal URL. Please try again or contact customer support.',
            });
            return;
          }
          window.open(
            (ssoUrl as PangeaCreateECASSOResponse).url,
            '_blank',
            'noreferrer',
          );
        } catch (e) {
          console.error(e);
        }
        return;
      }
    };

    await loadingPromise(getSSOWithdrawURL());
  });

  return (
    <Stack>
      <Typography variant='body1' mb={1}>
        Instructions
      </Typography>
      <Stack mb={4}>
        <StyledTypography variant='body2' sx={{ marginBottom: '.25rem' }}>
          1. You will be redirected to your Interactive Brokers account to
          initiate this wire. You may need to confirm your receiving bank
          information if you have not set that up yet.
        </StyledTypography>
        <PangeaButton
          size='large'
          onClick={handleGoToIB}
          loading={loadingState.isLoading}
        >
          Go to interactive Brokers
        </PangeaButton>
      </Stack>
      <Stack mb={4} spacing={1}>
        <StyledTypography variant='body2'>
          2. Initiate and confirm your withdrawal.
          {shouldShowSuggestions &&
            ' Please utilize the following amounts to ensure you keep a healthy margin score for the next 30 days:'}
        </StyledTypography>
        {shouldShowSuggestions &&
          Object.keys(SUGGESTED_VALUES).map((key) => {
            const marginProp = key as MarginProp;
            return (
              <Stack direction='row' key={key} justifyContent='space-between'>
                <Typography variant='body2'>
                  {SUGGESTED_VALUES[marginProp]}:
                </Typography>
                <Typography variant='body2'>
                  {formatCurrency(
                    dashboardMarginData[marginProp] ?? 0,
                    domesticCurrency,
                    true,
                    0,
                    0,
                  )}
                </Typography>
              </Stack>
            );
          })}
      </Stack>
      <StyledTypography variant='body2' sx={{ marginBottom: '1.5rem' }}>
        3. Once initiated, your Pangea advisor will review this request. Please
        allow up to 48 hours for this withdrawal to be processed and reflected
        in your current margin health score.
      </StyledTypography>
      <Button variant='outlined' onClick={handleBack}>
        <ArrowBackIcon />
        Back
      </Button>
    </Stack>
  );
};
