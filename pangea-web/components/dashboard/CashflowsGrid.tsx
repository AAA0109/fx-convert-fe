import ArrowForward from '@mui/icons-material/ArrowForward';
import DeleteForever from '@mui/icons-material/DeleteForever';
import ListIcon from '@mui/icons-material/List';
import KabobIcon from '@mui/icons-material/MoreHoriz';
import {
  IconButton,
  Menu,
  MenuItem,
  MenuItemProps,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  DataGridPro,
  GridColDef,
  GridRenderCellParams,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { allCashflowsGridViewState, clientApiState } from 'atoms';
import { PangeaSimpleDialog } from 'components/modals';
import { ForwardManagementModalContent } from 'components/modals/forwards';
import {
  useCashflowGridColumns,
  useCashflowHelpers,
  useUserGroupsAndPermissions,
} from 'hooks';
import {
  Cashflow,
  CashflowGridRow,
  CashflowStatusType,
  FrequencyType,
  Installment,
  PangeaGroupEnum,
  PangeaUpdateRequestTypeEnum,
} from 'lib';
import { useRouter } from 'next/router';
import {
  PropsWithChildren,
  Suspense,
  memo,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { PangeaColors, customTheme } from 'styles';
import RiskSvg from '../../public/images/type-high.svg';
import { ConfirmCancelDialog } from '../modals/ConfirmCancelDialog';
import {
  CustomBaseTextField,
  CustomSearch,
  PangeaLoading,
  RoleBasedAccessCheck,
} from '../shared';

const StyledMenuItem = styled(MenuItem)<MenuItemProps>({
  textTransform: 'none',
});
const PermissionsWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const { userGroups } = useUserGroupsAndPermissions();
  return (
    <RoleBasedAccessCheck
      userGroups={userGroups}
      allowedGroups={[
        PangeaGroupEnum.CustomerCreator,
        PangeaGroupEnum.CustomerManager,
        PangeaGroupEnum.CustomerAdmin,
      ]}
    >
      {children}
    </RoleBasedAccessCheck>
  );
};
const GridActionsMenu = ({
  status,
  id,
  frequencyType,
  onRowDeleted,
  isForward = false,
}: {
  status?: CashflowStatusType[];
  id: number;
  frequencyType: FrequencyType;
  onRowDeleted?: () => void;
  isForward?: boolean;
}) => {
  const isDraft = status && status.length > 0 ? status[0] === 'draft' : false;
  const isSettled =
    (status?.includes('archived') ||
      status?.includes('archived') ||
      status?.includes('terminated')) ??
    true;
  const shouldPreventForwardEdit = isForward && status?.includes('active');
  const router = useRouter();
  const api = useRecoilValue(clientApiState);
  const { deleteDraftAsync } = useCashflowHelpers();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editForwardDialogOpen, setEditForwardDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<PangeaUpdateRequestTypeEnum>(
    PangeaUpdateRequestTypeEnum.CashflowDetails,
  );
  const open = Boolean(anchorEl);
  const qs: string =
    '?' +
    (frequencyType === 'installments'
      ? `installment_id=${id}`
      : isDraft
      ? `draft_id=${id}`
      : `cashflow_id=${id}`);
  const rootPath = isDraft ? '/cashflow' : '/manage';
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCashflowPageClick = useEventCallback(() => {
    router.push(`/manage/overview${qs}`);
  });
  const handleEditRiskClicked = useEventCallback(() => {
    router.push(`${rootPath}/hedge${qs}`);
  });
  const handleEditDetailsClicked = useEventCallback(() => {
    router.push(`${rootPath}/details/${frequencyType}${qs}`);
  });
  const handleDeleteDraftClicked = useEventCallback(() => {
    handleClose();
    setDeleteDialogOpen(true);
  });
  const handleDeleteDraftDialogClosed = useEventCallback(() => {
    setDeleteDialogOpen(false);
  });
  const handleDeleteDraftConfirmed = useEventCallback(async () => {
    handleDeleteDraftDialogClosed();
    const draftsToDelete: Cashflow[] = [];
    if (frequencyType === 'installments') {
      const installment = await Installment.fromInstallmentIdAsync(id, api);
      installment &&
        installment.cashflows.forEach((c) => draftsToDelete.push(c));
    } else {
      if (isDraft) {
        const d = await Cashflow.fromDraftIdAsync(id, api);
        d && draftsToDelete.push(d);
      } else {
        const c = await Cashflow.fromCashflowIdAsync(id, api);
        c && draftsToDelete.push(c);
      }
    }
    await Promise.all(
      draftsToDelete.map(async (cashflow: Cashflow) => {
        if (cashflow.isFromDraftObject()) {
          await deleteDraftAsync(cashflow);
        } else if (cashflow.childDraft) {
          await deleteDraftAsync(Cashflow.fromDraftObject(cashflow.childDraft));
        }
      }),
    );
    if (frequencyType == 'installments') {
      await api.getAuthenticatedApiHelper().deleteInstallmentAsync(id);
    }

    onRowDeleted?.();
  });
  const handleEditForwardsCashflowDetails = useEventCallback(() => {
    setEditForwardDialogOpen(!editForwardDialogOpen);
    setDialogMode(PangeaUpdateRequestTypeEnum.CashflowDetails);
  });
  const handleEditForwardsCashflowRisk = useEventCallback(() => {
    setEditForwardDialogOpen(!editForwardDialogOpen);
    setDialogMode(PangeaUpdateRequestTypeEnum.RiskDetails);
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
        {(!isDraft || isSettled) && (
          <StyledMenuItem onClick={handleCashflowPageClick}>
            <ArrowForward sx={{ paddingRight: '32px' }} />
            View cash flow
          </StyledMenuItem>
        )}
        {!isSettled ? (
          <PermissionsWrapper>
            <StyledMenuItem
              onClick={
                shouldPreventForwardEdit
                  ? handleEditForwardsCashflowDetails
                  : handleEditDetailsClicked
              }
            >
              <ListIcon sx={{ paddingRight: '32px' }} />
              Edit cash flow details
            </StyledMenuItem>
          </PermissionsWrapper>
        ) : null}
        {!isSettled ? (
          <PermissionsWrapper>
            <StyledMenuItem
              onClick={
                shouldPreventForwardEdit
                  ? handleEditForwardsCashflowRisk
                  : handleEditRiskClicked
              }
            >
              <SvgIcon sx={{ paddingRight: '32px' }}>
                <RiskSvg />
              </SvgIcon>
              Edit risk details
            </StyledMenuItem>
          </PermissionsWrapper>
        ) : null}
        {isDraft && (
          <PermissionsWrapper>
            <StyledMenuItem onClick={handleDeleteDraftClicked}>
              <DeleteForever sx={{ paddingRight: '32px' }} />
              Delete draft
            </StyledMenuItem>
          </PermissionsWrapper>
        )}
      </Menu>
      <ConfirmCancelDialog
        title='Delete Draft?'
        open={deleteDialogOpen}
        alert={{
          color: 'warning',
          text: 'Your existing hedge will not be affected, but drafted changes will be deleted.',
        }}
        confirmButtonColorOverride={PangeaColors.CautionYellowMedium}
        onClick={handleDeleteDraftConfirmed}
        onCancel={handleDeleteDraftDialogClosed}
        cancelButtonText='Cancel'
        cancelButtonProps={{ color: 'warning' }}
        confirmButtonText='Delete Draft'
        confirmButtonProps={{ startIcon: <DeleteForever /> }}
        stackButtons
      />
      <PangeaSimpleDialog
        openModal={editForwardDialogOpen}
        onClose={() => {
          setEditForwardDialogOpen(!editForwardDialogOpen);
        }}
      >
        <ForwardManagementModalContent
          mode={dialogMode}
          forwardId={id.toString()}
          onClose={() => {
            setEditForwardDialogOpen(!editForwardDialogOpen);
          }}
        />
      </PangeaSimpleDialog>
    </>
  );
};
const GridComponent = memo(function GridComponent({
  cashflowRows,
}: {
  cashflowRows: CashflowGridRow[];
}) {
  const [pageSize, setPageSize] = useState(10);
  const gridApiRef = useGridApiRef();
  const columns = useCashflowGridColumns(
    [
      'nameLink',
      'status',
      'currency',
      'amount',
      'domesticAmount',
      'direction',
      'frequency',
      'account',
      'deliveryDate',
      'modified',
      'internal_uuid',
    ],
    gridApiRef,
  );
  const onPageSizeChange = useCallback(
    (newPageSize: number) =>
      pageSize !== newPageSize && setPageSize(newPageSize),
    [pageSize],
  );
  const cashflowColumns: GridColDef[] = [
    ...columns,
    {
      field: 'actions',
      headerName: '',
      filterable: false,
      flex: 0.1,
      renderCell: (params: GridRenderCellParams) => (
        <GridActionsMenu
          frequencyType={params.row.frequency}
          status={params.row.status}
          id={params.row.cashflowId}
          isForward={params.row.obj.is_forward}
          onRowDeleted={() => {
            gridApiRef.current.updateRows([
              { obj: params.row.obj, id: params.id, _action: 'delete' },
            ]);
          }}
        />
      ),
    },
  ];
  return gridApiRef ? (
    <>
      <Stack direction='row' alignItems='center' justifyContent='space-between'>
        <Typography variant='h4' component='h1'>
          Cash Flows
        </Typography>
        <CustomSearch apiRef={gridApiRef} />
      </Stack>
      <DataGridPro
        columns={cashflowColumns}
        rowHeight={48}
        rows={cashflowRows}
        apiRef={gridApiRef}
        getRowId={(row: any) =>
          row.obj.type === 'installments'
            ? `i${row.obj.installment_id}`
            : `${row.obj.type[0]}${row.obj.id}`
        }
        sx={{
          display: 'flex',
          '& .MuiDataGrid-columnHeaderTitle':
            customTheme.typography.tableHeader,
          '& .MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows':
            {
              textTransform: 'uppercase',
            },
        }}
        components={{
          BaseTextField: CustomBaseTextField,
          // Toolbar: CustomSearch,
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
            sortModel: [{ field: 'modified', sort: 'desc' }],
          },
          columns: {
            columnVisibilityModel: {
              internal_uuid: false,
            },
          },
        }}
      />
    </>
  ) : null;
});
export const CashflowsGrid = memo(function CashflowGridComponent() {
  const [cashflowRows, setCashflowRows] = useState<CashflowGridRow[]>([]);
  const [showBackdrop, setShowBackdrop] = useState(cashflowRows.length == 0);

  const handleCashflowsLoaded = useEventCallback(
    (rows: CashflowGridRow[], isLoading: boolean) => {
      if (cashflowRows.length > 0 && rows.length == 0) {
        return;
      }
      setCashflowRows(rows);
      setShowBackdrop(isLoading);
    },
  );
  useEffect(() => {
    return () => {
      setCashflowRows([]);
      setShowBackdrop(true);
    };
  }, []);
  return (
    <Suspense
      fallback={
        <PangeaLoading loadingPhrase='Loading cash flows...' useBackdrop />
      }
    >
      {showBackdrop ? (
        <PangeaLoading loadingPhrase='Loading cash flows...' useBackdrop />
      ) : null}

      <CashflowLoader onCashflowUpdate={handleCashflowsLoaded} />

      <GridComponent cashflowRows={cashflowRows} />
    </Suspense>
  );
});

const CashflowLoader = ({
  onCashflowUpdate,
}: {
  onCashflowUpdate: (
    cashflowRows: CashflowGridRow[],
    isLoading: boolean,
  ) => void;
}) => {
  const allCashflowsLoadable = useRecoilValueLoadable(
    allCashflowsGridViewState,
  );
  const isLoadingCashflows = allCashflowsLoadable.state === 'loading';
  const { rows: cashflowRows } = allCashflowsLoadable.getValue();

  useEffect(
    () => onCashflowUpdate(cashflowRows, isLoadingCashflows),
    [cashflowRows, isLoadingCashflows, onCashflowUpdate],
  );

  return null;
};
export default CashflowsGrid;
