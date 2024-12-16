import { SxProps, Typography } from '@mui/material';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid-pro';
import { format, parseISO } from 'date-fns';
import { PangeaCurrencyResponse, formatCurrency } from 'lib';

const DEFAULT_ROUNDING = 0;

const typographyStyles: SxProps = {
  fontFamily: 'SuisseIntl',
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '18px',
  letterSpacing: '0.16px',
};

const getHeaderText = (text: string): string => {
  if (text.includes('currency')) {
    return text.split('_')[0];
  } else if (text === 'id') {
    return '#'
  }
  return text.replace(/_/g, " ");
}

const getFlex = (text: string): number => {
  if (text.includes('currency')) {
    return 1.5;
  } else if (text === 'id') {
    return 0.5;
  }
  return 1;
}

export const usePaymentInstallmentGridColumns = (
  fields: string[],
  sellCurrencyInfo?: PangeaCurrencyResponse | null,
  buyCurrencyInfo?: PangeaCurrencyResponse | null
) => {
  const columnKeys = [
    'id',
    'cashflow_id',
    'internal_uuid',
    'sell_currency',
    'buy_currency',
    'lock_side',
    'amount',
    'date',
  ];
  const columns: GridColDef[] = columnKeys.map((k) => {
    return {
      field: k,
      headerName: getHeaderText(k),
      flex: getFlex(k),
      sortable: false,
      valueGetter: (params: GridValueGetterParams<any, any>) => {
        if (k === 'date') {
          return typeof params.row.date === 'object'
            ? format(params.row[k], 'yyyy-MM-dd')
            : params.row[k];
        }
        return params.row[k];
      },
      renderCell: (params: any) => {
        if (k === 'sell_currency') {
          return <Typography sx={typographyStyles}>
            {
              formatCurrency(
                params.row.amount,
                params.row.sell_currency,
                false,
                sellCurrencyInfo?.unit ?? DEFAULT_ROUNDING,
                sellCurrencyInfo?.unit ?? DEFAULT_ROUNDING,
                false,
                'decimal',
              ) + ` ${params.row.sell_currency}`
            }
          </Typography>;
        } else if (k === 'buy_currency') {
          return <Typography sx={typographyStyles}>
            {
              formatCurrency(
                params.row.cntr_amount,
                params.row.buy_currency,
                false,
                buyCurrencyInfo?.unit ?? DEFAULT_ROUNDING,
                buyCurrencyInfo?.unit ?? DEFAULT_ROUNDING,
                false,
                'decimal',
              ) + ` ${params.row.buy_currency}`
            }
          </Typography>;
        } else if (k === 'amount') {
          return (
            <Typography sx={typographyStyles}>
              {formatCurrency(
                params.row.amount,
                params.row.lock_side,
                false,
                2,
                2,
                false,
                'currency',
              )}
            </Typography>
          );
        } else if (k === 'date') {
          return (
            <Typography sx={typographyStyles}>{format(parseISO(params.value), 'M/d/Y')}</Typography>
          );
        }

        return (
          <Typography sx={typographyStyles} > {k === 'id' ? params.value + 1 : params.value}</Typography >
        );
      },
    } as GridColDef;
  });

  return columns
    .filter((col) => fields.includes(col.field))
    .sort((a, b) => {
      return fields.indexOf(a.field) - fields.indexOf(b.field);
    });
};
