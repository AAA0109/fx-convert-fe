import CloseIcon from '@mui/icons-material/Close';
import {
  DialogTitle,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { transactionRequestDataState } from 'atoms';
import PaymentChartYourRisk from 'components/explore/PaymentChartYourRisk';
import PriceHistory from 'components/explore/priceHistory';
import { PangeaButton } from 'components/shared';
import { useFeatureFlags } from 'hooks';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';

interface RiskInsightProps {
  onCloseModal: () => void;
  amountRounding?: number;
}

const RiskInsight: React.FC<RiskInsightProps> = ({
  onCloseModal,
  amountRounding = 0,
}) => {
  const [view, setView] = useState('historical');
  const transactionData = useRecoilValue(transactionRequestDataState);
  const [source, destination] = [
    transactionData.settlement_currency,
    transactionData.payment_currency,
  ];
  const { isFeatureEnabled } = useFeatureFlags();
  const isRiskInsightResctrictionEnabled = isFeatureEnabled(
    'risk-usd-restriction',
  );
  return (
    <Stack minWidth={400}>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
        }}
      >
        <Typography variant='h4' component='span'>
          Risk Insight
        </Typography>

        <IconButton
          aria-label='close'
          onClick={() => onCloseModal()}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Stack>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(
            _event: React.MouseEvent<HTMLElement>,
            passedValue: 'historical' | 'projected',
          ) => {
            setView(passedValue);
          }}
          sx={{
            '& .MuiButtonBase-root': {
              width: '50%',
              fontSize: '16px',
              borderColor: PangeaColors.BlackSemiTransparent50,
            },
          }}
        >
          <ToggleButton value='historical' disabled={view === 'historical'}>
            Historical View
          </ToggleButton>
          <ToggleButton
            disabled={
              (isRiskInsightResctrictionEnabled &&
                ![source, destination].includes('USD')) ||
              view === 'projected'
            }
            value='projected'
          >
            Projected View
          </ToggleButton>
        </ToggleButtonGroup>
        <>
          {view === 'historical' ? (
            <PriceHistory
              interval={'1 month'}
              mnemonic={`${source}/${destination}`}
              amountRounding={amountRounding}
            />
          ) : (
            <>
              <PaymentChartYourRisk />
            </>
          )}
        </>
      </Stack>
      <Stack mt={4}>
        <PangeaButton onClick={() => onCloseModal()} variant='outlined'>
          Close
        </PangeaButton>
      </Stack>
    </Stack>
  );
};

export default RiskInsight;
