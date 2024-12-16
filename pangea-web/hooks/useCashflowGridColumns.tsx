import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import Loop from '@mui/icons-material/Loop';
import Payment from '@mui/icons-material/Payment';
import Payments from '@mui/icons-material/Payments';
import { Chip, Link as MLink, TextField, Typography } from '@mui/material';
import {
  GridApiCommon,
  GridColDef,
  GridPreProcessEditCellProps,
  GridRenderCellParams,
  GridRenderEditCellParams,
  GridValueFormatterParams,
  GridValueGetterParams,
} from '@mui/x-data-grid-pro';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { currenciesState, domesticCurrencyState } from 'atoms';
import { StatusChip } from 'components/shared';
import { Cashflow } from 'lib';
import Link from 'next/link';
import { MutableRefObject, useMemo } from 'react';
import { NumericFormat } from 'react-number-format';
import { useRecoilValue } from 'recoil';

import { useFeatureFlags } from 'hooks';
import {
  AnyHedgeItem,
  compare,
  convertToDomesticAmount,
  formatCurrency,
  getEarliestAllowableStartDate,
  getTwoYearsFromToday,
  setAlpha,
  standardizeDate,
} from 'lib';
import { PangeaColors } from 'styles';
import { useCashflowHelpers } from './useCashflowHelpers';

export const useCashflowGridColumns = (
  fields: string[],
  apiRef?: MutableRefObject<GridApiCommon>,
  symbol?: NullableString,
  foreignCurrency?: NullableString,
  isUploadGrid?: boolean,
) => {
  const TwoYearsFromToday = useMemo(() => getTwoYearsFromToday(), []);
  const MinStartDate = useMemo(() => getEarliestAllowableStartDate(), []);
  const currencies = useRecoilValue(currenciesState);
  const domesticCurrency = useRecoilValue(domesticCurrencyState);
  const { isCashflowDateValid, isCashflowCurrencyValid } = useCashflowHelpers();
  const { isFeatureEnabled } = useFeatureFlags();
  const columns: GridColDef[] = [
    {
      field: 'nameLink',
      headerName: 'Name',
      flex: 2,
      valueGetter: (params: GridValueGetterParams<any, any>) => {
        return params.row.name;
      },
      renderCell: (params: any) => {
        let url = `/manage/overview?`;
        if ((params.row.status as string[])[0] == 'draft') {
          const linkFreq =
            params.row.frequency === 'installments'
              ? 'installment_id'
              : 'draft_id';
          url = `/cashflow/details/${params.row.frequency}?${linkFreq}=${params.row.cashflowId}`;
        } else if (params.row.frequency == 'installments') {
          url += `installment_id=${params.row.cashflowId}`;
        } else {
          url += `cashflow_id=${params.row.cashflowId}`;
        }
        return (
          <MLink component={Link} href={url} sx={{ textDecoration: 'none' }}>
            {params.row.name}
          </MLink>
        );
      },
    },
    { field: 'name', headerName: 'Name', flex: 2 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1.6,
      sortComparator: (v1: string[], v2: string[]) =>
        compare(v1.join(''), v2.join('')),
      renderCell: (params: any) => <StatusChip status={params.value} />,
    },
    {
      field: 'currency',
      headerName: 'Currency',
      renderCell: (params: any) => {
        const isCurrencyValid = isCashflowCurrencyValid(params.value as string);
        return (
          <>
            {isUploadGrid && !isCurrencyValid && (
              <ErrorOutline
                htmlColor={PangeaColors.RiskBerryMedium}
                sx={{ marginRight: '.4rem' }}
              />
            )}
            {params.value}
          </>
        );
      },
    },
    {
      field: 'domesticAmount',
      headerName: `Amount (${domesticCurrency})`,
      headerAlign: 'left',
      align: 'left',
      type: 'number',
      sortComparator: (v1, v2) => {
        return Math.abs(v1) === Math.abs(v2)
          ? 0
          : Math.abs(v1) > Math.abs(v2)
          ? 1
          : -1;
      },
      valueGetter: ({
        row: {
          amount,
          bookedBaseAmount,
          indicativeBaseAmount,
          bookedRate,
          indicativeRate,
          currency,
        },
      }) => {
        const finalAmount =
          bookedBaseAmount ??
          indicativeBaseAmount ??
          parseFloat(
            convertToDomesticAmount(
              amount,
              bookedRate ?? indicativeRate ?? currencies[currency]?.rate ?? '0',
            ),
          );
        return finalAmount;
      },
      valueFormatter: (params: any) =>
        formatCurrency(Math.abs(params.value), domesticCurrency, true, 0, 0),
    },
    {
      field: 'amount',
      headerName: 'Amount',
      headerAlign: 'left',
      align: 'left',
      type: 'number',
      sortComparator: (v1, v2) => {
        return Math.abs(v1) === Math.abs(v2)
          ? 0
          : Math.abs(v1) > Math.abs(v2)
          ? 1
          : -1;
      },
      valueGetter: ({
        row: { amount, bookedCntrAmount, indicativeCntrAmount },
      }) => bookedCntrAmount ?? indicativeCntrAmount ?? amount,
      valueFormatter: (params: GridValueFormatterParams<any>) =>
        formatCurrency(
          Math.abs(params.value),
          apiRef?.current && params.id
            ? apiRef.current.getRow(params.id)?.currency
            : domesticCurrency,
          true,
          0,
          0,
        ),
    },
    {
      field: 'direction',
      headerName: 'Direction',
      flex: 1,
      valueGetter: (params: any) => {
        return params.row['amount'] > 0 ? 'receiving' : 'paying';
      },
      renderCell: (params: any) => {
        return params.row['amount'] > 0 ? (
          <Chip
            label='Receiving'
            icon={<ArrowBack />}
            title='Receiving'
            sx={{
              borderRadius: '4px',
              backgroundColor: setAlpha(
                PangeaColors.SecurityGreenMedium,
                0.125,
              ),
            }}
          />
        ) : (
          <Chip
            label='Paying'
            icon={<ArrowForward />}
            title='Paying'
            sx={{
              borderRadius: '4px',
              backgroundColor: setAlpha(PangeaColors.RiskBerryMedium, 0.125),
            }}
          />
        );
      },
    },
    {
      field: 'frequency',
      flex: 1,
      headerName: 'Frequency',
      renderCell: (params: any) => {
        switch (params.value) {
          case 'recurring':
            return (
              <Chip
                label='Recurring'
                icon={<Loop />}
                title='Recurring'
                sx={{
                  borderRadius: '4px',
                  backgroundColor: setAlpha(
                    PangeaColors.EarthBlueMedium,
                    0.125,
                  ),
                }}
              />
            );
          case 'installments':
            return (
              <Chip
                label='Installments'
                title='Installments'
                icon={<Payments />}
                sx={{
                  borderRadius: '4px',
                  backgroundColor: setAlpha(
                    PangeaColors.WarmOrangeMedium,
                    0.125,
                  ),
                }}
              />
            );
          case 'onetime':
            return (
              <Chip
                label='One-Time'
                title='One-Time'
                icon={<Payment />}
                sx={{
                  borderRadius: '4px',
                  backgroundColor: setAlpha(
                    PangeaColors.ConnectedVioletMedium,
                    0.125,
                  ),
                }}
              />
            );
          default:
            return 'Unknown';
        }
      },
    },
    {
      field: 'deliveryDate',
      headerName: 'Next Settlement',
      flex: 1.1,
      type: 'date',
      renderCell: (params: any) => {
        const isDateValid = isCashflowDateValid(params.value as Date);
        return (
          <>
            {isUploadGrid &&
              !isDateValid &&
              isFeatureEnabled('cashflow-validate-end-date') && (
                <ErrorOutline
                  htmlColor={PangeaColors.RiskBerryMedium}
                  sx={{ marginRight: '.4rem' }}
                />
              )}
            {params.value.toLocaleDateString()}
          </>
        );
      },
    },
    {
      field: 'modified',
      headerName: 'Last Updated',
      flex: 1,
      type: 'date',
      valueFormatter: (params: any) => {
        return params.value.toLocaleDateString();
      },
    },
    {
      field: 'totalAmountDomestic',
      headerName: 'Total',
      headerAlign: 'right',
      align: 'right',
      flex: 1.2,
      type: 'number',
      valueGetter: (params) =>
        convertToDomesticAmount(
          params.row.obj.totalAmount,
          currencies[params.row.currency.mnemonic]?.rate ?? '0',
        ),
      valueFormatter: (params: any) =>
        formatCurrency(Math.abs(params.value), domesticCurrency, true, 0, 0),
    },
    {
      field: 'installmentAmount',
      headerName: 'Amount',
      description: 'Installment Amount',
      headerAlign: 'center',
      align: 'center',
      type: 'string',
      flex: 3,
      editable: false,
      valueGetter: (params: any) => params.row.amount,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <NumericFormat
            thousandSeparator={true}
            prefix={symbol ?? ''}
            suffix={` ${foreignCurrency}`}
            decimalScale={0}
            fixedDecimalScale={true}
            valueIsNumericString
            allowNegative={false}
            value={params.value}
            displayType={'text'}
            renderText={(formattedValue) => {
              return (
                <Typography
                  component='span'
                  color={(theme) =>
                    params.row.disabled ? theme.palette.text.disabled : 'unset'
                  }
                >
                  {formattedValue}
                </Typography>
              );
            }}
          />
        );
      },
      renderEditCell: (params: GridRenderEditCellParams) => {
        return (
          <NumericFormat
            thousandSeparator={true}
            prefix={symbol ?? ''}
            suffix={` ${foreignCurrency}`}
            decimalScale={0}
            fixedDecimalScale={false}
            valueIsNumericString
            allowNegative={false}
            customInput={TextField}
            inputProps={{
              'aria-label': 'Installment Amount',
              style: { textAlign: 'right', padding: '11px 10px 10px 10px' },
            }}
            value={!params.value ? 0 : params.value}
            onValueChange={(values: { value: string }) => {
              const { value } = values;
              apiRef &&
                apiRef.current.setEditCellValue({
                  id: params.id,
                  field: params.field,
                  value: value,
                  debounceMs: 200,
                });
            }}
            onFocus={(
              event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => event?.target?.setSelectionRange(0, 99)}
            isAllowed={({ floatValue }) => {
              const value = floatValue || 0;
              return value > 0;
            }}
            disabled={params.row.disabled}
          />
        );
      },
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        const hasError =
          params.props.value == undefined ||
          params.props.value === '' ||
          params.props.value === null;
        return { ...params.props, error: hasError };
      },
    },
    {
      field: 'installmentDomesticAmount',
      headerName: `Amount (${domesticCurrency})`,
      description: 'Installment Amount in Domestic',
      headerAlign: 'center',
      align: 'center',
      type: 'string',
      flex: 3,
      editable: false,
      valueGetter: (params: any) =>
        parseFloat(
          convertToDomesticAmount(
            params.row.amount,
            currencies[foreignCurrency ?? 'USD']?.rate ?? 0,
          ),
        ),
      renderCell: (params: GridRenderCellParams) => {
        return (
          <NumericFormat
            thousandSeparator={true}
            prefix={'$' ?? ''}
            suffix={` ${domesticCurrency}`}
            decimalScale={0}
            fixedDecimalScale={true}
            valueIsNumericString
            allowNegative={false}
            value={params.value}
            displayType={'text'}
            renderText={(formattedValue) => {
              return (
                <Typography
                  component='span'
                  color={(theme) =>
                    params.row.disabled ? theme.palette.text.disabled : 'unset'
                  }
                >
                  {formattedValue}
                </Typography>
              );
            }}
          />
        );
      },
    },
    {
      field: 'installmentDeliveryDate',
      description: 'Installment Payment Delivery Date',
      headerName: 'Delivery',
      headerAlign: 'center',
      align: 'center',
      type: 'date',
      flex: 2.5,
      valueGetter: (params: any) => {
        return params.row.date ?? params.row.deliveryDate;
      },
      valueFormatter: (params: GridValueFormatterParams) => {
        if (!params.value) return;
        return new Date(params.value).toLocaleDateString();
      },
      renderCell: (params: GridRenderCellParams) => {
        const c = params.row.obj as Cashflow;
        if (c?.isFromDraftObject() && params.value < MinStartDate) {
          return (
            <Typography color={PangeaColors.RiskBerryMedium}>
              {params.formattedValue}
            </Typography>
          );
        }
        return (
          <Typography
            component='span'
            color={(theme) =>
              params.row.disabled ? theme.palette.text.disabled : 'unset'
            }
          >
            {params.formattedValue}
          </Typography>
        );
      },
      renderEditCell: (params: GridRenderEditCellParams) => {
        if (!apiRef) {
          return <></>;
        }
        const d = params.value;
        const handleChange = async (date: Nullable<Date>) => {
          const { id, field } = params;
          const d: Nullable<Date> = date && standardizeDate(new Date(date));
          if (params.row.disabled) {
            return;
          }
          await apiRef.current.setEditCellValue({
            id,
            field,
            value: d,
            debounceMs: 200,
          });
        };
        return (
          <DesktopDatePicker
            format='MM/dd/yyyy'
            value={Number(new Date(d)) >= Number(MinStartDate) ? d : null}
            minDate={MinStartDate}
            maxDate={TwoYearsFromToday}
            onChange={handleChange}
            onAccept={handleChange}
            slotProps={{
              textField: {
                variant: 'filled',
                size: 'small',
                defaultValue: MinStartDate,
              },
              popper: {
                modifiers: [
                  {
                    name: 'viewHeightModifier',
                    enabled: true,
                    phase: 'beforeWrite',
                    fn: ({ state }: { state: Partial<any> }) => {
                      state.styles.popper.height = '320px';
                      if (state.placement.includes('top-start')) {
                        state.styles.popper = {
                          ...state.styles.popper,
                          display: 'flex',
                          alignItems: 'flex-end',
                        };
                      }
                      if (state.placement.includes('bottom')) {
                        state.styles.popper = {
                          ...state.styles.popper,
                          display: 'block',
                        };
                      }
                    },
                  },
                ],
              },
            }}
          />
        );
      },
      width: 190,
      editable: false,
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        const hasError =
          params.props.value == undefined ||
          params.props.value === '' ||
          params.props.value === null ||
          new Date(`${params.props.value}`) < MinStartDate ||
          new Date(`${params.props.value}`) > TwoYearsFromToday;
        return { ...params.props, error: hasError };
      },
    },
    {
      field: 'sequenceId',
      headerName: '#',
      headerAlign: 'center',
      align: 'center',
      type: 'string',
      flex: 1,
      editable: false,
      sortable: false,
      valueGetter: (params: any) => {
        return apiRef
          ? apiRef.current.getRowIndexRelativeToVisibleRows(params.id) + 1
          : 0;
      },
      renderCell: (params) => {
        return (
          <Typography
            component='span'
            color={(theme) =>
              params.row.disabled ? theme.palette.text.disabled : 'unset'
            }
          >
            {params.formattedValue}
          </Typography>
        );
      },
    },
    {
      field: 'internal_uuid',
      filterable: false,
    },
    {
      field: 'isDraft',
      filterable: false,
      valueGetter: (params: any) => {
        const hI = (params.row.obj || params.row) as AnyHedgeItem;
        if (!hI || !(hI instanceof Cashflow)) {
          return true;
        }
        if (hI.type == 'installments') {
          return false;
        }
        return (hI as Cashflow).isFromDraftObject();
      },
    },
  ];
  return columns
    .filter((col) => fields.includes(col.field))
    .sort((a, b) => {
      return fields.indexOf(a.field) - fields.indexOf(b.field);
    });
};
