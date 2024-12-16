import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';
import { cashflowInstallmentTransactionsState, currenciesState } from 'atoms';
import { useCashflowGridColumns } from 'hooks';
import { BaseHedgeItem, formatCurrency } from 'lib';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';

interface CashFlowDetailProps {
  cashflow: BaseHedgeItem;
  borderedRows?: boolean;
  showDrafts?: boolean;
}

export const CashflowDetails = ({
  cashflow,
  borderedRows = false,
  showDrafts = true,
}: CashFlowDetailProps) => {
  const hedgeDirection = cashflow.direction;
  const foreignCurrency = cashflow.currency;
  const hedgeFrequency = cashflow.type;
  const hedgeFrequencyDisplay = cashflow.frequencyDisplayText;
  const hedgeEndDate = cashflow.endDate;
  const paymentDate = cashflow.dateDisplay;
  const cashflowInstallmentTransactions = useRecoilValue(
    cashflowInstallmentTransactionsState(showDrafts),
  );
  const currencies = useRecoilValue(currenciesState);
  const [open, setOpen] = useState(false);
  const handleOpenClose = useEventCallback(() =>
    setOpen((prevVal) => !prevVal),
  );
  const apiRef = useGridApiRef();
  const gridCols = useCashflowGridColumns(
    ['sequenceId', 'installmentAmount', 'installmentDeliveryDate'],
    apiRef,
    currencies[cashflow.currency ?? 'USD'].symbol,
    foreignCurrency,
  );

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={
          borderedRows
            ? {
                border: `1px solid ${PangeaColors.Gray}`,
                borderRadius: `4px`,
                borderBottom: 0,
                '& .MuiGrid-item': {
                  borderBottom: `1px solid ${PangeaColors.Gray}`,
                  padding: `16px`,
                },
                '& .MuiGrid-root.MuiGrid-container': {
                  marginLeft: 0,
                },
              }
            : {
                '& .MuiGrid-item': {
                  padding: `16px`,
                },
                '& .MuiGrid-root.MuiGrid-container': {
                  marginLeft: 0,
                },
              }
        }
      >
        <Grid item xs={4}>
          <Typography>Direction:</Typography>
        </Grid>
        <Grid item xs={8} textAlign='right'>
          <Typography sx={{ textTransform: 'capitalize' }}>
            {hedgeDirection}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>Currency:</Typography>
        </Grid>
        <Grid item xs={8} textAlign='right'>
          <Typography>{foreignCurrency}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>Amount:</Typography>
        </Grid>
        <Grid item xs={8} textAlign='right'>
          <Typography>
            {formatCurrency(
              cashflow.amount,
              foreignCurrency ?? 'USD',
              false,
              2,
              2,
              false,
            )}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>Payment Type:</Typography>
        </Grid>
        <Grid item xs={8} textAlign='right'>
          <Typography sx={{ textTransform: 'capitalize' }}>
            {hedgeFrequencyDisplay}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>
            {hedgeFrequency === 'recurring' ? (
              <>Payment Schedule:</>
            ) : (
              <>Payment Date:</>
            )}
          </Typography>
        </Grid>
        <Grid item xs={8} textAlign='right'>
          <Typography>
            {paymentDate == 'Various' ? (
              <>
                <Button variant='outlined' onClick={handleOpenClose}>
                  {paymentDate}
                </Button>
              </>
            ) : (
              paymentDate
            )}
          </Typography>
        </Grid>
        {hedgeFrequency !== 'onetime' && (
          <>
            <Grid item xs={4}>
              <Typography>End Date:</Typography>
            </Grid>
            <Grid item xs={8} textAlign='right'>
              <Typography>
                <>{hedgeEndDate.toLocaleDateString()}</>
              </Typography>
            </Grid>
          </>
        )}
      </Grid>
      <Dialog
        open={open}
        onClose={handleOpenClose}
        maxWidth={false}
        fullWidth={false}
      >
        <DialogTitle>
          <Typography variant='h4' component='span'>
            Installment Schedule
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box maxHeight={460} height={460} width={520}>
            <DataGridPro
              apiRef={apiRef}
              autoHeight={true}
              pagination={true}
              pageSize={8}
              rowsPerPageOptions={[8]}
              columns={gridCols}
              rows={cashflowInstallmentTransactions}
            ></DataGridPro>
          </Box>

          <Container>
            <Button size='large' variant='text' onClick={handleOpenClose}>
              Close
            </Button>
          </Container>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default CashflowDetails;
