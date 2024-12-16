import Add from '@mui/icons-material/Add';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import KabobIcon from '@mui/icons-material/MoreHoriz';
import CloseIcon from '@mui/icons-material/Close';
import {
  Alert,
  Box,
  Chip,
  Dialog,
  FormControl,
  IconButton,
  InputLabel,
  ListSubheader,
  Menu,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  DataGridPro,
  GridColDef,
  GridToolbarContainer,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { GridApiPro } from '@mui/x-data-grid-pro/models/gridApiPro';
import {
  allBulkInitialMarketValueDateState,
  bulkUploadTransactionItemsState,
  clientApiState,
  paymentSpotRateRequestDataState,
} from 'atoms';
import { PangeaBeneficiaryStatusEnum, TransactionRecord } from 'lib';
import {
  MutableRefObject,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  BeneficiaryStatusChip,
  CustomBaseTextField,
  CustomSearchControl,
  ForeignCurrencyInput2,
  PangeaButton,
  PangeaLoading,
  PaymentsBulkAction,
} from '../shared';

import CurrencySelect from 'components/shared/CurrencySelect';
import {
  useBulkTransactionGridColumns,
  useTransactionHelpers,
  useWalletAndPaymentHelpers,
} from 'hooks';
import { debounce, isError } from 'lodash';
import { PangeaColors } from 'styles';
import BeneficaryForm from 'components/shared/BeneficiaryForms/BeneficiaryForm';
import CustomDatePicker from 'components/shared/CustomDatePicker';
import { format } from 'date-fns';

const transformTransactionsToGridRows = (rows: TransactionRecord[]) => {
  if (!rows) return [];
  return rows;
};

const GridActionsMenu = ({
  onEdit,
  onDelete,
}: {
  onEdit?: () => void;
  onDelete?: () => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = useEventCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    },
  );
  const handleClose = useEventCallback(() => {
    setAnchorEl(null);
  });
  return (
    <>
      <IconButton
        aria-label='more'
        id='long-button'
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup='true'
        onClick={handleClick}
      >
        <KabobIcon />
      </IconButton>
      <Menu
        id='long-menu'
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            onEdit?.();
          }}
        >
          Edit details
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            onDelete?.();
          }}
          sx={{ color: PangeaColors.RiskBerryMedium }}
        >
          Delete transaction
        </MenuItem>
      </Menu>
    </>
  );
};

export const BulkUploadGrid = ({
  rows,
  setGridApiRef,
  uploadCsvClicked,
  addTransactionClicked,
  editTransactionClicked,
  noRowsOverlay = <></>,
}: {
  rows: TransactionRecord[];
  setGridApiRef: (apiRef: MutableRefObject<GridApiPro>) => void;
  uploadCsvClicked?: () => void;
  addTransactionClicked?: () => void;
  editTransactionClicked?: (cashflow: TransactionRecord) => void;
  noRowsOverlay?: JSX.Element;
}) => {
  const setBulkUploadRows = useSetRecoilState(bulkUploadTransactionItemsState);
  const [allPairsMarketData, setBulkInitialMarketValueDate] = useRecoilState(
    allBulkInitialMarketValueDateState,
  );
  const customTheme = useTheme();
  const apiRef = useGridApiRef();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const {
    isDescriptionValid,
    isAmountValid,
    isValueDateValid,
    isSourceAccountValid,
    isDestinationAccountValid,
    validateValueDateByMarket,
  } = useTransactionHelpers();
  const { allWallets, settlementAccounts } = useWalletAndPaymentHelpers();
  const api = useRecoilValue(clientApiState);
  const [recordUpdateDetails, setRecordUpdateDetails] = useState<{
    modalType: keyof TransactionRecord | null;
    recordRowId?: number;
  }>({
    modalType: null,
    recordRowId: undefined,
  });
  const onHandleConfirm = useCallback(
    async ({
      value,
      recordRowId,
      fieldName,
    }: {
      value: string;
      recordRowId?: number;
      fieldName: keyof TransactionRecord;
    }) => {
      const row = recordRowId ? apiRef.current?.getRow(recordRowId) : null;
      if (row && fieldName !== null) {
        const field = fieldName;
        apiRef.current?.updateRows(
          [row].map((r) => ({
            ...r,
            [field]: value,
          })),
        );
      }
      if (row && row.sell_currency && row.buy_currency) {
        const marketPair = `${row.buy_currency}${row.sell_currency}`;
        const hasInitialMarketValueDate = allPairsMarketData?.spot_dates.find(
          (data) => data.pair === marketPair,
        );
        if (!hasInitialMarketValueDate) {
          const allPairs = rows
            .filter((row) => row.buy_currency && row.sell_currency)
            .map((r) => `${r.buy_currency}${r.sell_currency}`);
          const apiHelper = api.getAuthenticatedApiHelper();
          const refreshedPairsMarketData =
            await apiHelper.validateAllBulkMarketPairsAsync({
              pairs: [...new Set(allPairs)],
            });
          if (refreshedPairsMarketData && !isError(refreshedPairsMarketData)) {
            setBulkInitialMarketValueDate(refreshedPairsMarketData);
          }
        }
      }
      setBulkUploadRows((rows) => {
        return rows.map((r) => {
          if (r.id === recordRowId) {
            return { ...r, [fieldName]: value };
          }
          return r;
        });
      });
      setOpenModal(false);
    },
    [
      allPairsMarketData?.spot_dates,
      api,
      apiRef,
      rows,
      setBulkInitialMarketValueDate,
      setBulkUploadRows,
    ],
  );
  const { modalContent } = useMemo(() => {
    const { modalType, recordRowId } = recordUpdateDetails;
    switch (modalType) {
      case 'name':
        return {
          modalContent: (
            <DescriptionSelector
              handleConfirm={(value) => {
                onHandleConfirm({
                  value,
                  recordRowId: recordRowId,
                  fieldName: modalType,
                });
                setOpenModal(false);
              }}
            />
          ),
        };
      case 'sell_currency':
        return {
          modalContent: (
            <CurrencySelector
              type='sell'
              handleConfirm={(value) => {
                onHandleConfirm({
                  value,
                  recordRowId: recordRowId,
                  fieldName: modalType,
                });
                setOpenModal(false);
              }}
            />
          ),
        };
      case 'buy_currency':
        return {
          modalContent: (
            <CurrencySelector
              type='buy'
              handleConfirm={(value) => {
                onHandleConfirm({
                  value,
                  recordRowId: recordRowId,
                  fieldName: modalType,
                });
                setOpenModal(false);
              }}
            />
          ),
        };
      case 'lock_side': {
        const lockSideOptions = [];
        const sellCurrency = recordRowId
          ? apiRef.current?.getRow(recordRowId)?.sell_currency
          : null;
        const buyCurrency = recordRowId
          ? apiRef.current?.getRow(recordRowId)?.buy_currency
          : null;
        if (sellCurrency) {
          lockSideOptions.push(sellCurrency);
        }
        if (buyCurrency) {
          lockSideOptions.push(buyCurrency);
        }
        return {
          modalContent: (
            <LockSideSelector
              lockSideOptions={lockSideOptions}
              handleConfirm={(value) => {
                onHandleConfirm({
                  value,
                  recordRowId: recordRowId,
                  fieldName: modalType,
                });
                setOpenModal(false);
              }}
            />
          ),
        };
      }
      case 'amount':
        return {
          modalContent: (
            <AmountSelector
              handleConfirm={(value) => {
                onHandleConfirm({
                  value,
                  recordRowId: recordRowId,
                  fieldName: modalType,
                });
                setOpenModal(false);
              }}
            />
          ),
        };
      case 'delivery_date': {
        const sellCurrency = recordRowId
          ? apiRef.current?.getRow(recordRowId)?.sell_currency
          : null;
        const buyCurrency = recordRowId
          ? apiRef.current?.getRow(recordRowId)?.buy_currency
          : null;
        if (!sellCurrency || !buyCurrency) {
          return {
            modalContent: (
              <Alert color='error'>
                You need a valid market pair to obtain valid value dates.
              </Alert>
            ),
          };
        }
        return {
          modalContent: (
            <ValueDateSelector
              buyCurrency={buyCurrency}
              sellCurrency={sellCurrency}
              handleConfirm={(value) => {
                onHandleConfirm({
                  value: value ? format(new Date(value), 'yyyy-MM-dd') : '',
                  recordRowId: recordRowId,
                  fieldName: modalType,
                });
                setOpenModal(false);
              }}
            />
          ),
        };
      }
      case 'origin_account_id': {
        const sellCurrency = recordRowId
          ? apiRef.current?.getRow(recordRowId)?.sell_currency
          : undefined;
        return {
          modalContent: (
            <OriginAccountSelector
              handleConfirm={(value) => {
                onHandleConfirm({
                  value,
                  recordRowId: recordRowId,
                  fieldName: modalType,
                });
                setOpenModal(false);
              }}
              filterCurrency={sellCurrency}
            />
          ),
        };
      }
      case 'destination_account_id': {
        const buyCurrency = recordRowId
          ? apiRef.current?.getRow(recordRowId)?.buy_currency
          : undefined;
        const sourceAccount = recordRowId
          ? allWallets.find(
              (w) =>
                w.wallet_id ===
                apiRef.current?.getRow(recordRowId)?.origin_account_id,
            ) ??
            settlementAccounts.find(
              (a) =>
                a.wallet_id ===
                apiRef.current?.getRow(recordRowId)?.origin_account_id,
            )
          : undefined;
        const settlementBrokerId = sourceAccount?.broker.id;
        return {
          modalContent: (
            <DestinationAccountSelector
              handleConfirm={(value) => {
                onHandleConfirm({
                  value,
                  recordRowId: recordRowId,
                  fieldName: modalType,
                });
                setOpenModal(false);
              }}
              filterCurrency={buyCurrency}
              settlementBrokerId={settlementBrokerId}
            />
          ),
        };
      }
      default:
        return { modalContent: null };
    }
  }, [
    allWallets,
    apiRef,
    onHandleConfirm,
    recordUpdateDetails,
    settlementAccounts,
  ]);

  const handleUpdateRecord = useCallback(
    (field: keyof TransactionRecord, id: number) => {
      setOpenModal(true);
      setRecordUpdateDetails({
        modalType: field,
        recordRowId: id,
      });
    },
    [],
  );
  const gridcols = useBulkTransactionGridColumns(
    [
      'name',
      'sell_currency',
      'buy_currency',
      'lock_side',
      'amount',
      'delivery_date',
      'origin_account_id',
      'destination_account_id',
      'purpose_of_payment',
      'id',
    ],
    handleUpdateRecord,
  );

  const handleEdit = useEventCallback((id: string) => {
    const thisRow = apiRef.current.getRow(id);
    if (thisRow && editTransactionClicked) {
      editTransactionClicked(thisRow as TransactionRecord);
    }
  });
  const handleDelete = useEventCallback((ids: string[]) => {
    const newRows = [...rows];
    ids.forEach((id) => {
      const thisRow = apiRef.current.getRow(id);
      apiRef.current.updateRows([{ _action: 'delete', id }]);
      const indxToDelete = newRows.findIndex((item) => item.id === thisRow.id);
      if (indxToDelete >= 0) {
        newRows.splice(indxToDelete, 1);
      }
    });
    setBulkUploadRows(newRows);
  });

  const handleDeleteButtonClicked = useEventCallback(() => {
    const rowsIdsToDelete: string[] = [];
    apiRef.current
      .getSelectedRows()
      .forEach((_val, rowId) => rowsIdsToDelete.push(rowId as string));
    handleDelete(rowsIdsToDelete);
    apiRef.current.setSelectionModel([]);
  });

  const columns: GridColDef[] = [
    ...gridcols,
    {
      field: 'actions',
      flex: 0.1,
      headerName: '',
      filterable: false,
      sortable: false,
      renderCell: (params) => {
        return (
          <GridActionsMenu
            onEdit={() => handleEdit(params.id as string)}
            onDelete={() => handleDelete([params.id as string])}
          />
        );
      },
    },
  ];
  const gridrows = useMemo(() => transformTransactionsToGridRows(rows), [rows]);
  useEffect(() => {
    setGridApiRef(apiRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiRef]);

  return (
    <>
      <DataGridPro
        apiRef={apiRef}
        disableSelectionOnClick
        rowHeight={48}
        pagination
        rowsPerPageOptions={[15, 50, 100]}
        checkboxSelection
        sx={{
          display: 'flex',
          '& .MuiDataGrid-columnHeaderTitle':
            customTheme.typography.tableHeader,
          '& .MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows':
            {
              textTransform: 'uppercase',
            },
          '& .MuiDataGrid-main > div[style]:nth-child(1)': {
            zIndex: 15,
            '& .MuiDataGrid-overlay': {
              pointerEvents: 'all',
              cursor: 'pointer',
            },
          },
          '& .MuiDataGrid-virtualScrollerContent': {
            minHeight: '200px!important',
            '& .needsReviewRow': {
              bgcolor: alpha(PangeaColors.EarthBlueMedium, 0.04),
            },
          },
        }}
        autoHeight
        columns={columns}
        rows={gridrows}
        getRowClassName={(params) => {
          if (
            !isDescriptionValid(params.row.name) ||
            !isAmountValid(params.row.amount) ||
            !isValueDateValid(params.row.delivery_date) ||
            !isSourceAccountValid(params.row.origin_account_id) ||
            !isDestinationAccountValid(params.row.destination_account_id) ||
            !validateValueDateByMarket(
              `${params.row.buy_currency}${params.row.sell_currency}`,
              new Date(params.row.delivery_date),
            )
          ) {
            return 'needsReviewRow';
          }
          return '';
        }}
        components={{
          Toolbar: CustomBulkUploadGridToolbar,
          BaseTextField: CustomBaseTextField,
          NoRowsOverlay: () => noRowsOverlay,
        }}
        componentsProps={{
          toolbar: {
            apiRef: apiRef,
            addTransactionClicked,
            deleteTransactionsClicked: handleDeleteButtonClicked,
            uploadCsvClicked,
          },

          pagination: {
            SelectProps: {
              variant: 'outlined',
              size: 'medium',
              sx: {
                '& .MuiTablePagination-select.MuiSelect-select': {
                  fontSize: '0.9rem',
                  height: '20px',
                  paddingTop: '3px',
                  backgroundColor: 'transparent',
                },
              },
            },
          },
        }}
        initialState={{
          columns: {
            columnVisibilityModel: {
              id: false,
            },
          },
        }}
      />
      <Dialog
        sx={{
          '& .MuiDialog-paper': {
            width: '360px',
            position: 'relative',
            maxWidth: '100%',
            minHeight: 'auto',
            borderRadius: '4px',
            margin: '0px',
            padding: '36px',
            backgroundColor: `{PangeaColors.StoryWhiteLighter}`,
          },
        }}
        open={openModal}
        onClose={(_event, reason) => {
          if (reason == 'backdropClick') {
            return;
          }
          setOpenModal(false);
        }}
      >
        <IconButton
          sx={{ position: 'absolute', right: '15px', top: '20px' }}
          aria-label='close'
          onClick={() => {
            setOpenModal(false);
          }}
        >
          <CloseIcon />
        </IconButton>
        {modalContent}
      </Dialog>
    </>
  );
};
interface CustomBulkUploadGridToolbarProps {
  apiRef: MutableRefObject<GridApiPro>;
  addTransactionClicked?: () => void;
  deleteTransactionsClicked?: () => void;
  uploadCsvClicked?: () => void;
}
const CustomBulkUploadGridToolbar = (
  props: CustomBulkUploadGridToolbarProps,
) => {
  const {
    apiRef,
    addTransactionClicked,
    deleteTransactionsClicked,
    uploadCsvClicked,
  } = props;
  return (
    <GridToolbarContainer sx={{ margin: 2 }}>
      <Stack direction='row' justifyContent='space-between' flexGrow={1}>
        <Stack direction='row' justifyContent={'left'} spacing={2}>
          <PangeaButton
            size='medium'
            onClick={uploadCsvClicked}
            startIcon={<CloudUploadIcon />}
            color='primary'
            sx={{ width: '150px', minWidth: '150px', maxHeight: '36px' }}
          >
            Upload CSV
          </PangeaButton>
          <PangeaButton
            size='medium'
            onClick={addTransactionClicked}
            startIcon={<Add />}
            color='primary'
            sx={{ maxHeight: '36px' }}
          >
            Add Transaction
          </PangeaButton>
        </Stack>
        <Stack
          direction='row'
          justifyContent={'right'}
          alignItems='center'
          spacing={3}
        >
          <PaymentsBulkAction
            apiRef={apiRef}
            onDelete={deleteTransactionsClicked}
          />
          <CustomSearchControl
            apiRef={apiRef}
            placeholder='Search'
            sxProps={{ width: 300 }}
          />
        </Stack>
      </Stack>
    </GridToolbarContainer>
  );
};

function DescriptionSelector({
  handleConfirm,
}: {
  handleConfirm: (value: string) => void;
}): JSX.Element {
  const [description, setDescription] = useState<string>('');
  const { isDescriptionValid } = useTransactionHelpers();
  return (
    <Stack rowGap={3}>
      <Typography variant='h5'>Update Description</Typography>
      <Typography variant='body2'>
        Please add a description for this transaction:
      </Typography>
      <TextField
        label='Description'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        error={!isDescriptionValid(description)}
        helperText={
          !isDescriptionValid(description)
            ? 'Description is required and must be alphanumeric and less than 150 characters.'
            : ''
        }
      />
      <Stack direction='row' justifyContent='flex-end'>
        <PangeaButton
          disabled={!description || !isDescriptionValid(description)}
          onClick={() => handleConfirm(description)}
        >
          Confirm
        </PangeaButton>
      </Stack>
    </Stack>
  );
}

function CurrencySelector({
  handleConfirm,
  type,
}: {
  handleConfirm: (value: string) => void;
  type: 'buy' | 'sell';
}): JSX.Element {
  const [currency, setCurrency] = useState<string>('');
  return (
    <Stack rowGap={3}>
      <Typography variant='h5'>Update {type} Currency</Typography>
      <Typography variant='body2'>
        Please select a {type} currency for this transaction:
      </Typography>
      <Suspense
        fallback={<PangeaLoading loadingPhrase='Loading currencies ...' />}
      >
        <FormControl fullWidth>
          <CurrencySelect
            sxFormControlProps={{
              width: '100%',
              '& label': { textTransform: 'capitalize' },
            }}
            value={currency}
            type={type}
            label={`${type} Currency`}
            onChange={debounce((val) => {
              setCurrency(val);
            }, 600)}
          />
        </FormControl>
      </Suspense>
      <Stack direction='row' justifyContent='flex-end'>
        <PangeaButton
          disabled={!currency}
          onClick={() => handleConfirm(currency)}
        >
          Confirm
        </PangeaButton>
      </Stack>
    </Stack>
  );
}

function LockSideSelector({
  handleConfirm,
  lockSideOptions,
}: {
  handleConfirm: (value: string) => void;
  lockSideOptions: string[];
}): JSX.Element {
  const [lockSide, setLockSide] = useState<string>('');
  return (
    <Stack rowGap={3}>
      <Typography variant='h5'>Update Lock Side</Typography>
      <Typography variant='body2'>
        Please select a lock side for this transaction:
      </Typography>
      <FormControl>
        <InputLabel id='lock-side-selector'>Lock Side</InputLabel>
        <Select
          labelId='lock-side-selector'
          id='lock-side'
          value={lockSide}
          label='Lock Side'
          onChange={(e) => setLockSide(e.target.value as string)}
        >
          {lockSideOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Stack direction='row' justifyContent='flex-end'>
        <PangeaButton
          disabled={!lockSide}
          onClick={() => handleConfirm(lockSide)}
        >
          Confirm
        </PangeaButton>
      </Stack>
    </Stack>
  );
}

function AmountSelector({
  handleConfirm,
}: {
  handleConfirm: (value: string) => void;
}): JSX.Element {
  const [amount, setAmount] = useState<string>('');
  return (
    <Stack rowGap={3}>
      <Typography variant='h5'>Update Amount</Typography>
      <Typography variant='body2'>
        Please enter the amount for this transaction:
      </Typography>
      <ForeignCurrencyInput2
        customLabel='Amount'
        value={parseFloat(amount)}
        rounding={2}
        onChange={(e) => setAmount(e.toFixed(2))}
        direction={'paying'}
        foreignCurrency={null}
        showBlockError={true}
        checkCurrencyProp={false}
      />
      <Stack direction='row' justifyContent='flex-end'>
        <PangeaButton disabled={!amount} onClick={() => handleConfirm(amount)}>
          Confirm
        </PangeaButton>
      </Stack>
    </Stack>
  );
}

function ValueDateSelector({
  handleConfirm,
  buyCurrency,
  sellCurrency,
}: {
  handleConfirm: (value: Date | null) => void;
  buyCurrency: string;
  sellCurrency: string;
}): JSX.Element {
  const setPaymentSpotRateRequestPayload = useSetRecoilState(
    paymentSpotRateRequestDataState,
  );
  useEffect(() => {
    setPaymentSpotRateRequestPayload((prev) => ({
      ...prev,
      buy_currency: buyCurrency,
      sell_currency: sellCurrency,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [valueDate, setValueDate] = useState<Date | null>(null);
  return (
    <Stack rowGap={3}>
      <Typography variant='h5'>Update Value Date</Typography>
      <Typography variant='body2'>
        Please select a value date for this transaction:
      </Typography>
      <CustomDatePicker
        controlDate={valueDate}
        handleChange={setValueDate}
        showDateError={false}
        controlWidth='100%'
      />
      <Stack direction='row' justifyContent='flex-end'>
        <PangeaButton
          disabled={!valueDate}
          onClick={() => handleConfirm(valueDate)}
        >
          Confirm
        </PangeaButton>
      </Stack>
    </Stack>
  );
}

function OriginAccountSelector({
  handleConfirm,
  filterCurrency = '',
}: {
  handleConfirm: (value: string) => void;
  filterCurrency?: string;
}): JSX.Element {
  const [originAccount, setOriginAccount] = useState<string>('');
  const { isLoadingSettlementWallets, allWallets, settlementAccounts } =
    useWalletAndPaymentHelpers();
  const finalWallets = filterCurrency
    ? allWallets.filter((w) => w.currency === filterCurrency)
    : allWallets;
  const finalSettlementAccounts = filterCurrency
    ? settlementAccounts.filter(
        (account) => account.currency === filterCurrency,
      )
    : settlementAccounts;
  return (
    <Stack rowGap={3}>
      <Typography variant='h5'>Update Origin Account</Typography>
      <Typography variant='body2'>
        Please select an origin account for this transaction:
      </Typography>
      <FormControl>
        <InputLabel id='bulk-origin-selector'>Origin</InputLabel>
        <Select
          labelId='bulk-origin-selector'
          id='origin-account'
          value={originAccount}
          label={isLoadingSettlementWallets ? 'Loading accounts ...' : 'Origin'}
          disabled={isLoadingSettlementWallets || isLoadingSettlementWallets}
          onChange={(e) => setOriginAccount(e.target.value as string)}
          MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
        >
          <ListSubheader
            sx={{
              backgroundColor: PangeaColors.SolidSlateDarker,
              color: PangeaColors.LightPrimaryContrast,
            }}
            color='inherit'
          >
            Wallets
          </ListSubheader>
          {finalWallets.map((wallet) => {
            const { wallet_id, name, broker, latest_balance } = wallet;
            const shouldDisable = latest_balance <= 1;
            return (
              <MenuItem
                key={wallet_id}
                value={wallet_id}
                disabled={shouldDisable}
              >
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  alignItems='center'
                  width='100%'
                >
                  <Box>
                    {name}:{' '}
                    <span style={{ fontWeight: 700 }}>${latest_balance}</span>
                  </Box>
                  <Chip
                    label={broker.name}
                    size='small'
                    sx={{
                      borderRadius: '1rem',
                      textTransform: 'capitalize',
                      fontWeight: 400,
                      fontSize: '0.8125rem',
                      lineHeight: '1.125rem',
                      backgroundColor: PangeaColors.EarthBlueMedium,
                      color: PangeaColors.White,
                    }}
                  />
                </Stack>
              </MenuItem>
            );
          })}
          <ListSubheader
            sx={{
              backgroundColor: PangeaColors.SolidSlateDarker,
              color: PangeaColors.LightPrimaryContrast,
            }}
            color='inherit'
          >
            Bank Accounts
          </ListSubheader>
          {finalSettlementAccounts.map((account) => {
            const { wallet_id, account_number, name, broker } = account;
            return (
              <MenuItem key={wallet_id} value={wallet_id}>
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  alignItems='center'
                  width='100%'
                >
                  {`${name} (${
                    account_number ? '...' + account_number?.slice(-4) : ''
                  })`}
                  <Chip
                    label={broker.name}
                    size='small'
                    sx={{
                      borderRadius: '1rem',
                      textTransform: 'capitalize',
                      fontWeight: 400,
                      fontSize: '0.8125rem',
                      lineHeight: '1.125rem',
                      backgroundColor: PangeaColors.EarthBlueMedium,
                      color: PangeaColors.White,
                    }}
                  />
                </Stack>
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <Stack direction='row' justifyContent='flex-end'>
        <PangeaButton
          onClick={() => handleConfirm(originAccount)}
          disabled={!originAccount}
        >
          Confirm
        </PangeaButton>
      </Stack>
    </Stack>
  );
}
function DestinationAccountSelector({
  handleConfirm,
  filterCurrency = '',
  settlementBrokerId,
}: {
  handleConfirm: (value: string) => void;
  filterCurrency?: string;
  settlementBrokerId?: number;
}): JSX.Element {
  const [openAddBeneficiaryDialog, setOpenAddBeneficiaryDialog] =
    useState(false);
  const [destinationAccount, setDestinationAccount] = useState<string>('');
  const {
    beneficiaryAccounts,
    allWallets,
    isLoadingSettlementWallets,
    isLoadingBeneficiaryAccounts,
  } = useWalletAndPaymentHelpers();
  const finalWallets = filterCurrency
    ? allWallets.filter((w) => w.currency === filterCurrency)
    : allWallets;
  const finalBeneficiaryAccounts = filterCurrency
    ? beneficiaryAccounts.filter(
        (beneficiary) => beneficiary.destination_currency === filterCurrency,
      )
    : beneficiaryAccounts;
  return (
    <Stack rowGap={3}>
      <Typography variant='h5'>Update Destination Account</Typography>
      <Typography variant='body2'>
        Please select a destination account for this transaction:
      </Typography>
      <FormControl sx={{ width: '100%' }}>
        <InputLabel id='bulk-destination-selector'>Destination</InputLabel>
        <Select
          labelId='bulk-destination-selector'
          id='destination-account'
          value={destinationAccount}
          label='Destination'
          onChange={(e) => setDestinationAccount(e.target.value as string)}
          MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
          disabled={isLoadingSettlementWallets || isLoadingBeneficiaryAccounts}
        >
          <ListSubheader
            sx={{
              backgroundColor: PangeaColors.SolidSlateDarker,
              color: PangeaColors.LightPrimaryContrast,
            }}
            color='inherit'
          >
            Beneficiaries
          </ListSubheader>
          {finalBeneficiaryAccounts.map((beneficiary) => {
            const {
              beneficiary_id,
              beneficiary_name,
              destination_currency,
              bank_name,
              status,
              brokers,
            } = beneficiary;
            const shouldDisable = settlementBrokerId
              ? !brokers.map(({ id }) => id).includes(settlementBrokerId) &&
                ![PangeaBeneficiaryStatusEnum.Synced].includes(status)
              : false;
            return (
              <MenuItem
                key={beneficiary_id}
                value={beneficiary_id}
                disabled={shouldDisable}
              >
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  width='100%'
                  columnGap={0.5}
                >
                  <Box
                    sx={{ flex: 1 }}
                  >{`${beneficiary_name} - ${destination_currency} - ${bank_name}`}</Box>
                  <Box display='flex' flexDirection='row' columnGap={0.5}>
                    <BeneficiaryStatusChip status={status} />
                    {brokers.map(({ id, name }) => (
                      <Chip
                        key={id}
                        label={name}
                        size='small'
                        sx={{
                          borderRadius: '1rem',
                          textTransform: 'capitalize',
                          fontWeight: 400,
                          fontSize: '0.8125rem',
                          lineHeight: '1.125rem',
                          backgroundColor: PangeaColors.EarthBlueMedium,
                          color: PangeaColors.White,
                        }}
                      />
                    ))}
                  </Box>
                </Stack>
              </MenuItem>
            );
          })}
          <MenuItem
            value=''
            key='add_new_beneficiary'
            onClick={() => setOpenAddBeneficiaryDialog(true)}
          >
            <AddIcon /> Add new beneficiary
          </MenuItem>
          <ListSubheader
            sx={{
              backgroundColor: PangeaColors.SolidSlateDarker,
              color: PangeaColors.LightPrimaryContrast,
            }}
            color='inherit'
          >
            Wallets
          </ListSubheader>
          {finalWallets.map((wallet) => {
            const { wallet_id, name, broker, latest_balance } = wallet;
            const shouldDisable = settlementBrokerId
              ? settlementBrokerId !== broker.id
              : false;
            return (
              <MenuItem
                key={wallet_id}
                value={wallet_id}
                disabled={shouldDisable}
              >
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  alignItems='center'
                  width='100%'
                >
                  <Box>
                    {name}:{' '}
                    <span style={{ fontWeight: 700 }}>${latest_balance}</span>
                  </Box>
                  <Chip
                    label={broker.name}
                    size='small'
                    sx={{
                      borderRadius: '1rem',
                      textTransform: 'capitalize',
                      fontWeight: 400,
                      fontSize: '0.8125rem',
                      lineHeight: '1.125rem',
                      backgroundColor: PangeaColors.EarthBlueMedium,
                      color: PangeaColors.White,
                    }}
                  />
                </Stack>
              </MenuItem>
            );
          })}
        </Select>
        <BeneficaryForm
          open={openAddBeneficiaryDialog}
          setOpen={setOpenAddBeneficiaryDialog}
        />
      </FormControl>

      <Stack direction='row' justifyContent='flex-end'>
        <PangeaButton
          onClick={() => handleConfirm(destinationAccount)}
          disabled={!destinationAccount}
        >
          Confirm
        </PangeaButton>
      </Stack>
    </Stack>
  );
}

export default BulkUploadGrid;
