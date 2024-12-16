import { Stack, Typography } from '@mui/material';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { allBulkTransactionItemsState } from 'atoms';
import { format } from 'date-fns';
import { PangeaExecutionTimingEnum } from 'lib';
import { useRecoilValue } from 'recoil';

export const PaymentBulkReview = () => {
  const allCreatedBulkTransactions = useRecoilValue(
    allBulkTransactionItemsState,
  );

  const spotTransactions = allCreatedBulkTransactions.payments.filter(
    (p) =>
      p?.execution_timing &&
      [
        PangeaExecutionTimingEnum.ImmediateSpot,
        PangeaExecutionTimingEnum.ScheduledSpot,
        PangeaExecutionTimingEnum.StrategicSpot,
      ].includes(p.execution_timing),
  );
  const scheduledTransactions = allCreatedBulkTransactions.payments.filter(
    (p) =>
      p?.execution_timing &&
      [
        PangeaExecutionTimingEnum.ScheduledSpot,
        PangeaExecutionTimingEnum.StrategicForward,
        PangeaExecutionTimingEnum.StrategicNdf,
        PangeaExecutionTimingEnum.StrategicSpot,
      ].includes(p.execution_timing),
  );
  return (
    <Stack direction='column' rowGap={6}>
      <Stack direction='column'>
        <Typography variant='body1'>Immediate Spot Transactions</Typography>
        <Typography variant='dataBody' mb={4}>
          The following transactions will be executed as spot transactions to be
          executed immediately at the latest rate.
        </Typography>

        <DataGridPro
          rows={spotTransactions}
          columns={[
            { field: 'sell_currency', headerName: 'Sell', flex: 1.5 },
            { field: 'buy_currency', headerName: 'Buy', flex: 1.5 },
            {
              field: 'spot_rate',
              headerName: 'All in Rate',
              flex: 1,
              renderCell: (params) => {
                return params.value ?? 'TBD';
              },
            },
            { field: 'fee', headerName: 'Broker Fee', flex: 1 },
            {
              field: 'cashflows',
              headerName: 'Trans. Date',
              flex: 1,
              renderCell: (params) => {
                const date = params.row?.cashflows?.[0]?.pay_date;
                return date ? format(new Date(date), 'yyyy-MM-dd') : '-';
              },
            },
            { field: 'delivery_date', headerName: 'Value Date', flex: 1 },
          ]}
          pagination={false}
          autoHeight
        />
      </Stack>
      <Stack>
        <Typography variant='body1'>Scheduled Spot Transactions</Typography>
        <Typography variant='dataBody' mb={4}>
          Pangea&apos;s AI will strategically execute these scheduled
          transactions at the most optimal time to ensure the most cost
          efficient and timely delivery.
        </Typography>

        <DataGridPro
          rows={scheduledTransactions}
          columns={[
            { field: 'sell_currency', headerName: 'Sell', flex: 1.5 },
            { field: 'buy_currency', headerName: 'Buy', flex: 1.5 },
            {
              field: 'all_in_rate',
              headerName: 'All in Rate',
              flex: 1,
              renderCell: (params) => {
                return params.value ?? 'TBD';
              },
            },
            { field: 'fee', headerName: 'Broker Fee', flex: 1 },
            {
              field: 'cashflows',
              headerName: 'Trans. Date',
              flex: 1,
              renderCell: (params) => {
                const date = params.row?.cashflows?.[0]?.pay_date;
                return date ? format(new Date(date), 'yyyy-MM-dd') : '-';
              },
            },
            { field: 'delivery_date', headerName: 'Value Date', flex: 1 },
          ]}
          pagination={false}
          autoHeight
        />
      </Stack>
    </Stack>
  );
};

export default PaymentBulkReview;
