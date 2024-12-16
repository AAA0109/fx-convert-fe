import {
  GridApiCommon,
  GridColDef,
  GridValueFormatterParams,
} from '@mui/x-data-grid-pro';
import { MutableRefObject } from 'react';

import { Stack, Typography } from '@mui/material';
import { formatCurrency } from 'lib';

export const useInsightsGridColumns = (
  fields: string[],
  totalBalance: number,
  apiRef?: MutableRefObject<GridApiCommon>,
) => {
  const columns: GridColDef[] = [
    {
      field: 'curr',
      headerName: 'Currency',
      headerAlign: 'left',
      align: 'left',
      flex: 2,
      renderCell: (params: any) => {
        const color = apiRef?.current
          ? apiRef.current.getRow(params.id)?.color
          : 'white';
        return (
          <Stack
            justifyContent='space-between'
            alignItems='center'
            direction={'row'}
            spacing={1}
          >
            <div
              style={{
                backgroundColor: color,
                width: 20,
                height: 20,
                borderRadius: '100%',
              }}
            ></div>
            <Typography>{params.value || 'Others'}</Typography>
          </Stack>
        );
      },
    },
    {
      field: 'available_balance',
      headerName: 'Balance',
      headerAlign: 'right',
      align: 'right',
      flex: 2,
      type: 'number',
      sortComparator: (v1, v2) => {
        return Math.abs(v1) === Math.abs(v2)
          ? 0
          : Math.abs(v1) > Math.abs(v2)
          ? 1
          : -1;
      },
      valueFormatter: (params: GridValueFormatterParams<any>) =>
        formatCurrency(
          params.value,
          apiRef?.current && params.id
            ? apiRef.current.getRow(params.id)?.currency
            : 'USD',
          true,
          0,
          0,
        ),
    },
    {
      field: 'available_balance_domestic',
      headerName: 'Balance (USD)',
      headerAlign: 'right',
      align: 'right',
      flex: 2,
      type: 'number',
      sortComparator: (v1, v2) => {
        return Math.abs(v1) === Math.abs(v2)
          ? 0
          : Math.abs(v1) > Math.abs(v2)
          ? 1
          : -1;
      },
      valueFormatter: (params: GridValueFormatterParams<any>) =>
        formatCurrency(
          params.value,
          apiRef?.current && params.id
            ? apiRef.current.getRow(params.id)?.currency
            : 'USD',
          true,
          0,
          0,
        ),
    },
    {
      field: 'percentage',
      headerName: 'Total % (USD)',
      headerAlign: 'right',
      align: 'right',
      flex: 2,
      type: 'number',
      sortComparator: (v1, v2) => {
        return Math.abs(v1) === Math.abs(v2)
          ? 0
          : Math.abs(v1) > Math.abs(v2)
          ? 1
          : -1;
      },
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        const balanceInUsd = apiRef?.current
          ? apiRef.current.getRow(params.id ?? '')?.available_balance_domestic
          : 0;
        const value = (balanceInUsd / totalBalance) * 100;
        return `${value.toFixed(2)} %`;
      },
    },
  ];
  return columns
    .filter((col) => fields.includes(col.field))
    .sort((a, b) => {
      return fields.indexOf(a.field) - fields.indexOf(b.field);
    });
};
