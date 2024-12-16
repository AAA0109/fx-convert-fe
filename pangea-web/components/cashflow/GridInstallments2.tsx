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
import { startOfToday } from 'date-fns';
import { useCashflowGridColumns } from 'hooks';
import {
  Cashflow,
  CashflowDirectionType,
  getEarliestAllowableStartDate,
  standardizeDate,
} from 'lib';
import { isUndefined } from 'lodash';
import React, { useMemo, useRef, useState } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { ConfirmCancelDialog, PangeaSimpleDialog } from '../modals';
import { PangeaButton } from '../shared';
import { CreateHedgeCurrencyPricingBlock } from './CreateHedgeCurrencyPricingBlock';
import { CreateHedgeDatePicker } from './CreateHedgeDatePicker';

type DeleteConfirmResponseCallback = (val: boolean) => void;

export const GridInstallments2 = ({
  rows,
  foreignCurrency,
  symbol,
  onCashflowAdded,
  onCashflowDeleted,
  direction,
  ...dataGridProps
}: {
  rows: any[];
  onCashflowAdded: (id: string, date: Date, amount: number) => void;
  onCashflowDeleted: (id: string, date: Date, amount: number) => void;
  foreignCurrency: NullableString;
  symbol: NullableString;
  direction: CashflowDirectionType;
}) => {
  const MinStartDate = useMemo(() => getEarliestAllowableStartDate(), []);
  const [cashflowToEdit, setCashflowToEdit] = useState<Optional<Cashflow>>();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const handleDeleteConfirmResponse = useRef<DeleteConfirmResponseCallback>(
    () => {
      return;
    },
  );

  // Grid Handlers
  const apiRef = useGridApiRef();
  const gridCols = useCashflowGridColumns(
    [
      'sequenceId',
      'internal_uuid',
      'installmentAmount',
      'installmentDomesticAmount',
      'installmentDeliveryDate',
      'isDraft',
    ],
    apiRef,
    symbol,
    foreignCurrency,
  );
  const handleDeleteClick = (id: GridRowId) => (event: React.MouseEvent) => {
    event.stopPropagation();
    const isActive = Boolean(apiRef.current.getRow(id).isActive);
    const deleteInstallment = () => {
      const row = apiRef.current.getRow(id);
      if (row.date < MinStartDate) {
        return;
      }
      onCashflowDeleted(row.id, row.date, row.amount);
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
    (savedCashflows: Optional<Cashflow[]>) => {
      if (savedCashflows && savedCashflows.length > 0) {
        savedCashflows.forEach((c) => {
          if (c.date < MinStartDate) {
            return;
          }
          onCashflowAdded(c.internal_uuid, c.date, c.amount);
        });
      }
      setEditDialogOpen(false);
    },
  );
  const rowShouldBeDisabled = useMemo(
    () =>
      function (c: Cashflow) {
        return (
          c.id > Cashflow.DEFAULT_ID &&
          !c.isFromDraftObject() &&
          c.date < standardizeDate(startOfToday())
        );
      },
    [],
  );
  const columns: GridColDef[] = [
    ...gridCols,
    {
      field: 'actions',
      headerName: 'Delete',
      headerAlign: 'center',
      align: 'center',
      width: 70,
      flex: 1.75,
      type: 'actions',
      getActions: ({ id, row }: GridRowParams<any>) => {
        return [
          <GridActionsCellItem
            key={`deleteIcon${id}`}
            icon={<DeleteIcon />}
            label='Delete'
            onClick={handleDeleteClick(id)}
            color='inherit'
            disabled={rowShouldBeDisabled(row.obj as Cashflow)}
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
  const gridRows = rows
    .map((r) => {
      return {
        date: r.date,
        amount: r.amount,
        id: r.internal_uuid,
        obj: r,
        disabled: rowShouldBeDisabled(r),
      };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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
            }}
            components={{
              Footer: EditToolbar2,
            }}
            componentsProps={{
              footer: {
                foreignCurrency,
                onClick: () => {
                  setCashflowToEdit(undefined);
                  setEditDialogOpen(true);
                },
              },
            }}
            onRowDoubleClick={(params) => {
              if (rowShouldBeDisabled(params.row.obj as Cashflow)) {
                return;
              }
              setCashflowToEdit(params.row.obj);
              setEditDialogOpen(true);
            }}
            columnVisibilityModel={{
              internal_uuid: false,
              amount: false,
              isDraft: false,
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
              foreignCurrency={foreignCurrency ?? 'EUR'}
              open={editDialogOpen}
              onClose={handleAddEditDialogClosed}
              editCashflow={cashflowToEdit}
              direction={direction}
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
  onClose,
  foreignCurrency,
  direction,
}: {
  editCashflow: Optional<Cashflow>;
  open: boolean;
  onClose?(savedCashflows?: Optional<Cashflow[]>): void;
  foreignCurrency: string;
  direction: CashflowDirectionType;
}) => {
  const newCashflow = () => {
    const c = new Cashflow();
    c.currency = foreignCurrency;
    c.direction = direction;
    return c;
  };
  const [validationChecked, setValidationChecked] = useState(false);
  const [cashflows, setCashflows] = useState<Cashflow[]>(
    !isUndefined(editCashflow) ? [editCashflow] : [newCashflow()],
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const getIsValid = () => {
    return currentCashflow.amount > 0 && Number(currentCashflow.date) > 0;
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
      cfs.push(newCashflow());
      setValidationChecked(false);
      return cfs;
    });
    setCurrentIndex((i) => i + 1);
  });
  const currentCashflow = cashflows[currentIndex];
  const isEditMode = !!editCashflow;
  const isValid = getIsValid();
  return (
    <PangeaSimpleDialog
      title='Add/Edit Installment'
      openModal={open}
      onClose={onClose}
    >
      <Stack spacing={3}>
        <CreateHedgeCurrencyPricingBlock
          value={currentCashflow}
          onChange={(hi) => {
            setCashflows((cfs) => {
              cfs.splice(currentIndex, 1, hi as Cashflow);
              return [...cfs];
            });
          }}
          isValidForm={isValid || !validationChecked}
        />
        <CreateHedgeDatePicker
          value={currentCashflow}
          onChange={(hi) => {
            setCashflows((cfs) => {
              cfs.splice(currentIndex, 1, hi as Cashflow);
              return [...cfs];
            });
          }}
          isValidForm={isValid || !validationChecked}
        />
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
  foreignCurrency: NullableString;
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
          disabled={!props.foreignCurrency}
        >
          Add an Installment Transaction
        </Button>
      </Box>
    </GridToolbarContainer>
  );
};
export default GridInstallments2;
