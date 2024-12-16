import { Link as MLink, Skeleton, Stack } from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  DataGridPro,
  GridRenderCellParams,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { clientApiState } from 'atoms';
import { PangeaFeesPayments } from 'lib';
import { isError, isUndefined } from 'lodash';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { useRecoilValue } from 'recoil';
import DownloadAsCsv from './DownloadAsCsv';

const BANKING_FEES_MAP: Record<string, string> = {
  maintenance: 'Maintenance fee created',
  new_cashflow: 'Hedge creation fee created',
};

export const DataGridFeesAndPayments = () => {
  const tokenPattern = /\{([\w_]+)\}/g;
  const authHelper = useRecoilValue(clientApiState);
  const apiRef = useGridApiRef();
  const [pageSize, setPageSize] = useState(10);

  const [rowHistoryData, setRowHistoryData] = useState<PangeaFeesPayments[]>();

  useEffect(() => {
    if (rowHistoryData) {
      return;
    }
    const generateFeesPaymentsHistory = async () => {
      const api = authHelper.getAuthenticatedApiHelper();
      api
        .loadHistoryFeesPaymentsAsync()
        .then((res) => {
          if (res && !isError(res)) {
            const response = res as PangeaFeesPayments[];
            setRowHistoryData(response);
          }
        })
        .catch(console.error);
    };
    generateFeesPaymentsHistory();
  }, [authHelper, rowHistoryData]);
  const getRenderCellAmount = useEventCallback(
    (params: GridRenderCellParams) => {
      return (
        <NumericFormat
          thousandSeparator={true}
          prefix={'$'}
          decimalScale={2}
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

  const getRenderCellCashflowLink = useEventCallback(
    (params: GridRenderCellParams) => {
      if (params.value === null) {
        return;
      }
      let url = '/manage/overview?';
      url += `cashflow_id=${params.value}`;

      return (
        <MLink component={Link} href={url} target='_blank'>
          View
        </MLink>
      );
    },
  );
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
        autoHeight={true}
        apiRef={apiRef}
        pagination={true}
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
        rowsPerPageOptions={[10, 25, 50]}
        getEstimatedRowHeight={() => 100}
        getRowHeight={() => 'auto'}
        sx={{
          '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
            py: '15px',
          },
        }}
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
            valueFormatter: (params) => {
              if (isUndefined(params.id)) {
                return '';
              }
              const row: PangeaFeesPayments = apiRef.current.getRow(
                params.id,
              ) as PangeaFeesPayments;
              const template = BANKING_FEES_MAP[row.description];
              if (!template) return 'Activity not found';
              return template.replace(tokenPattern, (_match, ...args) =>
                Object.hasOwn(row.description as any, args[0])
                  ? row.description[args[0]].toString()
                  : '',
              );
            },
          },
          {
            field: 'cashflow_id',
            headerName: 'Cashflow',
            headerAlign: 'center',
            align: 'right',
            renderCell: getRenderCellCashflowLink,
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
            field: 'incurred',
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
      ></DataGridPro>
      <DownloadAsCsv apiRef={apiRef} fileName='Fees and Payments' />
    </Stack>
  );
};
export default DataGridFeesAndPayments;
