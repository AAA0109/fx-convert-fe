import { ArrowDropDown } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography,
} from '@mui/material';
import {
  DataGridPro,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowParams,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import {
  fxFetchingSpotRateState,
  paymentRfqState,
  paymentspotRateDataState,
} from 'atoms';
import ErrorFallback from 'components/shared/ErrorFallback';
import { parseISO } from 'date-fns';
import format from 'date-fns/format';
import { useWalletAndPaymentHelpers } from 'hooks';
import { usePaymentCashflowGridColumns } from 'hooks/usePaymentCashflowGridColumns';
import { EditedCashflow } from 'lib';
import {
  PangeaCurrencyResponse,
  PangeaDetailedPaymentRfqResponse,
  PangeaInitialMarketStateResponse,
  PangeaSingleCashflow,
} from 'lib/api/v2/data-contracts';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';

export const PaymentGridReview = ({
  rows,
  onCashflowEdited,
  spotInfo,
  sellCurrencyDetails,
  buyCurrencyDetails,
  ...dataGridProps
}: {
  rows: PangeaSingleCashflow[];
  rfqResults?: PangeaDetailedPaymentRfqResponse | null;
  onCashflowEdited: (cashflow: PangeaSingleCashflow) => void;
  spotInfo?: PangeaInitialMarketStateResponse | null;
  sellCurrencyDetails?: PangeaCurrencyResponse | null;
  buyCurrencyDetails?: PangeaCurrencyResponse | null;
}) => {
  const [creditSufficient] = useState(true);
  const paymentRfq = useRecoilValue(paymentRfqState);
  const apiRef = useGridApiRef();
  const {
    isSpotRateExpired,
    paymentSpotRateRequestPayload,
    getPaymentsV2SpotRate,
  } = useWalletAndPaymentHelpers();
  const spotRateData = useRecoilValue(paymentspotRateDataState);
  const fetchingSpotRate = useRecoilValue(fxFetchingSpotRateState);
  const [editedCashflow, setEditedCashflow] = useState<EditedCashflow | null>(
    null,
  );
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    if (!editedCashflow) {
      return;
    }
    if (editedCashflow.lock_side === editedCashflow.buy_currency) {
      handlePaymentAmountChange(editedCashflow.cntr_amount);
    }
    if (editedCashflow.lock_side === editedCashflow.sell_currency) {
      handleSettlementAmountChange(editedCashflow.amount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spotRateData]);

  const handlePaymentAmountChange = debounce(
    useCallback(
      (value: number) => {
        if (!editedCashflow) {
          return;
        }
        if (isSpotRateExpired && !fetchingSpotRate) {
          getPaymentsV2SpotRate({
            ...paymentSpotRateRequestPayload,
            sell_currency: editedCashflow.sell_currency,
            buy_currency: editedCashflow.buy_currency,
          });
        }
        const source = spotRateData?.market.substring(0, 3);
        if (spotRateData) {
          setEditedCashflow({
            ...editedCashflow,
            lock_side: editedCashflow.buy_currency,
            cntr_amount: value,
            amount:
              editedCashflow.buy_currency === source
                ? parseFloat(
                    (spotRateData.rate * Number(value)).toFixed(
                      spotRateData.rate_rounding,
                    ),
                  )
                : parseFloat(
                    (Number(value) / spotRateData.rate).toFixed(
                      spotRateData.rate_rounding,
                    ),
                  ),
          });
        } else if (
          editedCashflow.sell_currency === editedCashflow.buy_currency
        ) {
          setEditedCashflow({
            ...editedCashflow,
            lock_side: editedCashflow.buy_currency,
            amount: value,
            cntr_amount: value,
          });
        }
      },
      [
        fetchingSpotRate,
        getPaymentsV2SpotRate,
        isSpotRateExpired,
        paymentSpotRateRequestPayload,
        spotRateData,
        editedCashflow,
        setEditedCashflow,
      ],
    ),
    200,
  );

  const handleSettlementAmountChange = debounce(
    useCallback(
      (value: number) => {
        if (!editedCashflow) {
          return;
        }
        if (isSpotRateExpired && !fetchingSpotRate) {
          getPaymentsV2SpotRate({
            ...paymentSpotRateRequestPayload,
            sell_currency: editedCashflow.sell_currency,
            buy_currency: editedCashflow.buy_currency,
          });
        }
        if (spotRateData) {
          const source = spotRateData?.market.substring(0, 3);
          setEditedCashflow({
            ...editedCashflow,
            lock_side: editedCashflow.sell_currency,
            amount: value,
            cntr_amount:
              editedCashflow.sell_currency === source
                ? parseFloat(
                    (spotRateData.rate * Number(value)).toFixed(
                      spotRateData.rate_rounding,
                    ),
                  )
                : parseFloat(
                    (Number(value) / spotRateData.rate).toFixed(
                      spotRateData.rate_rounding,
                    ),
                  ),
          });
        } else if (
          editedCashflow.sell_currency === editedCashflow.buy_currency
        ) {
          setEditedCashflow({
            ...editedCashflow,
            lock_side: editedCashflow.sell_currency,
            amount: value,
            cntr_amount: value,
          });
        }
      },
      [
        fetchingSpotRate,
        getPaymentsV2SpotRate,
        isSpotRateExpired,
        paymentSpotRateRequestPayload,
        spotRateData,
        editedCashflow,
        setEditedCashflow,
      ],
    ),
    200,
  );

  const gridCols = usePaymentCashflowGridColumns(
    [
      'value_date',
      'sell_currency',
      'buy_currency',
      'all_in_rate',
      'spot_rate',
      'forward_points',
      'broker_fee',
      'transaction_date',
    ],
    editedCashflow,
    setEditedCashflow,
    handleSettlementAmountChange,
    handlePaymentAmountChange,
    editId,
    spotInfo,
    sellCurrencyDetails,
    buyCurrencyDetails,
  );

  const resetGridInput = () => {
    setEditId(null);
    setEditedCashflow(null);
  };

  const handleEditClick = (id: GridRowId) => () => {
    const cashflow = rows.filter((item) => item.cashflow_id === id);
    if (cashflow) {
      setEditedCashflow({
        id: cashflow[0].cashflow_id,
        date: parseISO(cashflow[0].pay_date),
        amount: cashflow[0].amount,
        cntr_amount: cashflow[0].cntr_amount,
        sell_currency: cashflow[0].sell_currency,
        buy_currency: cashflow[0].buy_currency,
        lock_side: cashflow[0].lock_side,
      } as unknown as EditedCashflow);
    }
    setEditId(id.toString());
  };

  const handleSaveClick = (id: GridRowId) => () => {
    if (editedCashflow) {
      const payDate = format(editedCashflow.date, 'yyyy-MM-dd');
      const row = rows.filter((item) => item.cashflow_id === id);
      if (row) {
        onCashflowEdited({
          amount: editedCashflow.amount,
          cntr_amount: editedCashflow.cntr_amount,
          buy_currency: row[0].buy_currency,
          sell_currency: row[0].sell_currency,
          lock_side: editedCashflow.lock_side,
          pay_date: payDate,
          cashflow_id: row[0].cashflow_id,
        } as PangeaSingleCashflow);
      }
      resetGridInput();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCancelClick = (_id: GridRowId) => () => {
    resetGridInput();
  };

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event,
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const columns: GridColDef[] = [
    ...gridCols,
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      minWidth: 70,
      cellClassName: 'actions',
      getActions: ({ id }: GridRowParams<any>) => {
        const isInEditMode = id === editId;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={'cancel-action'}
              icon={<CloseIcon sx={{ color: PangeaColors.RiskBerryMedium }} />}
              label='Cancel'
              className='textPrimary'
              onClick={handleCancelClick(id)}
              color='inherit'
              showInMenu={false}
              placeholder=''
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />,
            <GridActionsCellItem
              key={'save-action'}
              icon={<CheckIcon sx={{ color: PangeaColors.NoteGreenMedium }} />}
              label='Save'
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
              showInMenu={false}
              placeholder=''
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key={'edit-action'}
            icon={<EditIcon sx={{ color: PangeaColors.Gray }} />}
            label='Edit'
            className='textPrimary'
            onClick={handleEditClick(id)}
            color='inherit'
            showInMenu={false}
            placeholder=''
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />,
        ];
      },
    } as GridColDef,
  ];

  const gridRows = rows
    .map((r: PangeaSingleCashflow) => {
      const usedRfq = paymentRfq?.success.filter(
        (item) => item.cashflow_id == r.cashflow_id,
      );
      const cashflowRfq = isSpotRateExpired
        ? null
        : usedRfq && usedRfq.length > 0
        ? usedRfq[0]
        : null;
      let transactionDate = cashflowRfq ? cashflowRfq.value_date : null;
      if (r.transaction_date) {
        transactionDate = r.transaction_date;
      }
      return {
        amount: r.amount,
        cntr_amount: cashflowRfq?.transaction_amount ?? null,
        buy_currency: r.buy_currency,
        value_date: r.pay_date,
        cashflow_id: r.cashflow_id ?? null,
        lock_side: r.lock_side,
        sell_currency: r.sell_currency,
        id: r.cashflow_id,
        internal_uuid: r.cashflow_id,
        all_in_rate: cashflowRfq ? cashflowRfq.external_quote : null,
        spot_rate: cashflowRfq ? cashflowRfq.spot_rate : null,
        forward_points: cashflowRfq ? cashflowRfq.fwd_points : null,
        broker_fee: cashflowRfq ? cashflowRfq.broker_fee : null,
        pangea_fee: cashflowRfq ? cashflowRfq.pangea_fee : null,
        transaction_date: transactionDate,
      };
    })
    .sort(
      (a, b) =>
        new Date(a.value_date).getTime() - new Date(b.value_date).getTime(),
    );

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // reset the state of your app so the error doesn't happen again
      }}
    >
      <Stack
        flexDirection={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Typography
          variant='caption'
          fontSize={16}
          pb={1}
          color={PangeaColors.BlackSemiTransparent87}
        >
          Transaction Details
        </Typography>
      </Stack>
      <Box display={'flex'} height={'100%'}>
        <Box flexGrow={1}>
          <DataGridPro
            {...dataGridProps}
            columns={columns}
            rows={gridRows}
            hideFooterPagination
            onRowEditStop={handleRowEditStop}
            disableColumnMenu={true}
            disableMultipleColumnsSorting={true}
            hideFooter={true}
            disableSelectionOnClick={true}
            isCellEditable={(params) => params.row.id === editId}
            autoHeight
            pinnedColumns={{ right: ['actions'] }}
            apiRef={apiRef}
            pagination={false}
            sx={{
              '& .MuiFormControl-root.MuiTextField-root ': {
                width: '100%',
                height: '100%',
              },
              '& .MuiInputBase-root.MuiFilledInput-root': {
                minHeight: '100%',
              },
              '&, [class^=MuiDataGrid]': { border: 'none' },
              '& .MuiDataGrid-columnHeaderTitle': {
                textTransform: 'capitalize',
              },
            }}
          />
        </Box>
      </Box>
      <Stack display={'none'}>
        <Box
          border={1}
          borderRadius={2}
          padding={2}
          borderColor={PangeaColors.Gray}
        >
          <Box
            flexGrow={1}
            sx={{
              fontFamily: 'SuisseIntlCond',
              textTransform: 'capitalize',
            }}
          >
            <Accordion sx={{ background: 'transparent' }}>
              <AccordionSummary
                expandIcon={<ArrowDropDown />}
                aria-controls='panel1-content'
              >
                <div>
                  <Typography color={PangeaColors.Gray}>Credit</Typography>
                  <Typography>
                    {creditSufficient ? 'SUFFICIENT' : 'NOT SUFFICIENT'}
                  </Typography>
                </div>
              </AccordionSummary>
              <AccordionDetails>What&apos;s inside?</AccordionDetails>
            </Accordion>
          </Box>
        </Box>
      </Stack>
    </ErrorBoundary>
  );
};

export default PaymentGridReview;
