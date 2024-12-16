import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import { GridApiPro } from '@mui/x-data-grid-pro/models/gridApiPro';
import { PangeaFXBalanceAccountsResponseItem } from 'lib';
import { MutableRefObject, memo, useCallback, useState } from 'react';
import { customTheme } from 'styles';
export const InsightsGrid = memo(function GridComponent({
  walletRows,
  columns,
  gridApiRef,
}: {
  walletRows: PangeaFXBalanceAccountsResponseItem[];
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
      hideFooter
      columns={walletColumns}
      rowHeight={48}
      apiRef={gridApiRef}
      rows={walletRows}
      getRowId={(row: any) => row.curr}
      sx={{
        '&>.MuiDataGrid-main': {
          '&>.MuiDataGrid-columnHeaders': {
            borderBottom: 'none',
          },

          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
          },
        },
        border: 'none',
        display: 'flex',
        '& .MuiDataGrid-columnHeaderTitle': customTheme.typography.tableHeader,
        '& .MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows':
          {
            textTransform: 'uppercase',
          },
      }}
      componentsProps={{
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
  );
});

export default InsightsGrid;
