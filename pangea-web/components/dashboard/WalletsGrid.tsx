import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import { GridApiPro } from '@mui/x-data-grid-pro/models/gridApiPro';
import {
  PangeaCompanyFXBalanceAccountHistory,
  PangeaFXBalanceAccountHistoryRow,
} from 'lib';
import { MutableRefObject, memo, useCallback, useState } from 'react';
import { customTheme } from 'styles';

export const WalletsGrid = memo(function GridComponent({
  walletRows,
  columns,
  gridApiRef,
}: {
  walletRows:
    | PangeaFXBalanceAccountHistoryRow[]
    | PangeaCompanyFXBalanceAccountHistory[];
  columns: GridColDef[];
  gridApiRef: MutableRefObject<GridApiPro>;
}) {
  const [pageSize, setPageSize] = useState(10);
  const onPageSizeChange = useCallback(
    (newPageSize: number) =>
      pageSize !== newPageSize && setPageSize(newPageSize),
    [pageSize],
  );
  const walletColumns: GridColDef[] = columns;
  return (
    <DataGridPro
      columns={walletColumns}
      rowHeight={48}
      rows={walletRows}
      apiRef={gridApiRef}
      getRowId={(row: any) => row.id || row.order_number}
      sx={{
        display: 'flex',
        '& .MuiDataGrid-columnHeaderTitle': customTheme.typography.tableHeader,
        '& .MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows':
          {
            textTransform: 'uppercase',
          },
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
            { field: 'date', sort: 'desc' },
            { field: 'order_number', sort: 'desc' },
          ],
        },
        columns: {
          columnVisibilityModel: {
            internal_uuid: false,
          },
        },
      }}
    />
  );
});

export default WalletsGrid;
