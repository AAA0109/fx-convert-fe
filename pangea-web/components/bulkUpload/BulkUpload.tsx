import ErrorOutline from '@mui/icons-material/ErrorOutline';
import Message from '@mui/icons-material/Message';
import { Alert, Stack, Typography } from '@mui/material';
import { bulkUploadItemsState } from 'atoms';
import { useCashflowHelpers, useFeatureFlags } from 'hooks';
import {
  AnyHedgeItem,
  BaseHedgeItem,
  Cashflow,
  DropzoneResult,
  Installment,
} from 'lib';
import { cloneDeep } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { PangeaColors } from 'styles';
import { PangeaSimpleDialog } from '../modals';
import { PangeaButton } from '../shared';
import BulkCashflowUploadGrid from './BulkCashflowUploadGrid';
import { CreateCashflowModalContentShell } from './CreateCashflowModalContentShell';
import { Dropzone } from './Dropzone';

const PLURAL_RULES = new Intl.PluralRules('en-us');
const SINGLE_CF_START = 'cash flow has';
const SINGLE_CF_END = 'this cash flow';
const MULTI_CF_START = 'cash flows have';
const MULTI_CF_END = 'these cash flows';

export const BulkUpload = ({
  onCashflowsAdded,
}: {
  onCashflowsAdded?: (items: BaseHedgeItem[], count: number) => void;
}) => {
  const [showError, setShowError] = useState(false);
  const [errors, setErrors] = useState<Error[]>([]);
  const [startLabel, setStartLabel] = useState(MULTI_CF_START);
  const [endLabel, setEndLabel] = useState(MULTI_CF_END);
  const { isCashflowDateValid, isCashflowCurrencyValid } = useCashflowHelpers();
  const { isFeatureEnabled } = useFeatureFlags();
  const [editableHedgeItem, setEditableHedgeItem] =
    useState<Optional<AnyHedgeItem>>(undefined);
  const [bulkUploadRows, setBulkUploadRows] =
    useRecoilState(bulkUploadItemsState);
  const addCashflows = useCallback(
    (hedgeItems: AnyHedgeItem[]) => {
      setBulkUploadRows((rows) => {
        const newRows = [...rows, ...hedgeItems];
        onCashflowsAdded?.(hedgeItems, newRows.length);
        return newRows;
      });
      setShowError(false);
    },
    [onCashflowsAdded, setBulkUploadRows],
  );
  const handleDropzoneDataAdded = useCallback(
    (data: DropzoneResult) => {
      const allRows: AnyHedgeItem[] = [];
      if (data.cashflows) {
        allRows.push(...data.cashflows);
      }
      if (data.installments) {
        allRows.push(...data.installments);
      }
      addCashflows(allRows);
      if (data.errors && data.errors.length > 0) {
        console.error(data.errors);
        setShowError(true);
        setErrors(data.errors);
        return;
      }
    },
    [addCashflows],
  );
  const [openModal, setOpenModal] = useState<boolean>(false);
  const handleAddCashflow = () => {
    setEditableHedgeItem(undefined);
    setOpenModal(true);
  };
  const handleEditCashflow = (hedgeItem: AnyHedgeItem) => {
    setEditableHedgeItem(hedgeItem);
    setOpenModal(true);
  };
  const handleDoneClicked = (hedgeItem: AnyHedgeItem) => {
    setOpenModal(false);
    const tmpRows = cloneDeep(bulkUploadRows);
    const matchingRowIndex = tmpRows.findIndex(
      (hi) => hi.internal_uuid === hedgeItem.internal_uuid,
    );
    const isNew = matchingRowIndex == -1;
    tmpRows.splice(isNew ? 0 : matchingRowIndex, isNew ? 0 : 1, hedgeItem);

    setBulkUploadRows(tmpRows);
  };

  // Added this useEffect to check the validity of the uploaded items when rows are deleted
  useEffect(() => {
    const updatedErrors: Error[] = [];
    bulkUploadRows.forEach((hedgeItem) => {
      let errorMessage = '';
      const hI =
        hedgeItem.type === 'installments'
          ? (hedgeItem as Installment)
          : (hedgeItem as Cashflow);
      // Check validity of currency
      if (!isCashflowCurrencyValid(hI.currency ?? '')) {
        errorMessage = `Invalid currency '${hI.currency}'`;
      }
      // Check validity of EndDate
      if (!isCashflowDateValid(hI.endDate)) {
        errorMessage += `${errorMessage ? ', ' : ''}Invalid date '${
          hI.endDate
        }'`;
      }
      // Create new error if both Currency and EndDate or any are invalid
      if (errorMessage !== '') {
        updatedErrors.push(new Error(`${errorMessage}`));
      }
    });
    setErrors(updatedErrors);
    setShowError(updatedErrors.length > 0);

    const isSingular = PLURAL_RULES.select(updatedErrors.length) === 'one';

    setStartLabel(isSingular ? SINGLE_CF_START : MULTI_CF_START);
    setEndLabel(isSingular ? SINGLE_CF_END : MULTI_CF_END);
  }, [bulkUploadRows, isCashflowCurrencyValid, isCashflowDateValid]);

  return (
    <Stack direction='column' spacing={3}>
      <Dropzone onDataAdded={handleDropzoneDataAdded} />
      {showError && isFeatureEnabled('cashflow-validate-end-date') && (
        <Alert
          variant='filled'
          color='error'
          icon={<ErrorOutline />}
          action={
            <PangeaButton
              size='medium'
              variant='text'
              endIcon={<Message />}
              href='/account/help'
              sx={{ color: PangeaColors.White }}
            >
              Contact Support
            </PangeaButton>
          }
        >
          <Typography variant='body1'>
            {errors.length} {startLabel} invalid values. Please edit or delete{' '}
            {endLabel} to continue.
          </Typography>
        </Alert>
      )}
      <BulkCashflowUploadGrid
        rows={bulkUploadRows}
        addCashflowClicked={handleAddCashflow}
        editCashflowClicked={handleEditCashflow}
      />
      <PangeaSimpleDialog
        width={'430px'}
        openModal={openModal}
        noButton
        onClose={(_event, reason) => {
          if (reason == 'backdropClick') {
            return;
          }
          setOpenModal(false);
        }}
      >
        <CreateCashflowModalContentShell
          doneButtonClicked={handleDoneClicked}
          hedgeItem={editableHedgeItem}
        />
      </PangeaSimpleDialog>
    </Stack>
  );
};
export default BulkUpload;
