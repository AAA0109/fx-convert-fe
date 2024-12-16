import { InfoOutlined } from '@mui/icons-material';
import { Box, InputAdornment, SxProps, Typography } from '@mui/material';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid-pro';
import { fxFetchingSpotRateState } from 'atoms';
import { ForeignCurrencyInput2, PangeaTooltip } from 'components/shared';
import CustomDatePicker from 'components/shared/CustomDatePicker';
import { format, parseISO } from 'date-fns';
import {
  EditedCashflow,
  PangeaCurrencyResponse,
  PangeaInitialMarketStateResponse,
  formatCurrency,
} from 'lib';
import { Dispatch, Fragment, SetStateAction } from 'react';
import { useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles/colors';

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
  }
  return text
    .replace('forward', 'fwd.')
    .replace('transaction', 'trans.')
    .replace(/_/g, ' ');
};

const getFlex = (text: string): number => {
  if (text.includes('currency')) {
    return 1.45;
  } else if (text.includes('fee')) {
    return 1.15;
  } else if (text.includes('forward_points')) {
    return 1.25;
  }
  return 1;
};

export const usePaymentCashflowGridColumns = (
  fields: string[],
  editedCashflow: EditedCashflow | null,
  setEditedCashflow: Dispatch<SetStateAction<EditedCashflow | null>>,
  onSettlementAmountChange: (value: number) => void,
  onPaymentAmountChange: (value: number) => void,
  editedRowId?: string | null,
  spotInfo?: PangeaInitialMarketStateResponse | null,
  sellCurrencyInfo?: PangeaCurrencyResponse | null,
  buyCurrencyInfo?: PangeaCurrencyResponse | null,
) => {
  const fetchingSpotRate = useRecoilValue(fxFetchingSpotRateState);

  const columnKeys = [
    'all_in_rate',
    'amount',
    'broker_fee',
    'buy_currency',
    'cashflow_id',
    'value_date',
    'forward_points',
    'id',
    'internal_uuid',
    'lock_side',
    'pangea_fee',
    'sell_currency',
    'spot_rate',
    'transaction_date',
  ];
  const columns: GridColDef[] = columnKeys.map((k) => {
    return {
      minWidth: 130,
      field: k,
      headerName: getHeaderText(k),
      flex: getFlex(k),
      sortable: false,
      editable: k === 'value_date' ? true : false,
      valueGetter: (params: GridValueGetterParams<any, any>) => {
        return params.row[k];
      },
      renderCell: (params: any) => {
        if (!params.value) {
          return (
            <Typography color={PangeaColors.Gray} sx={{ typographyStyles }}>
              TBD
            </Typography>
          );
        }

        if (k === 'sell_currency') {
          const amount =
            editedCashflow && editedCashflow.id === params.row.id
              ? editedCashflow.amount
              : params.row.amount;
          return (
            <Typography sx={typographyStyles}>
              {formatCurrency(
                amount,
                params.row.sell_currency,
                false,
                sellCurrencyInfo?.unit ?? DEFAULT_ROUNDING,
                sellCurrencyInfo?.unit ?? DEFAULT_ROUNDING,
                false,
                'decimal',
              ) + ` ${params.row.sell_currency}`}
            </Typography>
          );
        } else if (k === 'buy_currency') {
          const cntr_amount =
            editedCashflow && editedCashflow.id === params.row.id
              ? editedCashflow.cntr_amount
              : params.row.cntr_amount;
          return (
            <Typography
              color={cntr_amount ? '' : PangeaColors.Gray}
              sx={typographyStyles}
            >
              {cntr_amount == null
                ? ` ${params.row.buy_currency}`
                : formatCurrency(
                    cntr_amount,
                    params.row.buy_currency,
                    false,
                    buyCurrencyInfo?.unit ?? DEFAULT_ROUNDING,
                    buyCurrencyInfo?.unit ?? DEFAULT_ROUNDING,
                    false,
                    'decimal',
                  ) + ` ${params.row.buy_currency}`}
            </Typography>
          );
        } else if (k.includes('date')) {
          let value_date = params.value;
          if (
            k === 'value_date' &&
            editedCashflow &&
            editedCashflow.id === params.row.id
          ) {
            value_date = editedCashflow.date.toISOString();
          }
          return k === 'value_date' &&
            params.row.cashflow_id === editedRowId ? (
            <Box
              sx={{
                background: PangeaColors.Gray,
                width: '100%',
                height: '100%',
                alignContent: 'center',
                borderBottom: 1,
              }}
            >
              <Typography sx={typographyStyles}>
                {format(parseISO(value_date), 'M/d/Y')}
              </Typography>
            </Box>
          ) : (
            <Typography sx={typographyStyles}>
              {format(parseISO(value_date), 'M/d/Y')}
            </Typography>
          );
        } else if (k.includes('rate')) {
          return (
            <Typography sx={typographyStyles}>
              {params.value.toFixed(spotInfo?.rate_rounding ?? 1)}
            </Typography>
          );
        }

        return <Typography sx={typographyStyles}>{params.value}</Typography>;
      },
      renderHeader:
        k === 'forward_points'
          ? () => (
              <>
                <strong>Fwd. Points</strong>
                <PangeaTooltip
                  arrow
                  placement='top'
                  title={
                    <Fragment>
                      Forward interest rate points measure the interest gap
                      between two currencies. A positive value indicates an
                      interest rate environment that is favorable for this
                      payment. Forward points are only relevant for transactions
                      using Price Lock.
                    </Fragment>
                  }
                >
                  <InfoOutlined
                    sx={{ color: PangeaColors.BlackSemiTransparent38 }}
                  />
                </PangeaTooltip>
              </>
            )
          : () => undefined,
      renderEditCell: (params: any) => {
        if (k === 'value_date') {
          return (
            <CustomDatePicker
              controlDate={editedCashflow?.date}
              handleChange={(val: Date) => {
                if (editedCashflow) {
                  setEditedCashflow({
                    ...editedCashflow,
                    date: val,
                  });
                }
              }}
              showDateError={false}
              controlWidth='100%'
            />
          );
        } else if (k === 'sell_currency') {
          return (
            <>
              <ForeignCurrencyInput2
                value={editedCashflow?.amount ?? 0}
                rounding={sellCurrencyInfo?.unit}
                onChange={onSettlementAmountChange}
                direction={'paying'}
                foreignCurrency={null}
                customLabel={
                  editedCashflow?.lock_side === editedCashflow?.sell_currency
                    ? 'Selling Exactly.'
                    : 'Selling Approx.'
                }
                disabled={fetchingSpotRate}
                checkCurrencyProp={false}
              />
              <InputAdornment position='end'>
                {params.row.sell_currency}
              </InputAdornment>
            </>
          );
        } else if (k === 'buy_currency') {
          return (
            <>
              <ForeignCurrencyInput2
                value={editedCashflow?.cntr_amount ?? 0}
                rounding={buyCurrencyInfo?.unit}
                onChange={onPaymentAmountChange}
                direction={'paying'}
                foreignCurrency={null}
                customLabel={
                  editedCashflow?.lock_side === editedCashflow?.buy_currency
                    ? 'Buying Exactly.'
                    : 'Buying Approx.'
                }
                disabled={fetchingSpotRate}
                checkCurrencyProp={false}
              />
              <InputAdornment position='end'>
                {params.row.buy_currency}
              </InputAdornment>
            </>
          );
        }
        return null;
      },
    } as GridColDef;
  });
  return columns
    .filter((col) => fields.includes(col.field))
    .sort((a, b) => {
      return fields.indexOf(a.field) - fields.indexOf(b.field);
    });
};
