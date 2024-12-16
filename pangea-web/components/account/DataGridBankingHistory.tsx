import { Skeleton, Stack } from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  DataGridPro,
  GridRenderCellParams,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { clientApiState } from 'atoms';
import { PangeaBankStatement } from 'lib';
import { isError } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { useRecoilValue } from 'recoil';
import DownloadAsCsv from './DownloadAsCsv';

export const DataGridBankingHistory = () => {
  const authHelper = useRecoilValue(clientApiState);
  const apiRef = useGridApiRef();
  const [pageSize, setPageSize] = useState(10);

  const [rowHistoryData, setRowHistoryData] = useState<PangeaBankStatement[]>();

  useEffect(() => {
    if (rowHistoryData) {
      return;
    }
    const generateBankHistoryStatements = async () => {
      const api = authHelper.getAuthenticatedApiHelper();
      api
        .loadBankingHistoryStatementsAsync()
        .then((res) => {
          if (res && !isError(res)) {
            const response = res as PangeaBankStatement[];
            setRowHistoryData(response);
          }
        })
        .catch(console.error);
    };
    generateBankHistoryStatements();
  }, [authHelper, rowHistoryData]);
  const getRenderCellAmount = useEventCallback(
    (params: GridRenderCellParams) => {
      return (
        <NumericFormat
          thousandSeparator={true}
          prefix={'$'}
          decimalScale={0}
          fixedDecimalScale={true}
          valueIsNumericString
          value={params.value}
          displayType={'text'}
        />
      );
    },
  );

  const getRenderCell = useEventCallback((params: GridRenderCellParams) => {
    return new Date(params.value).toLocaleDateString();
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
        autoHeight
        pagination
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
            field: 'description',
            headerName: 'Description',
            headerAlign: 'left',
            align: 'left',
            type: 'string',
            flex: 1,
          },
          {
            field: 'amount',
            headerName: 'Amount',
            headerAlign: 'center',
            align: 'right',
            type: 'string',
            flex: 1,
            renderCell: getRenderCellAmount,
          },
          {
            field: 'date',
            headerName: 'Date',
            headerAlign: 'center',
            align: 'right',
            type: 'date',
            flex: 1,
            renderCell: getRenderCell,
          },
        ]}
        rows={rowHistoryData?.map((row, id) => {
          return { ...row, id };
        })}
      />
      <DownloadAsCsv apiRef={apiRef} fileName='Banking History' />
    </Stack>
  );
};
export default DataGridBankingHistory;
