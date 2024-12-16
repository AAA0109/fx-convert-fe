import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForward from '@mui/icons-material/ArrowForward';
import DeleteForever from '@mui/icons-material/DeleteForever';
import ModeIcon from '@mui/icons-material/Mode';
import KabobIcon from '@mui/icons-material/MoreHoriz';
import {
  ButtonProps,
  IconButton,
  Menu,
  MenuItem,
  MenuItemProps,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import useEventCallback from '@mui/utils/useEventCallback';
import { GridColDef } from '@mui/x-data-grid';
import {
  DataGridPro,
  GridLinkOperator,
  GridRenderCellParams,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { useQueryClient } from '@tanstack/react-query';
import {
  clientApiState,
  existingPaymentIdState,
  pangeaAlertNotificationMessageState,
} from 'atoms';
import { ConfirmCancelDialog } from 'components/modals';
import {
  CustomBaseTextField,
  CustomSearchControl,
  FeatureFlag,
  PangeaButton,
  PangeaLoading,
  PaymentStatusChip,
} from 'components/shared';
import { format, parseISO } from 'date-fns';
import {
  useCacheableAsyncData,
  useLoading,
  useWalletAndPaymentHelpers,
} from 'hooks';
import {
  PangeaPayment,
  PangeaPaymentStatusEnum,
  formatCurrency,
  setAlpha,
} from 'lib';
import { isError } from 'lodash';
import router from 'next/router';
import * as React from 'react';
import { memo, useCallback, useMemo, useState } from 'react';
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { PangeaColors, customTheme } from 'styles';

const StyledMenuItem = styled(MenuItem)<MenuItemProps>({
  textTransform: 'none',
});

const GridActionsMenu = ({
  id,
  status,
}: {
  status?: PangeaPaymentStatusEnum;
  id: number;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const api = useRecoilValue(clientApiState);
  const setPangeaNotification = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );
  const resetExistingPaymentId = useResetRecoilState(existingPaymentIdState);

  const queryClient = useQueryClient();
  const apiHelper = api.getAuthenticatedApiHelper();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const {
    loadingPromise: cancelPaymentPromise,
    loadingState: cancelPaymentLoadingState,
  } = useLoading();

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCancelPaymentDialogClosed = useEventCallback(() => {
    setCancelDialogOpen(false);
  });
  const handlePaymentsPageClick = useEventCallback(() => {
    router.push(`/payments/view?id=${id}`);
  });
  const handleEditPayment = useEventCallback(() => {
    resetExistingPaymentId();
    router.push(`/transactions/payments?id=${id}`);
  });
  const handleCancelPayment = useEventCallback(() => {
    handleClose();
    setCancelDialogOpen(true);
  });
  const handleCancelPaymentConfirmed = useEventCallback(async () => {
    cancelPaymentPromise(
      (async () => {
        const deletePaymentResponse = await apiHelper.deletePaymentByIdAsync(
          id,
        );
        if (isError(deletePaymentResponse)) {
          setPangeaNotification({
            text: 'Error occurred while cancelling payment',
            severity: 'error',
          });
          return;
        }
        setPangeaNotification({
          text: 'Payment cancelled successfully',
          severity: 'success',
        });
        queryClient.invalidateQueries({
          queryKey: ['dashboardTransactions'],
        });
        setCancelDialogOpen(false);
      })(),
    );
  });
  return (
    <>
      <IconButton
        aria-label='more'
        id='long-button'
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup='true'
        onClick={handleClick}
      >
        <KabobIcon />
      </IconButton>
      <Menu
        id='long-menu'
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <StyledMenuItem onClick={handlePaymentsPageClick}>
          <ArrowForward sx={{ paddingRight: '32px' }} />
          View payment details
        </StyledMenuItem>
        {(() => {
          if (
            status &&
            [
              PangeaPaymentStatusEnum.Scheduled,
              PangeaPaymentStatusEnum.Working,
              PangeaPaymentStatusEnum.Drafting,
            ].includes(status)
          ) {
            return (
              <StyledMenuItem onClick={handleEditPayment}>
                <ModeIcon sx={{ paddingRight: '32px' }} />
                Edit payment
              </StyledMenuItem>
            );
          }
        })()}
        {(() => {
          if (
            status &&
            [
              PangeaPaymentStatusEnum.Scheduled,
              PangeaPaymentStatusEnum.Working,
              PangeaPaymentStatusEnum.AwaitingFunds,
              PangeaPaymentStatusEnum.Drafting,
            ].includes(status)
          ) {
            return (
              <StyledMenuItem onClick={handleCancelPayment}>
                <DeleteForever sx={{ paddingRight: '32px' }} />
                Cancel payment
              </StyledMenuItem>
            );
          }
        })()}
      </Menu>
      <ConfirmCancelDialog
        title='Cancel Payment?'
        open={cancelDialogOpen}
        description='Are you sure your want to cancel this payment? This action cannot be undone.'
        confirmButtonColorOverride={PangeaColors.RiskBerryMedium}
        onClick={handleCancelPaymentConfirmed}
        onCancel={handleCancelPaymentDialogClosed}
        cancelButtonText='Abort'
        cancelButtonProps={{
          variant: 'text',
          disabled: cancelPaymentLoadingState.isLoading,
        }}
        confirmButtonText='Cancel Payment'
        confirmButtonProps={
          {
            color: 'error',
            loading: cancelPaymentLoadingState.isLoading,
          } as Partial<ButtonProps>
        }
        preventBackdropClose
      />
    </>
  );
};

const GridComponent = memo(function GridComponent({
  paymentRows,
  isLoading,
}: {
  paymentRows?: PangeaPayment[];
  isLoading?: boolean;
}) {
  const [pageSize, setPageSize] = useState(10);
  const [filterPayments, setFilterPayments] = useState<
    'All' | 'Completed' | 'In Progress' | 'Scheduled'
  >('All');

  const uiFilterMap: Record<
    'All' | 'Completed' | 'In Progress' | 'Scheduled',
    PangeaPaymentStatusEnum[]
  > = useMemo(
    () => ({
      All: [
        PangeaPaymentStatusEnum.AwaitingFunds,
        PangeaPaymentStatusEnum.Delivered,
        PangeaPaymentStatusEnum.Working,
        PangeaPaymentStatusEnum.Scheduled,
        PangeaPaymentStatusEnum.Booked,
        PangeaPaymentStatusEnum.InTransit,
        PangeaPaymentStatusEnum.Canceled,
        PangeaPaymentStatusEnum.Failed,
        PangeaPaymentStatusEnum.Drafting,
        PangeaPaymentStatusEnum.PendAuth,
        PangeaPaymentStatusEnum.SettlementIssue,
        PangeaPaymentStatusEnum.StrategicExecution,
      ],
      Completed: [PangeaPaymentStatusEnum.Delivered],
      'In Progress': [
        PangeaPaymentStatusEnum.Working,
        PangeaPaymentStatusEnum.AwaitingFunds,
        PangeaPaymentStatusEnum.Booked,
        PangeaPaymentStatusEnum.InTransit,
      ],
      Scheduled: [PangeaPaymentStatusEnum.Scheduled],
    }),
    [],
  );

  const { allWallets, beneficiaryAccounts, settlementAccounts } =
    useWalletAndPaymentHelpers();

  const gridApiRef = useGridApiRef();
  const handleFilterChange = useCallback(
    (
      _event: React.MouseEvent<HTMLElement>,
      uiFilter: 'All' | 'Completed' | 'In Progress' | 'Scheduled',
    ) => {
      setFilterPayments(uiFilter);
      gridApiRef.current.hideFilterPanel();
      gridApiRef.current.setFilterModel({
        items: uiFilterMap[uiFilter].map((status) => ({
          columnField: 'payment_status',
          operatorValue: 'contains',
          value: status,
          id: status,
        })),
        linkOperator: GridLinkOperator.Or,
      });
    },
    [gridApiRef, uiFilterMap],
  );
  const handleExportCSV = useCallback(() => {
    gridApiRef.current.exportDataAsCsv();
  }, [gridApiRef]);
  const columns: GridColDef<PangeaPayment>[] = useMemo(
    () => [
      {
        field: 'modified',
        headerName: 'Transaction Date',
        type: 'date',

        valueFormatter: (params: any) => {
          return params.value;
        },
        renderCell: ({ row: { modified } }) => (
          <Typography variant='dataBody'>
            {format(parseISO(modified), 'M/dd/yy')}
          </Typography>
        ),
      },
      {
        field: 'payment_id',
        headerName: 'Payment ID',
        type: 'string',
      },
      {
        field: 'delivery_date',
        headerName: 'Value Date',
        type: 'date',
        valueFormatter: (params: any) => {
          return params.value;
        },
        renderCell: ({ row: { delivery_date, payment_status } }) => {
          const shouldGreyOut = [
            PangeaPaymentStatusEnum.Working,
            PangeaPaymentStatusEnum.Scheduled,
          ].includes(payment_status);
          return (
            <Typography
              variant='dataBody'
              sx={{
                color: shouldGreyOut ? setAlpha('#000', 0.38) : 'inherit',
                display: 'flex',
                flexDirection: 'row',
                columnGap: 0.5,
                alignItems: 'center',
              }}
            >
              {delivery_date ? format(parseISO(delivery_date), 'M/dd/yy') : '-'}
              {shouldGreyOut ? <AccessTimeIcon /> : null}
            </Typography>
          );
        },
      },
      {
        field: 'payment_status',
        headerName: 'Status',
        renderCell: ({ row: { payment_status } }) => (
          <PaymentStatusChip status={payment_status} />
        ),
      },
      {
        field: 'cashflow_id',
        headerName: 'Description',
        valueGetter: (params) => {
          const {
            row: { cashflows },
          } = params;
          if (cashflows.length > 0) {
            return cashflows[0].name;
          }
          return '-';
        },
        flex: 1.2,
      },
      {
        field: 'buy_currency',
        headerName: 'Buy',
        valueGetter: (params) => {
          const {
            row: { amount, buy_currency, lock_side, cntr_amount },
          } = params;
          if (lock_side === buy_currency) {
            if (amount === undefined) {
              return '-';
            }
            return formatCurrency(amount, buy_currency);
          }
          if (cntr_amount === undefined) {
            return '-';
          }
          return formatCurrency(cntr_amount, buy_currency);
        },
      },
      {
        field: 'sell_currency',
        headerName: 'Sell',
        valueGetter: (params) => {
          const {
            row: { amount, cntr_amount, lock_side, sell_currency },
          } = params;
          if (lock_side === sell_currency) {
            if (amount === undefined) {
              return '-';
            }
            return formatCurrency(amount, sell_currency);
          }
          if (cntr_amount === undefined) {
            return '-';
          }
          return formatCurrency(cntr_amount, sell_currency);
        },
      },
      {
        field: 'origin_account_id',
        headerName: 'Origin',
        type: 'string',
        valueGetter: (params) => {
          const {
            row: { origin_account_id, sell_currency },
          } = params;

          const accountAsWallet = allWallets.find(
            ({ wallet_id }) => wallet_id === origin_account_id,
          );
          if (accountAsWallet) {
            const { name } = accountAsWallet;
            return name;
          }

          const accountAsSettlementAccount = settlementAccounts.find(
            ({ wallet_id }) => wallet_id === origin_account_id,
          );
          if (accountAsSettlementAccount) {
            const { name } = accountAsSettlementAccount;
            return name;
          }

          return `${sell_currency ?? '-'} - ${
            origin_account_id ? origin_account_id : 'Source'
          }`;
        },
        flex: 1.2,
        renderCell: ({ value, row: { sell_currency, payment_status } }) => {
          const shouldGreyOut = [
            PangeaPaymentStatusEnum.Working,
            PangeaPaymentStatusEnum.Booked,
            PangeaPaymentStatusEnum.Scheduled,
          ].includes(payment_status);
          return (
            <Typography
              variant='dataBody'
              sx={{ color: shouldGreyOut ? setAlpha('#000', 0.38) : 'inherit' }}
            >
              {shouldGreyOut
                ? `${value ?? sell_currency + ' - Pending'}`
                : value}
            </Typography>
          );
        },
      },
      {
        field: 'destination_account_id',
        headerName: 'Destination',
        type: 'string',
        valueGetter: (params) => {
          const {
            row: { destination_account_id, buy_currency },
          } = params;
          const accountAsWallet = allWallets.find(
            ({ wallet_id }) => wallet_id === destination_account_id,
          );
          if (accountAsWallet) {
            const { name } = accountAsWallet;
            return name;
          }
          const accountAsBeneficiaryAccount = beneficiaryAccounts.find(
            ({ beneficiary_id }) => beneficiary_id === destination_account_id,
          );
          if (accountAsBeneficiaryAccount) {
            const { beneficiary_name, destination_currency, bank_name } =
              accountAsBeneficiaryAccount;
            return `${beneficiary_name} - ${destination_currency} - ${bank_name}`;
          }
          return `${buy_currency ?? '-'} - ${
            destination_account_id ? destination_account_id : 'Destination'
          }`;
        },
        flex: 1.2,
        renderCell: ({ value, row: { buy_currency, payment_status } }) => {
          const shouldGreyOut = [
            PangeaPaymentStatusEnum.Working,
            PangeaPaymentStatusEnum.Booked,
            PangeaPaymentStatusEnum.Scheduled,
          ].includes(payment_status);
          return (
            <Typography
              variant='dataBody'
              sx={{ color: shouldGreyOut ? setAlpha('#000', 0.38) : 'inherit' }}
            >
              {shouldGreyOut
                ? `${value ?? buy_currency + ' - Pending'}`
                : value}
            </Typography>
          );
        },
      },
    ],
    [allWallets, beneficiaryAccounts, settlementAccounts],
  );
  const onPageSizeChange = React.useCallback(
    (newPageSize: number) =>
      pageSize !== newPageSize && setPageSize(newPageSize),
    [pageSize],
  );
  const transactionColumns: GridColDef[] = [
    ...columns,
    {
      field: 'actions',
      headerName: '',
      filterable: false,
      flex: 0.1,
      renderCell: (params: GridRenderCellParams) => (
        <GridActionsMenu
          status={params.row.payment_status}
          id={params.row.id}
        />
      ),
    },
  ];
  return gridApiRef ? (
    <Stack
      rowGap={2}
      padding='1.5rem .75rem'
      border={`1px solid ${PangeaColors.Gray}`}
      borderRadius={1}
    >
      <Stack
        direction='row'
        alignItems='flex-start'
        justifyContent='space-between'
      >
        <ToggleButtonGroup
          color='primary'
          value={filterPayments}
          exclusive
          onChange={handleFilterChange}
          aria-label='Platform'
          sx={{ height: '2.25rem', '> button': { fontSize: '0.875rem' } }}
        >
          <ToggleButton value='All' disabled={filterPayments === 'All'}>
            All
          </ToggleButton>
          <ToggleButton
            value='Completed'
            disabled={filterPayments === 'Completed'}
          >
            Completed
          </ToggleButton>
          <ToggleButton
            value='In Progress'
            disabled={filterPayments === 'In Progress'}
          >
            In Progress
          </ToggleButton>
          <ToggleButton
            value='Scheduled'
            disabled={filterPayments === 'Scheduled'}
          >
            Scheduled
          </ToggleButton>
        </ToggleButtonGroup>
        <CustomSearchControl
          apiRef={gridApiRef}
          labelText='Search'
          placeholder='Search ID, Amount, or Account'
          sxProps={{
            width: '20rem',
          }}
        />
      </Stack>
      {isLoading ? (
        <Stack height='600px'>
          <PangeaLoading
            loadingPhrase='Loading transactions ...'
            centerPhrase
          />
        </Stack>
      ) : (
        <>
          <Stack flexDirection='row' justifyContent='flex-end'>
            <PangeaButton variant='outlined' onClick={handleExportCSV}>
              Export to CSV
            </PangeaButton>
          </Stack>
          <DataGridPro
            columns={transactionColumns}
            rowHeight={48}
            rows={paymentRows ?? []}
            apiRef={gridApiRef}
            sx={{
              display: 'flex',
              border: '0 none',
              '& .MuiDataGrid-columnHeaderTitle':
                customTheme.typography.tableHeader,
              '& .MuiDataGrid-columnHeaderTitleContainer .MuiBadge-root, & .MuiDataGrid-columnHeaderTitleContainer [aria-label*="active filter"]':
                {
                  display: 'none',
                },
              '& .MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows':
                {
                  textTransform: 'uppercase',
                },
            }}
            components={{
              BaseTextField: CustomBaseTextField,
            }}
            componentsProps={{
              toolbar: {
                apiRef: gridApiRef,
              },
              pagination: {
                SelectProps: {
                  variant: 'outlined',
                  size: 'small',
                  sx: {
                    '& .MuiTablePagination-select.MuiSelect-select': {
                      height: '20px',
                      backgroundColor: 'transparent',
                    },
                  },
                },
              },
            }}
            pageSize={pageSize}
            onPageSizeChange={onPageSizeChange}
            rowsPerPageOptions={[5, 10, 20, 50]}
            pagination
            disableSelectionOnClick
            disableColumnSelector
            disableColumnPinning
            autoHeight
            initialState={{
              sorting: {
                sortModel: [
                  { field: 'created', sort: 'desc' },
                  { field: 'delivery_date', sort: 'desc' },
                ],
              },
              columns: {
                columnVisibilityModel: {
                  internal_uuid: false,
                  modified: false,
                },
              },
            }}
          />
        </>
      )}
    </Stack>
  ) : null;
});

export const TransactionsGrid = memo(function PaymentsGrid() {
  const [paymentRows, setPaymentRows] = useState<PangeaPayment[]>();
  const [isLoading, setIsLoading] = useState(false);

  const handleCashflowsLoaded = useEventCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (rows: PangeaPayment[], _isLoading: boolean) => {
      if (rows.length == 0) {
        return;
      }
      setPaymentRows(rows);
      setIsLoading(_isLoading);
    },
  );
  React.useEffect(() => {
    return () => {
      setPaymentRows(undefined);
      setIsLoading(false);
    };
  }, []);
  return (
    <FeatureFlag name={['transactions']} fallback={<>Feature unavailable</>}>
      <TransactionLoader
        onPaymentUpdate={handleCashflowsLoaded}
        setLoadingState={setIsLoading}
      />
      <GridComponent paymentRows={paymentRows} isLoading={isLoading} />
    </FeatureFlag>
  );
});

const TransactionLoader = ({
  onPaymentUpdate,
  setLoadingState,
}: {
  onPaymentUpdate: (paymentRows: PangeaPayment[], isLoading: boolean) => void;
  setLoadingState?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const api = useRecoilValue(clientApiState);
  const apiHelper = api.getAuthenticatedApiHelper();

  const { data, isLoading: isLoadingTransactions } = useCacheableAsyncData(
    'dashboardTransactions',
    async () => {
      return await apiHelper.getAllTransactionsAsync();
    },
  );
  React.useEffect(() => {
    setLoadingState?.(isLoadingTransactions);
    if (data && !isError(data)) {
      onPaymentUpdate(data, isLoadingTransactions);
    }
  }, [data, isLoadingTransactions, onPaymentUpdate, setLoadingState]);

  return null;
};

export default TransactionsGrid;
