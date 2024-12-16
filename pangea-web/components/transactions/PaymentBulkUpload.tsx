import ErrorOutline from '@mui/icons-material/ErrorOutline';
import { Alert, Box, Stack, TextField, Typography } from '@mui/material';
import { GridOverlay } from '@mui/x-data-grid-pro';
import { GridApiPro } from '@mui/x-data-grid-pro/models/gridApiPro';
import {
  allBulkInitialMarketValueDateState,
  bulkUploadTransactionItemsState,
  clientApiState,
  fxFetchingSpotRateState,
  paymentDetailsValidationState,
  paymentspotRateDataState,
  paymentSpotRateRequestDataState,
  transactionRequestDataState,
} from 'atoms';
import { TransactionDropzone } from 'components/bulkUpload';
import BulkUploadGrid from 'components/bulkUpload/BulkUploadGrid';
import CustomDatePicker from 'components/shared/CustomDatePicker';
import {
  BeneficiaryAccountDetails,
  SettlementAccountDetails,
  WalletAccountDetails,
} from 'components/wallets';
import { format } from 'date-fns';
import {
  useBulkSummaryHelper,
  useTransactionHelpers,
  useWalletAndPaymentHelpers,
} from 'hooks';
import {
  convertPangeaPaymentToTransactionRequestData,
  convertTransactionRequestDataToPangeaPayment,
  PangeaPayment,
  TransactionDropzoneResult,
  TransactionRecord,
} from 'lib';
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import { PangeaColors } from 'styles';
import { PangeaSimpleDialog } from '../modals';
import {
  PangeaButton,
  TransactionAmountControl,
  TransactionSettlementControl,
} from '../shared';
import { v4 } from 'uuid';
import { isError } from 'lodash';

export const PaymentBulkUpload = ({
  onTransactionsAdded,
}: {
  onTransactionsAdded?: (items: TransactionRecord[], count: number) => void;
}) => {
  const api = useRecoilValue(clientApiState);
  const [gridApiRef, setGridApiRef] = useState<MutableRefObject<GridApiPro>>();
  const [, setErrors] = useState<Error[]>([]);
  const [editableTransaction, setEditableTransaction] =
    useState<Optional<TransactionRecord>>(undefined);
  const [bulkUploadRows, setBulkUploadRows] = useRecoilState(
    bulkUploadTransactionItemsState,
  );
  const { setPaymentSpotRateRequestPayload } = useWalletAndPaymentHelpers();
  const setBulkInitialMarketValueDate = useSetRecoilState(
    allBulkInitialMarketValueDateState,
  );
  const resetSpotRateRequestPayload = useResetRecoilState(
    paymentSpotRateRequestDataState,
  );
  const resetTransactionRequestData = useResetRecoilState(
    transactionRequestDataState,
  );
  const resetSpotRateData = useResetRecoilState(paymentspotRateDataState);
  const addTransactions = useCallback(
    (transactions: TransactionRecord[]) => {
      setBulkUploadRows((rows) => {
        const newRows = [...rows, ...transactions];
        onTransactionsAdded?.(transactions, newRows.length);
        return newRows;
      });
    },
    [onTransactionsAdded, setBulkUploadRows],
  );
  const updateTransaction = useCallback(
    (transactions: TransactionRecord[]) => {
      setBulkUploadRows((rows) => {
        const newRows = rows.map((row) => {
          const match = transactions.find(
            (transaction) => transaction.id === row.id,
          );
          if (match) {
            match.payment_id = row.payment_id;
          }
          return match ?? row;
        });
        return newRows;
      });
    },
    [setBulkUploadRows],
  );
  const getAllPairsInitialMarketData = useCallback(
    async (pairs: string[]) => {
      const apiHelper = api.getAuthenticatedApiHelper();
      const allPairsMarketData =
        await apiHelper.validateAllBulkMarketPairsAsync({
          pairs,
        });
      if (allPairsMarketData && !isError(allPairsMarketData)) {
        setBulkInitialMarketValueDate(allPairsMarketData);
      }
    },
    [api, setBulkInitialMarketValueDate],
  );

  const handleDropzoneDataAdded = useCallback(
    (data: TransactionDropzoneResult) => {
      const allRows: TransactionRecord[] = [];
      if (data.transactions) {
        allRows.push(...data.transactions);
        addTransactions(allRows);
        const allPairsInitialMarketData = allRows
          .filter((row) => row.buy_currency && row.sell_currency)
          .map((row) => `${row.buy_currency}${row.sell_currency}`);
        getAllPairsInitialMarketData([...new Set(allPairsInitialMarketData)]);
      }
      if (data.errors && data.errors.length > 0) {
        console.error(data.errors);
        setErrors(data.errors);
      }
    },
    [addTransactions, getAllPairsInitialMarketData],
  );
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { parseTransactionsCsvFileAsync } = useTransactionHelpers();
  const handleAddTransaction = () => {
    setEditableTransaction(undefined);
    setOpenModal(true);
  };
  const handleEditTransaction = useCallback(
    (transaction: TransactionRecord) => {
      setPaymentSpotRateRequestPayload({
        subscription: true,
        sell_currency: transaction.sell_currency ?? '',
        buy_currency: transaction.buy_currency ?? '',
        value_date: format(
          transaction.delivery_date
            ? new Date(transaction.delivery_date)
            : new Date(),
          'yyyy-MM-dd',
        ),
      });
      setEditableTransaction(transaction);
      setOpenModal(true);
    },
    [setPaymentSpotRateRequestPayload],
  );

  const handleCloseModal = useCallback(
    (_: any, reason: 'backdropClick' | 'escapeKeyDown' | 'closeIconClick') => {
      if (reason == 'backdropClick') {
        return;
      }
      setOpenModal(false);
      resetSpotRateRequestPayload();
      resetSpotRateData();
    },
    [resetSpotRateData, resetSpotRateRequestPayload],
  );

  const handleUploadCsv = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.addEventListener('change', async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const files = target.files;
      if (files) {
        const fileArray = Array.from(files);
        for (const f of fileArray) {
          const myRecords = await parseTransactionsCsvFileAsync(f);
          handleDropzoneDataAdded({ ...myRecords });
        }
      }
    });
    input.click();
  };
  const { transactionsCount, needsReviewCount } = useBulkSummaryHelper();

  return (
    <Stack direction='column' spacing={3}>
      <Box
        sx={{
          borderRadius: '4px',
          border: '1px solid #E0E0E0',
          padding: '12px 24px',
        }}
      >
        <Stack direction='row' columnGap={3} rowGap={3} flexWrap='wrap'>
          <Stack direction='column'>
            <Typography variant='dataLabel'>Transactions</Typography>
            <Typography variant='h5'>{transactionsCount}</Typography>
          </Stack>
          <Stack direction='column'>
            <Typography variant='dataLabel'>Needs Review</Typography>
            <Typography variant='h5'>{needsReviewCount}</Typography>
          </Stack>
        </Stack>
      </Box>
      {needsReviewCount > 0 && (
        <Alert
          variant='filled'
          sx={{ bgcolor: PangeaColors.EarthBlueMedium }}
          icon={<ErrorOutline />}
        >
          <Typography variant='body1'>
            Resolve transactions that need review below.
          </Typography>
        </Alert>
      )}
      <BulkUploadGrid
        rows={bulkUploadRows}
        uploadCsvClicked={handleUploadCsv}
        addTransactionClicked={handleAddTransaction}
        editTransactionClicked={handleEditTransaction}
        setGridApiRef={setGridApiRef}
        noRowsOverlay={
          <GridOverlay>
            <TransactionDropzone onDataAdded={handleDropzoneDataAdded} />
          </GridOverlay>
        }
      />
      <PangeaSimpleDialog
        width={'565px'}
        openModal={openModal}
        noButton
        onClose={handleCloseModal}
      >
        <Typography variant='h5'>
          {editableTransaction ? 'Edit' : 'Add'} Transaction
        </Typography>
        <ManageTransaction
          onAdd={(t) => {
            addTransactions(
              t.map((x) => ({
                ...x,
                id: v4(),
              })) as unknown[] as TransactionRecord[],
            );
            setOpenModal(false);
            resetSpotRateRequestPayload();
            resetSpotRateData();
            resetTransactionRequestData();
          }}
          onUpdate={(t) => {
            gridApiRef?.current?.updateRows(t);
            updateTransaction(t);
            setOpenModal(false);
            resetSpotRateRequestPayload();
            resetSpotRateData();
            resetTransactionRequestData();
          }}
          editableTransaction={editableTransaction}
        />
      </PangeaSimpleDialog>
    </Stack>
  );
};

function ManageTransaction({
  onAdd,
  onUpdate,
  editableTransaction,
}: {
  onAdd: (transactions: Array<TransactionRecord>) => void;
  onUpdate: (transactions: TransactionRecord[]) => void;
  editableTransaction?: TransactionRecord;
}): JSX.Element {
  const [transactionRequestData, setTransactionRequestData] = useRecoilState(
    transactionRequestDataState,
  );
  const resetTransactionRequestData = useResetRecoilState(
    transactionRequestDataState,
  );
  const fetchingSpotRate = useRecoilValue(fxFetchingSpotRateState);
  const isEditMode = !!editableTransaction;

  const {
    getPaymentsV2SpotRate,
    isWalletAccount,
    isSettlementAccount,
    CustomDialog,
    setOpenDialog,
    openDialog,
    selectedAccountForDetails,
    isBeneficiaryAccount,
    paymentSpotRateRequestPayload,
  } = useWalletAndPaymentHelpers();
  const { isDescriptionValid } = useTransactionHelpers();
  const paymentDetailsValidation = useRecoilValue(
    paymentDetailsValidationState,
  );
  const initialMarketState = useRecoilValue(paymentspotRateDataState);
  const isPaymentDataValid = useMemo(
    () => Object.values(paymentDetailsValidation).every((v) => v),
    [paymentDetailsValidation],
  );

  const handleOnDialogClose = useCallback(() => {
    setOpenDialog(false);
  }, [setOpenDialog]);
  const handleAddPayment = useCallback(() => {
    const paymentData = convertTransactionRequestDataToPangeaPayment(
      transactionRequestData,
    );
    onAdd([paymentData] as TransactionRecord[]);
  }, [onAdd, transactionRequestData]);

  const handleUpdatePayment = useCallback(() => {
    if (editableTransaction) {
      const paymentData = convertTransactionRequestDataToPangeaPayment(
        transactionRequestData,
      );
      onUpdate([
        { ...paymentData, id: editableTransaction.id },
      ] as TransactionRecord[]);
    }
  }, [editableTransaction, onUpdate, transactionRequestData]);

  useEffect(() => {
    if (editableTransaction) {
      const editableTransactionData =
        convertPangeaPaymentToTransactionRequestData(
          editableTransaction as PangeaPayment,
        );
      setTransactionRequestData(editableTransactionData);
      if (
        paymentSpotRateRequestPayload &&
        paymentSpotRateRequestPayload.sell_currency &&
        paymentSpotRateRequestPayload.buy_currency
      ) {
        getPaymentsV2SpotRate(paymentSpotRateRequestPayload);
      }
    }
    return () => {
      resetTransactionRequestData();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editableTransaction]);

  useEffect(() => {
    if (initialMarketState && editableTransaction) {
      setTransactionRequestData((payment) => ({
        ...payment,
        cntr_amount:
          initialMarketState.rate > 1
            ? parseFloat((payment.amount * initialMarketState.rate).toFixed(2))
            : parseFloat((payment.amount / initialMarketState.rate).toFixed(2)),
        payment_amount:
          initialMarketState.rate > 1
            ? parseFloat(
                (payment.settlement_amount * initialMarketState.rate).toFixed(
                  2,
                ),
              )
            : parseFloat(
                (payment.settlement_amount / initialMarketState.rate).toFixed(
                  2,
                ),
              ),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMarketState]);

  return (
    <Stack spacing={3} sx={{ minHeight: '445px', pt: 4 }}>
      <TextField
        id='description'
        label='Description'
        value={transactionRequestData.payment_reference}
        variant='filled'
        onChange={(event) => {
          setTransactionRequestData((payload) => {
            return {
              ...payload,
              payment_reference: event.target.value,
            };
          });
        }}
        error={!isDescriptionValid(transactionRequestData.payment_reference)}
        helperText={
          !isDescriptionValid(transactionRequestData.payment_reference)
            ? 'Description is required and must be alphanumeric and less than 150 characters.'
            : ''
        }
      />

      <TransactionAmountControl
        onCreateOrUpdateTransaction={() => Promise.resolve()}
        transactionRequestData={transactionRequestData}
        setTransactionRequestData={setTransactionRequestData}
        isLoadingCurrency={false}
      />

      <Stack pt={2}>
        <Typography
          variant='body2'
          pb={1}
          color={PangeaColors.BlackSemiTransparent87}
        >
          Value Date
        </Typography>
        <Stack flexDirection={'row'} alignItems={'center'} gap={1}>
          <CustomDatePicker
            isDisabled={fetchingSpotRate}
            controlDate={transactionRequestData.delivery_date}
            handleChange={(val: Date | null | undefined) => {
              setTransactionRequestData((payment) => ({
                ...payment,
                delivery_date: val,
              }));
            }}
            showDateError={false}
          />
        </Stack>
      </Stack>
      <TransactionSettlementControl
        transactionRequestData={transactionRequestData}
        setTransactionRequestData={setTransactionRequestData}
        onCreateOrUpdateTransaction={() => Promise.resolve()}
      />
      <CustomDialog onClose={handleOnDialogClose} open={openDialog}>
        {selectedAccountForDetails &&
          isBeneficiaryAccount(selectedAccountForDetails) && (
            <BeneficiaryAccountDetails
              account={selectedAccountForDetails}
              onCloseModal={handleOnDialogClose}
            />
          )}
        {selectedAccountForDetails &&
          isSettlementAccount(selectedAccountForDetails) && (
            <SettlementAccountDetails
              account={selectedAccountForDetails}
              onCloseModal={handleOnDialogClose}
            />
          )}
        {selectedAccountForDetails &&
          isWalletAccount(selectedAccountForDetails) && (
            <WalletAccountDetails
              account={selectedAccountForDetails}
              onCloseModal={handleOnDialogClose}
            />
          )}
      </CustomDialog>
      <Stack direction='row' justifyContent='flex-end'>
        <PangeaButton
          disabled={!isPaymentDataValid}
          onClick={isEditMode ? handleUpdatePayment : handleAddPayment}
        >
          {isEditMode ? 'Save' : 'Add Payment'}
        </PangeaButton>
      </Stack>
    </Stack>
  );
}
export default PaymentBulkUpload;
