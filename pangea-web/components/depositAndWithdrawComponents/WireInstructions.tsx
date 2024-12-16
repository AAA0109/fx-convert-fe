import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, Button, Stack, Typography } from '@mui/material';
import { depositRequestDataState, depositSelectionState } from 'atoms';
import { PangeaWireInstruction, formatCurrency } from 'lib';
import { useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';

interface WireInstructionsProps {
  wireInstructions: PangeaWireInstruction;
  handleNextStep: () => void;
}
export const WireInstructions = (props: WireInstructionsProps) => {
  const depositSelection = useRecoilValue(depositSelectionState);
  const depositRequestData = useRecoilValue(depositRequestDataState);
  const { wireInstructions, handleNextStep } = props;
  return (
    <>
      <Box sx={{ marginBottom: '16px' }}>
        <Typography marginBottom={1} variant='body1'>
          Wire Transfer Instructions
        </Typography>
        <Typography
          marginBottom={3}
          color={PangeaColors.SolidSlateLight}
          variant='body2'
        >
          Call your bank or use an online portal to initiate a wire transfer.
          You will need your banking information and the following details:
        </Typography>
        <Box>
          <Box display='flex' marginBottom={2} justifyContent='space-between'>
            <Typography variant='dataLabel'>Bank Name:</Typography>
            <Typography variant='dataBody'>
              {wireInstructions.bank_name}
            </Typography>
          </Box>
          {wireInstructions.bank_address ? (
            <Box display='flex' marginBottom={2} justifyContent='space-between'>
              <Typography variant='dataLabel'>Bank Address:</Typography>
              <Typography
                variant='dataBody'
                textAlign='right'
                dangerouslySetInnerHTML={{
                  __html:
                    wireInstructions.bank_address
                      .replaceAll('\r\n', '\r')
                      .replaceAll('\r', '<br/>') ?? '',
                }}
              ></Typography>
            </Box>
          ) : null}
          {wireInstructions.beneficiary_name ? (
            <Box display='flex' marginBottom={2} justifyContent='space-between'>
              <Typography variant='dataLabel'>Beneficiary Name:</Typography>
              <Typography variant='dataBody'>
                {wireInstructions.beneficiary_name}
              </Typography>
            </Box>
          ) : null}
          {wireInstructions.beneficiary_address ? (
            <Stack
              direction='row'
              //display='inline-block'
              spacing={2}
              marginBottom={2}
              justifyContent='space-between'
            >
              <Typography variant='dataLabel' sx={{ whiteSpace: 'nowrap' }}>
                Beneficiary Address:
              </Typography>
              <Typography
                variant='dataBody'
                textAlign='right'
                dangerouslySetInnerHTML={{
                  __html:
                    wireInstructions.beneficiary_address
                      .replaceAll('\r\n', '\r')
                      .replaceAll('\r', '<br/>') ?? '',
                }}
              ></Typography>
            </Stack>
          ) : null}
          {wireInstructions.beneficiary_account_number ? (
            <Box display='flex' marginBottom={2} justifyContent='space-between'>
              <Typography variant='dataLabel'>
                Beneficiary Account Number:
              </Typography>
              <Typography variant='dataBody'>
                {wireInstructions.beneficiary_account_number}
              </Typography>
            </Box>
          ) : null}
          {wireInstructions.beneficiary_routing_number ? (
            <Box display='flex' marginBottom={2} justifyContent='space-between'>
              <Typography variant='dataLabel'>
                Beneficiary Routing Number:
              </Typography>
              <Typography variant='dataBody'>
                {wireInstructions.beneficiary_routing_number}
              </Typography>
            </Box>
          ) : null}
          {wireInstructions.swift_bic_code ? (
            <Box display='flex' marginBottom={2} justifyContent='space-between'>
              <Typography variant='dataLabel'>
                Beneficiary Routing Number:
              </Typography>
              <Typography variant='dataBody'>
                {wireInstructions.swift_bic_code}
              </Typography>
            </Box>
          ) : null}
          <Box display='flex' marginBottom={2} justifyContent='space-between'>
            <Typography variant='dataLabel'>
              {depositSelection} Deposit:
            </Typography>
            <Typography variant='dataBody'>
              {formatCurrency(depositRequestData.amount, 'USD', true, 0, 0)}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Button variant='contained' onClick={handleNextStep}>
        I have initiated a wire <ArrowForwardIcon />
      </Button>
    </>
  );
};
