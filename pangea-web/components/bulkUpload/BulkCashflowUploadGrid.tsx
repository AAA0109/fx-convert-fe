import Add from '@mui/icons-material/Add';
import DateRange from '@mui/icons-material/DateRange';
import DeleteForever from '@mui/icons-material/DeleteForever';
import KabobIcon from '@mui/icons-material/MoreHoriz';
import { IconButton, Menu, MenuItem, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  DataGridPro,
  GridColDef,
  GridRenderCellParams,
  GridSelectionModel,
  GridToolbarContainer,
  GridToolbarFilterButton,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { GridApiPro } from '@mui/x-data-grid-pro/models/gridApiPro';
import { bulkUploadItemsState } from 'atoms';
import { formatDistance } from 'date-fns';
import { useCashflowGridColumns } from 'hooks/useCashflowGridColumns';
import { AnyHedgeItem, Cashflow, Installment } from 'lib';
import { MutableRefObject, useMemo, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { PangeaColors } from 'styles';
import {
  CustomBaseTextField,
  CustomSearchControl,
  PangeaButton,
} from '../shared';

const transformHedgeItemsToGridRows = (rows: AnyHedgeItem[]) => {
  if (!rows) return [];
  return rows.map((r, i) => {
    const retObj = {
      name: r.name,
      amount: r.directionalAmount,
      currency: r.currency,
      direction: r.direction,
      frequency: r.type,
      deliveryDate: r.endDate,
      id: i,
      internal_uuid: r.internal_uuid,
      obj: r,
    };
    if (r.type === 'installments') {
      const i = r as Installment;
      const installmentDates = i.cashflows.map((ins) => ins.date);
      const minDate = Date.Min(...installmentDates);
      const maxDate = Date.Max(...installmentDates);
      return {
        ...retObj,
        schedule:
          i.cashflows.length > 1
            ? `${i.cashflows.length} installments spanning ${formatDistance(
                maxDate,
                minDate,
                { includeSeconds: false, addSuffix: false },
              )}`
            : `1 installment on ${maxDate.toLocaleDateString()}`,
      };
    } else {
      const c = r as Cashflow;
      return {
        ...retObj,
        schedule: r.type === 'recurring' ? c.recurrenceData?.displayText : '',
      };
    }
  });
};

const GridActionsMenu = ({
  onEdit,
  onDelete,
}: {
  onEdit?: () => void;
  onDelete?: () => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = useEventCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    },
  );
  const handleClose = useEventCallback(() => {
    setAnchorEl(null);
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
        <MenuItem
          onClick={() => {
            handleClose();
            onEdit && onEdit();
          }}
        >
          <DateRange sx={{ paddingRight: '32px' }} />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            onDelete && onDelete();
          }}
        >
          <DeleteForever sx={{ paddingRight: '32px' }} />
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};

export const BulkCashflowUploadGrid = ({
  rows,
  addCashflowClicked,
  editCashflowClicked,
}: {
  rows: AnyHedgeItem[];
  addCashflowClicked?: () => void;
  editCashflowClicked?: (cashflow: AnyHedgeItem) => void;
}) => {
  const setBulkUploadRows = useSetRecoilState(bulkUploadItemsState);
  const [hideDeleteButton, setHideDeleteButton] = useState<boolean>(true);
  const customTheme = useTheme();
  const apiRef = useGridApiRef();
  const gridcols = useCashflowGridColumns(
    [
      'name',
      'currency',
      'direction',
      'frequency',
      'deliveryDate',
      'amount',
      'totalAmountDomestic',
      'internal_uuid',
    ],
    apiRef,
    null,
    null,
    true,
  );
  gridcols.splice(4, 0, {
    field: 'schedule',
    flex: 1.2,
    headerName: 'Schedule',
    renderCell: (params: GridRenderCellParams<string>) => {
      return <span title={params.value}>{params.value}</span>;
    },
  } as GridColDef);
  const handleEdit = useEventCallback((id: number) => {
    const thisRow = apiRef.current.getRow(id);
    if (thisRow && editCashflowClicked) {
      editCashflowClicked(thisRow.obj);
    }
  });
  const handleDelete = useEventCallback((ids: number[]) => {
    const newRows = [...rows];
    ids.forEach((id) => {
      const thisRow = apiRef.current.getRow(id);
      apiRef.current.updateRows([{ _action: 'delete', id }]);
      const indxToDelete = newRows.findIndex(
        (item) => item.internal_uuid === thisRow.internal_uuid,
      );
      if (indxToDelete >= 0) {
        newRows.splice(indxToDelete, 1);
      }
    });
    setBulkUploadRows(newRows);
  });

  const handleDeleteButtonClicked = useEventCallback(() => {
    const rowsIdsToDelete: number[] = [];
    apiRef.current
      .getSelectedRows()
      .forEach((_val, rowId) => rowsIdsToDelete.push(Number(rowId.valueOf())));
    handleDelete(rowsIdsToDelete);
    apiRef.current.setSelectionModel([]);
  });
  const handleSelectionChange = useEventCallback(
    (selectionModel: GridSelectionModel) => {
      setHideDeleteButton(selectionModel.length === 0);
    },
  );
  const columns: GridColDef[] = [
    ...gridcols,
    {
      field: 'actions',
      flex: 0.1,
      headerName: '',
      filterable: false,
      sortable: false,
      renderCell: (params) => {
        return (
          <GridActionsMenu
            onEdit={() => handleEdit(Number(params.id.valueOf()))}
            onDelete={() => handleDelete([Number(params.id.valueOf())])}
          />
        );
      },
    },
  ];
  const gridrows = useMemo(() => transformHedgeItemsToGridRows(rows), [rows]);

  return (
    <DataGridPro
      apiRef={apiRef}
      rowHeight={48}
      pagination
      rowsPerPageOptions={[15, 50, 100]}
      checkboxSelection
      sx={{
        display: 'flex',
        '& .MuiDataGrid-columnHeaderTitle': customTheme.typography.tableHeader,
        '& .MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows':
          {
            textTransform: 'uppercase',
          },
      }}
      autoHeight
      columns={columns}
      rows={gridrows}
      onSelectionModelChange={handleSelectionChange}
      components={{
        Toolbar: CustomBulkCashflowUploadGridToolbar,
        BaseTextField: CustomBaseTextField,
      }}
      componentsProps={{
        toolbar: {
          apiRef: apiRef,
          addCashflowClicked,
          deleteCashflowsClicked: handleDeleteButtonClicked,
          hideDeleteButton,
        },
        pagination: {
          SelectProps: {
            variant: 'outlined',
            size: 'medium',
            sx: {
              '& .MuiTablePagination-select.MuiSelect-select': {
                fontSize: '0.9rem',
                height: '20px',
                backgroundColor: 'transparent',
              },
            },
          },
        },
      }}
      initialState={{
        columns: {
          columnVisibilityModel: {
            internal_uuid: false,
            amount: false,
          },
        },
      }}
    />
  );
};
interface CustomBulkCashflowUploadGridToolbarProps {
  apiRef: MutableRefObject<GridApiPro>;
  addCashflowClicked?: () => void;
  deleteCashflowsClicked?: () => void;
  hideDeleteButton: boolean;
}
const CustomBulkCashflowUploadGridToolbar = (
  props: CustomBulkCashflowUploadGridToolbarProps,
) => {
  const {
    apiRef,
    addCashflowClicked,
    deleteCashflowsClicked,
    hideDeleteButton,
  } = props;
  return (
    <GridToolbarContainer sx={{ margin: 2 }}>
      <Stack direction='row' justifyContent='space-between' flexGrow={1}>
        <Stack direction='row' justifyContent={'left'} spacing={3}>
          <PangeaButton
            size='medium'
            onClick={addCashflowClicked}
            startIcon={<Add />}
            color='primary'
            sx={{ width: '150px', minWidth: '150px', maxHeight: '36px' }}
          >
            Add Cash Flow
          </PangeaButton>
          {!hideDeleteButton && (
            <PangeaButton
              size='medium'
              onClick={deleteCashflowsClicked}
              startIcon={<DeleteForever />}
              color='error'
              variant='outlined'
              sx={{ width: '100px', minWidth: '100px', maxHeight: '36px' }}
            >
              Delete
            </PangeaButton>
          )}
        </Stack>
        <Stack direction='row' justifyContent={'right'} spacing={3}>
          <CustomSearchControl apiRef={apiRef} />
          <GridToolbarFilterButton
            sx={{
              border: `1px solid ${PangeaColors.SolidSlateMediumSemiTransparent50}`,
            }}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
        </Stack>
      </Stack>
    </GridToolbarContainer>
  );
};
export default BulkCashflowUploadGrid;
