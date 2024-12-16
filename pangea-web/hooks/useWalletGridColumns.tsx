import {
  GridApiCommon,
  GridColDef,
  GridValueFormatterParams,
} from '@mui/x-data-grid-pro';
import { MutableRefObject } from 'react';

import { Typography } from '@mui/material';
import { formatAccountName, formatCurrency } from 'lib';
import { PangeaColors } from '../styles/colors';

export const useWalletGridColumns = (
  fields: string[],
  apiRef?: MutableRefObject<GridApiCommon>,
  currency?: string,
) => {
  const columns: GridColDef[] = [
    {
      field: 'order_number',
      headerName: 'Deal #',
      renderCell: (params: any) => {
        return <>{params.value}</>;
      },
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 2,
      type: 'date',
      renderCell: (params: any) => {
        return <>{params.value}</>;
      },
    },
    {
      field: 'currency',
      headerName: 'Currency',
      headerAlign: 'right',
      align: 'right',
      renderCell: (params: any) => {
        return <>{params.value}</>;
      },
    },
    {
      field: 'amount',
      headerName: 'Debit/Credit',
      headerAlign: 'right',
      align: 'right',
      type: 'number',
      flex: 3,
      renderCell: (params: any) => {
        return (
          <>
            {params.value > 0 ? (
              <Typography sx={{ color: PangeaColors.SecurityGreenDarker }}>
                {' '}
                +{' '}
                {formatCurrency(
                  Math.abs(params.value),
                  apiRef?.current && params.id
                    ? currency || apiRef.current.getRow(params.id)?.currency
                    : 'USD',
                  true,
                  2,
                  2,
                )}
              </Typography>
            ) : (
              <Typography sx={{ color: PangeaColors.RiskBerryMedium }}>
                {' '}
                -{' '}
                {formatCurrency(
                  Math.abs(params.value),
                  apiRef?.current && params.id
                    ? currency || apiRef.current.getRow(params.id)?.currency
                    : 'USD',
                  true,
                  2,
                  2,
                )}
              </Typography>
            )}
          </>
        );
      },
      valueFormatter: (params: GridValueFormatterParams<any>) =>
        formatCurrency(
          Math.abs(params.value),
          apiRef?.current && params.id
            ? apiRef.current.getRow(params.id)?.currency
            : 'USD',
          true,
          0,
          0,
        ),
    },
    {
      field: 'balance',
      headerName: 'Balance',
      headerAlign: 'right',
      align: 'right',
      type: 'number',
      flex: 2,

      sortComparator: (v1, v2) => {
        return Math.abs(v1) === Math.abs(v2)
          ? 0
          : Math.abs(v1) > Math.abs(v2)
          ? 1
          : -1;
      },
      valueFormatter: (params: GridValueFormatterParams<any>) =>
        formatCurrency(
          Math.abs(params.value),
          apiRef?.current && params.id
            ? apiRef.current.getRow(params.id)?.currency
            : 'USD',
          true,
          0,
          0,
        ),
    },
    {
      field: 'wallet',
      headerName: 'Wallet',
      headerAlign: 'left',
      align: 'left',
      flex: 3,
      renderCell: (params: any) => {
        if (apiRef) {
          return (
            <>
              {'Wallet ' +
                formatAccountName(
                  apiRef.current.getRow(params.id)?.account_number,
                )}
            </>
          );
        } else {
          return <>{'Wallet'}</>;
        }
      },
    },
  ];
  return columns
    .filter((col) => fields.includes(col.field))
    .sort((a, b) => {
      return fields.indexOf(a.field) - fields.indexOf(b.field);
    });
};
