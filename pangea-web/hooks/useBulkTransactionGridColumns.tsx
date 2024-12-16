import ErrorOutline from '@mui/icons-material/ErrorOutline';
import { Button, SxProps, Typography } from '@mui/material';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid-pro';
import { PangeaTooltip } from 'components/shared';
import { format, parseISO } from 'date-fns';
import { formatCurrency, TransactionRecord } from 'lib';
import { PangeaColors } from 'styles';
import { useTransactionHelpers } from './useTransactionHelpers';
import { useWalletAndPaymentHelpers } from './useWalletAndPaymentHelpers';

const typographyStyles: SxProps = {
  fontFamily: 'SuisseIntl',
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '18px',
  letterSpacing: '0.16px',
};
const missingTypographyStyles: SxProps = {
  ...typographyStyles,
  textDecoration: 'underline',
  textTransform: 'capitalize',
  p: 0,
  color: PangeaColors.EarthBlueMedium,
  cursor: 'pointer',
  display: 'block',
  textAlign: 'left',
};

export const useBulkTransactionGridColumns = (
  fields: string[],
  handleUpdateRecord: (field: keyof TransactionRecord, id: number) => void,
) => {
  const {
    isDescriptionValid,
    isAmountValid,
    isValueDateValid,
    isSourceAccountValid,
    isDestinationAccountValid,
    validateValueDateByMarket,
  } = useTransactionHelpers();
  // Define the helper function
  const formatAmount = (amount: number, lockSide: string) => {
    return formatCurrency(
      amount,
      lockSide,
      false,
      2,
      2,
      false,
      'currency',
      'code',
    );
  };
  const {
    allWallets,
    settlementAccounts,
    beneficiaryAccounts,
    isWalletAccount,
  } = useWalletAndPaymentHelpers();
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Description',
      flex: 2,
      valueGetter: (params: GridValueGetterParams<any, any>) => {
        return params.row.name;
      },
      renderCell: (params: any) => {
        if (!params.row.name) {
          return (
            <PangeaTooltip arrow title='Memo is required for this transaction.'>
              <Button
                variant='text'
                sx={missingTypographyStyles}
                onClick={() => handleUpdateRecord('name', params.row.id)}
              >
                Add description
              </Button>
            </PangeaTooltip>
          );
        }
        const isValid = isDescriptionValid(params.value);
        return (
          <>
            {!isValid && (
              <ErrorOutline
                htmlColor={PangeaColors.RiskBerryMedium}
                sx={{ marginRight: '.4rem' }}
              />
            )}
            <Typography sx={typographyStyles}>{params.value}</Typography>
          </>
        );
      },
    },
    {
      field: 'id',
      headerName: 'Trans ID',
      flex: 1,
      valueGetter: (params: GridValueGetterParams<any, any>) => {
        return params.row.id;
      },
      renderCell: (params: any) => {
        if (!params.row.id) {
          return <Typography sx={missingTypographyStyles}>Add ID</Typography>;
        }
        return <Typography sx={typographyStyles}>{params.value}</Typography>;
      },
      filterable: false,
    },
    {
      field: 'sell_currency',
      headerName: 'Sell',
      flex: 1.5,
      valueGetter: (params: GridValueGetterParams<any, any>) => {
        return params.row.sell_currency;
      },
      renderCell: (params: any) => {
        if (!params.row.sell_currency) {
          return (
            <PangeaTooltip
              arrow
              title='Sell currency is required for this transaction.'
            >
              <Button
                sx={missingTypographyStyles}
                variant='text'
                onClick={() =>
                  handleUpdateRecord('sell_currency', params.row.id)
                }
              >
                Add currency
              </Button>
            </PangeaTooltip>
          );
        }
        return <Typography sx={typographyStyles}>{params.value}</Typography>;
      },
    },
    {
      field: 'buy_currency',
      headerName: 'Buy',
      flex: 1.5,
      valueGetter: (params: GridValueGetterParams<any, any>) => {
        return params.row.buy_currency;
      },
      renderCell: (params: any) => {
        if (!params.row.buy_currency) {
          return (
            <PangeaTooltip
              arrow
              title='Buy currency is required for this transaction.'
            >
              <Button
                variant='text'
                onClick={() =>
                  handleUpdateRecord('buy_currency', params.row.id)
                }
                sx={missingTypographyStyles}
              >
                Add currency
              </Button>
            </PangeaTooltip>
          );
        }
        return <Typography sx={typographyStyles}>{params.value}</Typography>;
      },
    },
    {
      field: 'lock_side',
      headerName: 'Lock Side',
      flex: 1,
      valueGetter: (params: GridValueGetterParams<any, any>) => {
        return params.row.lock_side;
      },
      renderCell: (params: any) => {
        if (!params.row.lock_side) {
          return (
            <PangeaTooltip
              arrow
              title='Please select a valid lock side currency. Must be one of the two currencies in this transaction.'
            >
              <Button
                variant='text'
                onClick={() => handleUpdateRecord('lock_side', params.row.id)}
                sx={missingTypographyStyles}
              >
                Add Lock Side
              </Button>
            </PangeaTooltip>
          );
        }
        return <Typography sx={typographyStyles}>{params.value}</Typography>;
      },
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 1.5,
      valueGetter: (params: GridValueGetterParams<any, any>) => {
        return params.row.amount;
      },
      renderCell: (params: any) => {
        if (!params.row.amount) {
          return (
            <PangeaTooltip
              arrow
              title='Invalid amount. Please update the lock side amount.'
            >
              <Button
                variant='text'
                onClick={() => handleUpdateRecord('amount', params.row.id)}
                sx={missingTypographyStyles}
              >
                Add amount
              </Button>
            </PangeaTooltip>
          );
        }
        const isValid = isAmountValid(params.row.amount);
        return (
          <>
            {!isValid && (
              <ErrorOutline
                htmlColor={PangeaColors.RiskBerryMedium}
                sx={{ marginRight: '.4rem' }}
              />
            )}
            {isValid ? (
              <Typography sx={typographyStyles}>
                {formatAmount(params.row.amount, params.row.lock_side)}
              </Typography>
            ) : (
              <Button
                variant='text'
                onClick={() => handleUpdateRecord('amount', params.row.id)}
                sx={missingTypographyStyles}
              >
                <Typography sx={typographyStyles}>
                  {formatAmount(params.row.amount, params.row.lock_side)}
                </Typography>
              </Button>
            )}
          </>
        );
      },
    },
    {
      field: 'delivery_date',
      headerName: 'Value Date',
      flex: 1.7,
      valueGetter: (params: GridValueGetterParams<any, any>) => {
        return typeof params.row.delivery_date === 'object'
          ? format(params.row.delivery_date, 'yyyy-MM-dd')
          : params.row.delivery_date;
      },
      renderCell: (params: any) => {
        if (!params.row.delivery_date) {
          return (
            <PangeaTooltip arrow title='Invalid date. Please pick a new date.'>
              <Button
                variant='text'
                onClick={() =>
                  handleUpdateRecord('delivery_date', params.row.id)
                }
                sx={missingTypographyStyles}
              >
                Add date
              </Button>
            </PangeaTooltip>
          );
        }
        const isValid =
          isValueDateValid(params.value) &&
          validateValueDateByMarket(
            `${params.row.buy_currency}${params.row.sell_currency}`,
            parseISO(params.value),
          );
        return (
          <>
            {!isValid && (
              <ErrorOutline
                htmlColor={PangeaColors.RiskBerryMedium}
                sx={{ marginRight: '.4rem' }}
              />
            )}
            {isValid ? (
              <Typography sx={typographyStyles}>{params.value}</Typography>
            ) : (
              <Button
                variant='text'
                onClick={() =>
                  handleUpdateRecord('delivery_date', params.row.id)
                }
                sx={missingTypographyStyles}
              >
                <Typography sx={typographyStyles}>{params.value}</Typography>
              </Button>
            )}
          </>
        );
      },
    },
    {
      field: 'origin_account_id',
      headerName: 'Origin',
      flex: 2,
      valueGetter: (params: GridValueGetterParams<any, any>) => {
        return params.row.origin_account_id;
      },
      renderCell: (params: any) => {
        const isValid = isSourceAccountValid(params.row.origin_account_id);
        if (!params.row.origin_account_id) {
          return (
            <PangeaTooltip
              arrow
              title='Origin is required for this transaction.'
            >
              <Button
                variant='text'
                onClick={() =>
                  handleUpdateRecord('origin_account_id', params.row.id)
                }
                sx={missingTypographyStyles}
              >
                Add origin
              </Button>
            </PangeaTooltip>
          );
        }
        const accountDetails =
          allWallets.find(
            (wallet) => wallet.wallet_id === params.row.origin_account_id,
          ) ??
          settlementAccounts.find(
            (account) => account.wallet_id === params.row.origin_account_id,
          );
        return (
          <>
            {!isValid && (
              <ErrorOutline
                htmlColor={PangeaColors.RiskBerryMedium}
                sx={{ marginRight: '.4rem' }}
              />
            )}
            {isValid ? (
              <Typography sx={typographyStyles}>
                {accountDetails?.name}
              </Typography>
            ) : (
              <Button
                variant='text'
                onClick={() =>
                  handleUpdateRecord('origin_account_id', params.row.id)
                }
                sx={missingTypographyStyles}
              >
                <PangeaTooltip
                  arrow
                  title='Invalid account. Please update the funding account.'
                >
                  <Typography sx={typographyStyles}>
                    {accountDetails?.name ?? 'Add origin'}
                  </Typography>
                </PangeaTooltip>
              </Button>
            )}
          </>
        );
      },
    },
    {
      field: 'destination_account_id',
      headerName: 'Destination',
      flex: 2,
      valueGetter: (params: GridValueGetterParams<any, any>) => {
        return params.row.destination_account_id;
      },
      renderCell: (params: any) => {
        const isValid = isDestinationAccountValid(
          params.row.destination_account_id,
        );
        if (!params.row.destination_account_id) {
          return (
            <PangeaTooltip
              arrow
              title='Invalid beneficiary. Please update the beneficiary or destination wallet.'
            >
              <Button
                variant='text'
                onClick={() =>
                  handleUpdateRecord('destination_account_id', params.row.id)
                }
                sx={missingTypographyStyles}
              >
                Add destination
              </Button>
            </PangeaTooltip>
          );
        }
        const accountDetails =
          allWallets.find(
            (wallet) => wallet.wallet_id === params.row.destination_account_id,
          ) ??
          beneficiaryAccounts.find(
            (account) =>
              account.beneficiary_id === params.row.destination_account_id,
          );
        return (
          <>
            {!isValid && (
              <ErrorOutline
                htmlColor={PangeaColors.RiskBerryMedium}
                sx={{ marginRight: '.4rem' }}
              />
            )}
            {isValid ? (
              <Typography sx={typographyStyles}>
                {isWalletAccount(accountDetails)
                  ? accountDetails.name
                  : accountDetails?.beneficiary_alias}
              </Typography>
            ) : (
              <Button
                variant='text'
                onClick={() =>
                  handleUpdateRecord('destination_account_id', params.row.id)
                }
                sx={missingTypographyStyles}
              >
                <Typography sx={typographyStyles}>
                  {isWalletAccount(accountDetails)
                    ? accountDetails.name
                    : accountDetails?.beneficiary_alias ?? 'Add destination'}
                </Typography>
              </Button>
            )}
          </>
        );
      },
    },
  ];
  return columns
    .filter((col) => fields.includes(col.field))
    .sort((a, b) => {
      return fields.indexOf(a.field) - fields.indexOf(b.field);
    });
};
