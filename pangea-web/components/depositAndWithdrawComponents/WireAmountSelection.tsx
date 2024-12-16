import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Typography } from '@mui/material';
import { depositRequestDataState } from 'atoms';
import { PangeaButton } from 'components/shared';
import { MINIMUM_DEPOSIT_AMOUNT } from 'lib';
import { useRecoilValue } from 'recoil';
import { MarginAmountOptions } from './MarginAmountOptions';

interface WireAmountSelectionProps {
  requiredAmt: number;
  recommendedAmt: number;
  confirmWireTransfer: () => void;
  handleBackStep: () => void;
  loading: boolean;
}
export const WireAmountSelection = (props: WireAmountSelectionProps) => {
  const {
    loading,
    requiredAmt,
    recommendedAmt,
    confirmWireTransfer,
    handleBackStep,
  } = props;
  const depositData = useRecoilValue(depositRequestDataState);
  return (
    <>
      <Box sx={{ marginBottom: '16px' }}>
        <Typography variant='body1' mb={3}>
          Great, how much did you wire?
        </Typography>
        <MarginAmountOptions
          recommendedAmt={recommendedAmt}
          requiredAmt={requiredAmt}
        />
      </Box>
      <PangeaButton
        loading={loading}
        variant='contained'
        onClick={confirmWireTransfer}
        disabled={depositData.amount < MINIMUM_DEPOSIT_AMOUNT}
      >
        Confirm
      </PangeaButton>
      <Button
        sx={{ marginTop: '16px' }}
        variant='outlined'
        onClick={handleBackStep}
      >
        <ArrowBackIcon />
        Back
      </Button>
    </>
  );
};
