import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Pagination, Stack } from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  DataGridPro,
  GridActionsCellItem,
  GridActionsColDef,
  GridColDef,
  GridRowId,
  GridRowParams,
  GridToolbarContainer,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { useQueryClient } from '@tanstack/react-query';
import {
  brokerUniverseCurrenciesState,
  fxFetchingSpotRateState,
  paymentBuyCurrencyState,
  paymentSellCurrencyState,
  paymentspotRateDataState,
  transactionRequestDataState,
} from 'atoms';
import CustomDatePicker from 'components/shared/CustomDatePicker';
import { format, parse } from 'date-fns';
import { useWalletAndPaymentHelpers } from 'hooks';
import { usePaymentInstallmentGridColumns } from 'hooks/usePaymentInstallmentGridColumns';
import {
  CashflowDirectionType,
  PangeaCurrencyResponse,
  PangeaPaymentInstallment,
  getEarliestAllowableStartDate,
} from 'lib';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import {
  useRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import * as uuid from 'uuid';
import { ConfirmCancelDialog, PangeaSimpleDialog } from '../modals';
import { PangeaButton, TransactionAmountControl } from '../shared';

type DeleteConfirmResponseCallback = (val: boolean) => void;

export const PaymentGridInstallment = ({
  rows,
  foreignCurrency,
  onCashflowAdded,
  onCashflowDeleted,
  sellCurrencyDetails,
  buyCurrencyDetails,
  ...dataGridProps
}: {
  rows: PangeaPaymentInstallment[];
  onCashflowAdded: (
    paymentInstallments: PangeaPaymentInstallment[],
    isEdit: boolean,
  ) => void;
  onCashflowDeleted: (id: string, date: Date, amount: number) => void;
  foreignCurrency: NullableString;
  symbol: NullableString;
  direction: CashflowDirectionType;
  sellCurrencyDetails?: PangeaCurrencyResponse | null;
  buyCurrencyDetails?: PangeaCurrencyResponse | null;
}) => {
  const MinStartDate = useMemo(() => getEarliestAllowableStartDate(), []);
  const [cashflowToEdit, setCashflowToEdit] =
    useState<Optional<PangeaPaymentInstallment>>();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const handleDeleteConfirmResponse = useRef<DeleteConfirmResponseCallback>(
    () => {
      return;
    },
  );
  // Grid Handlers
  const apiRef = useGridApiRef();
  const gridCols = usePaymentInstallmentGridColumns(
    ['id', 'sell_currency', 'buy_currency', 'date'],
    sellCurrencyDetails,
    buyCurrencyDetails,
  );
  const fetchingSpotRate = useRecoilValue(fxFetchingSpotRateState);
  const { getPaymentsV2SpotRate, paymentSpotRateRequestPayload } =
    useWalletAndPaymentHelpers();
  const setPaymentSellCurrency = useSetRecoilState(paymentSellCurrencyState);
  const setPaymentBuyCurrency = useSetRecoilState(paymentBuyCurrencyState);
  const resetPaymentspotRateData = useResetRecoilState(
    paymentspotRateDataState,
  );

  const handleDeleteClick = (id: GridRowId) => (event: React.MouseEvent) => {
    event.stopPropagation();
    const row = apiRef.current.getRow(id);
    const isActive = row ? row.isActive : false;
    const deleteInstallment = () => {
      const row = apiRef.current.getRow(id);
      if (row.date < MinStartDate) {
        return;
      }
      onCashflowDeleted(row.internal_uuid, row.date, row.amount);
      apiRef.current.updateRows([{ id: row.id, _action: 'delete' }]);
    };
    if (isActive) {
      handleDeleteConfirmResponse.current = (doDelete: boolean) => {
        doDelete && deleteInstallment();
        setConfirmOpen(false);
      };
      setConfirmOpen(true);
      return;
    } else {
      deleteInstallment();
    }
  };

  const handleAddEditDialogClosed = useEventCallback(
    (savedCashflows: Optional<PangeaPaymentInstallment[]>) => {
      if (savedCashflows && savedCashflows.length > 0) {
        onCashflowAdded(savedCashflows, Boolean(cashflowToEdit));
      }
      setEditDialogOpen(false);
    },
  );

  const updateInstallmentFormRate = () => {
    const sellCurrency = rows[0]?.sell_currency;
    const buyCurrency = rows[0]?.buy_currency;
    if (sellCurrency && buyCurrency) {
      setPaymentSellCurrency(sellCurrency);
      setPaymentBuyCurrency(buyCurrency);
      getPaymentsV2SpotRate({
        ...paymentSpotRateRequestPayload,
        sell_currency: sellCurrency,
        buy_currency: buyCurrency,
      });
    } else {
      resetPaymentspotRateData();
    }
  };

  const columns: GridColDef[] = [
    ...gridCols,
    {
      field: 'actions',
      headerName: '',
      headerAlign: 'center',
      align: 'center',
      width: 25,
      flex: 0.5,
      type: 'actions',
      getActions: ({ id }: GridRowParams<any>) => {
        return [
          <GridActionsCellItem
            key={`deleteIcon${id}`}
            icon={<DeleteIcon />}
            label='Delete'
            onClick={handleDeleteClick(id)}
            color='inherit'
            showInMenu={false}
            placeholder=''
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />,
        ];
      },
      editable: false,
    } as GridActionsColDef,
  ];

  const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
    return (
      <div role='alert'>
        <p>Something went wrong:</p>
        <pre>{error.message}</pre>
        <button onClick={resetErrorBoundary}>Try again</button>
      </div>
    );
  };
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const gridRows = rows!
    .map((r: PangeaPaymentInstallment, index: number) => {
      return {
        amount: r.amount,
        cntr_amount: r.cntr_amount,
        buy_currency: r.buy_currency,
        date: r.date,
        cashflow_id: r.cashflow_id ?? null,
        lock_side: r.lock_side,
        sell_currency: r.sell_currency,
        id: index,
        internal_uuid: r.cashflow_id ?? uuid.v4(),
      };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((r: any, index: number) => {
      r.id = index;
      return r;
    });
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // reset the state of your app so the error doesn't happen again
      }}
    >
      <Box display={'flex'} height={'100%'}>
        <Box flexGrow={1}>
          <DataGridPro
            {...dataGridProps}
            columns={columns}
            rows={gridRows}
            hideFooterPagination
            autoHeight
            apiRef={apiRef}
            sx={{
              '& .MuiFormControl-root.MuiTextField-root ': {
                width: '100%',
                height: '100%',
              },
              '& .MuiInputBase-root.MuiFilledInput-root': {
                minHeight: '100%',
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                textTransform: 'capitalize',
              },
            }}
            components={{
              Footer: EditToolbar2,
            }}
            componentsProps={{
              footer: {
                foreignCurrency,
                onClick: () => {
                  if (!fetchingSpotRate) {
                    updateInstallmentFormRate();
                    setCashflowToEdit(undefined);
                    setEditDialogOpen(true);
                  }
                },
              },
            }}
            onRowDoubleClick={(params) => {
              if (!fetchingSpotRate) {
                updateInstallmentFormRate();
                setCashflowToEdit(params.row);
                setEditDialogOpen(true);
              }
            }}
          />
          <ConfirmCancelDialog
            open={confirmOpen}
            onCancel={() => handleDeleteConfirmResponse.current(false)}
            onClick={() => handleDeleteConfirmResponse.current(true)}
            description="These changes won't take effect until the draft is ExpandCircleDownOutlined."
            title='Delete Installment?'
            cancelButtonText='Cancel'
            confirmButtonText='Delete Installment'
          />
          {editDialogOpen ? (
            <AddEditInstallmentDialog
              open={editDialogOpen}
              onClose={handleAddEditDialogClosed}
              editCashflow={cashflowToEdit}
              nExistingInstallments={rows.length}
              initialSellCurrency={
                rows.length > 0 ? rows[0].sell_currency : null
              }
              initialBuyCurrency={rows.length > 0 ? rows[0].buy_currency : null}
            />
          ) : null}
        </Box>
      </Box>
    </ErrorBoundary>
  );
};

const AddEditInstallmentDialog = ({
  editCashflow,
  open,
  nExistingInstallments,
  onClose,
  initialSellCurrency,
  initialBuyCurrency,
}: {
  editCashflow: Optional<PangeaPaymentInstallment>;
  open: boolean;
  nExistingInstallments: number;
  onClose?(savedCashflows?: Optional<PangeaPaymentInstallment[]>): void;
  initialSellCurrency?: string | null;
  initialBuyCurrency?: string | null;
}) => {
  const newCashflow = (
    sell_currency = 'USD',
    buy_currency?: string | null,
    lock_side = 'USD',
  ) => {
    const c = {
      internal_uuid: uuid.v4(),
      amount: 0,
      cntr_amount: 0,
      sell_currency: sell_currency,
      buy_currency: buy_currency,
      lock_side: lock_side,
    } as unknown as PangeaPaymentInstallment;
    return c;
  };
  const fetchingSpotRate = useRecoilValue(fxFetchingSpotRateState);
  const { getPaymentsV2SpotRate, paymentSpotRateRequestPayload } =
    useWalletAndPaymentHelpers();
  const [, setValidationChecked] = useState(false);
  const queryClient = useQueryClient();

  const [cashflows, setCashflows] = useState<PangeaPaymentInstallment[]>([
    editCashflow ??
      newCashflow(initialSellCurrency ?? 'USD', initialBuyCurrency),
  ]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const brokerUniverseCurrenciesLoadable = useRecoilValueLoadable(
    brokerUniverseCurrenciesState('sell'),
  );
  const isLoadingCurrency =
    brokerUniverseCurrenciesLoadable.state === 'loading';

  const [transactionRequestData, setTransactionRequestData] = useRecoilState(
    transactionRequestDataState,
  );

  const getIsValid = () => {
    if (!currentCashflow) return false;
    return (
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      currentCashflow.amount > 0 && Number(new Date(currentCashflow.date!)) > 0
    );
  };

  const handleChangePage = useEventCallback(
    (_event: React.ChangeEvent<unknown>, value: number) => {
      setCurrentIndex(value - 1);
    },
  );

  const handleClick = useEventCallback((saveClose: boolean) => {
    const formValid = getIsValid();
    if (!formValid) {
      setValidationChecked(true);
      return;
    }
    if (saveClose) {
      onClose?.(cashflows);
      return;
    }
    setCashflows((cfs) => {
      cfs.push(
        newCashflow(
          cashflows[currentIndex].sell_currency,
          cashflows[currentIndex].buy_currency,
          cashflows[currentIndex].lock_side,
        ),
      );
      setValidationChecked(false);
      return cfs;
    });
    setCurrentIndex((i) => i + 1);
  });

  const currentCashflow = cashflows[currentIndex];
  const isEditMode = !!editCashflow;
  const isValid = getIsValid();

  const handleValueDateChange = useCallback(
    (val: any) => {
      setCashflows((currentCashflows) => {
        const modifiedCashflows = [...currentCashflows];
        const cashflowToModify = modifiedCashflows[currentIndex];
        cashflowToModify.date = format(val, 'yyyy-MM-dd');
        return modifiedCashflows;
      });
      getPaymentsV2SpotRate({
        ...paymentSpotRateRequestPayload,
        value_date: format(val, 'yyyy-MM-dd'),
      });

      queryClient.invalidateQueries({
        queryKey: ['paymentTimingOptions'],
      });
    },
    [
      getPaymentsV2SpotRate,
      paymentSpotRateRequestPayload,
      queryClient,
      currentIndex,
    ],
  );

  return (
    <PangeaSimpleDialog
      title='Add/Edit Installment'
      openModal={open}
      onClose={onClose}
      width='525px'
    >
      <Stack spacing={3}>
        <TransactionAmountControl
          onCreateOrUpdateTransaction={async () => undefined}
          transactionRequestData={transactionRequestData}
          setTransactionRequestData={setTransactionRequestData}
          isLoadingCurrency={isLoadingCurrency}
          installmentProps={{
            cashflows: cashflows,
            setCashflows: setCashflows,
            currentIndex: currentIndex,
            nExistingInstallments: nExistingInstallments,
            isEditMode: isEditMode,
          }}
        />
        <Stack flexDirection={'row'} alignItems={'center'} gap={1}>
          <CustomDatePicker
            isDisabled={fetchingSpotRate}
            controlDate={
              cashflows[currentIndex].date
                ? parse(
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    cashflows[currentIndex].date!,
                    'yyyy-MM-dd',
                    new Date(),
                  )
                : null
            }
            handleChange={handleValueDateChange}
            showDateError={false}
          />
        </Stack>
        <Pagination
          count={cashflows.length}
          size='small'
          page={currentIndex + 1}
          onChange={handleChangePage}
          disabled={!isValid}
        />
        <Stack direction='row' justifyContent='space-between'>
          <PangeaButton
            size='large'
            variant='outlined'
            onClick={() => onClose?.()}
            sx={{ minWidth: '120px' }}
          >
            Cancel
          </PangeaButton>
          <Stack direction='row' spacing={2}>
            {!isEditMode ? (
              <PangeaButton
                size='large'
                onClick={() => handleClick(false)}
                sx={{ minWidth: '120px' }}
                variant='outlined'
              >
                Add Another
              </PangeaButton>
            ) : null}
            <PangeaButton
              size='large'
              onClick={() => handleClick(true)}
              sx={{ minWidth: '120px' }}
              variant='contained'
            >
              Save
            </PangeaButton>
          </Stack>
        </Stack>
      </Stack>
    </PangeaSimpleDialog>
  );
};
interface EditToolbarProps2 {
  onClick(): void;
}

const EditToolbar2 = (props: EditToolbarProps2) => {
  return (
    <GridToolbarContainer>
      <Box width={'100%'} textAlign={'center'} margin={3}>
        <Button
          color='primary'
          variant='contained'
          startIcon={<AddIcon />}
          onClick={props.onClick}
          disabled={false}
        >
          Add an Installment Transaction
        </Button>
      </Box>
    </GridToolbarContainer>
  );
};
export default PaymentGridInstallment;
