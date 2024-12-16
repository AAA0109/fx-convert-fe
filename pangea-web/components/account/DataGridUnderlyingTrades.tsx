import { Skeleton, Stack } from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  DataGridPro,
  GridRenderCellParams,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { clientApiState, domesticCurrencyState } from 'atoms';
import { PangeaTrade, formatCurrency } from 'lib';
import { isError } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { useRecoilValue } from 'recoil';
import DownloadAsCsv from './DownloadAsCsv';

export const DataGridUnderlyingTrades = () => {
  const apiRef = useGridApiRef();
  const domesticCurrency = useRecoilValue(domesticCurrencyState);
  const authHelper = useRecoilValue(clientApiState);
  const [rowHistoryData, setRowHistoryData] = useState<PangeaTrade[]>();
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (rowHistoryData) {
      return;
    }
    const generateTradesHistory = async () => {
      const api = authHelper.getAuthenticatedApiHelper();
      api
        .loadTradesHistory()
        .then((res) => {
          if (res && !isError(res)) {
            const response = res as PangeaTrade[];
            setRowHistoryData(response);
          }
        })
        .catch(console.error);
    };
    generateTradesHistory();
  }, [authHelper, rowHistoryData]);
  const getRenderCellAmount = useEventCallback(
    (params: GridRenderCellParams) => {
      return `${params.value > 0 ? '+ ' : '- '}${formatCurrency(
        Math.abs(params.value),
        domesticCurrency,
        true,
        0,
        0,
      )}`;
    },
  );
  const getRenderCellDate = useEventCallback((params: GridRenderCellParams) => {
    return new Date(params.value).toLocaleDateString();
  });
  const getRenderCellCurrency = useEventCallback(
    (params: GridRenderCellParams) => {
      return params.row.fx_pair;
    },
  );
  const getRenderCellSpot = useEventCallback((params: GridRenderCellParams) => {
    return (
      <NumericFormat
        thousandSeparator={true}
        prefix={'$'}
        decimalScale={5}
        fixedDecimalScale={true}
        valueIsNumericString
        value={params.value}
        displayType={'text'}
      />
    );
  });
  const onPageSizeChange = useCallback(
    (newPageSize: number) =>
      pageSize !== newPageSize && setPageSize(newPageSize),
    [pageSize],
  );
  if (!rowHistoryData) {
    return <Skeleton />;
  }
  return (
    <Stack spacing={2} direction='column'>
      <DataGridPro
        apiRef={apiRef}
        autoHeight={true}
        pagination={true}
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
        rowsPerPageOptions={[10, 25, 50]}
        columns={[
          {
            field: 'id',
            type: 'string',
            hide: true,
          },
          {
            field: 'currency',
            headerName: 'Currency',
            headerAlign: 'left',
            align: 'left',
            type: 'string',
            flex: 1,
            renderCell: getRenderCellCurrency,
          },
          {
            field: 'date',
            headerName: 'Date',
            headerAlign: 'left',
            align: 'left',
            type: 'date',
            flex: 1,
            renderCell: getRenderCellDate,
          },
          {
            field: 'units',
            headerName: 'Units',
            headerAlign: 'left',
            align: 'right',
            type: 'number',
            flex: 1,
            renderCell: getRenderCellAmount,
          },

          {
            field: 'price',
            headerName: 'Avg. Price',
            headerAlign: 'center',
            align: 'right',
            type: 'number',
            flex: 1,
            renderCell: getRenderCellSpot,
          },
        ]}
        rows={rowHistoryData?.map((row, id) => {
          return { ...row, id };
        })}
      ></DataGridPro>
      <DownloadAsCsv apiRef={apiRef} fileName='Trades' />
    </Stack>
  );
};
export default DataGridUnderlyingTrades;
