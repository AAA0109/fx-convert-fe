import { bulkUploadTransactionItemsState } from 'atoms';
import { useRecoilValue } from 'recoil';
import { useTransactionHelpers } from './useTransactionHelpers';
import { format } from 'date-fns';

type UseBulkSummaryHelperReturn = {
  transactionsCount: number;
  totalAmount: number;
  needsReviewCount: number;
};

export const useBulkSummaryHelper = (): UseBulkSummaryHelperReturn => {
  const bulkUploadRows = useRecoilValue(bulkUploadTransactionItemsState);
  const {
    isAmountValid,
    isDescriptionValid,
    isValueDateValid,
    isSourceAccountValid,
    isDestinationAccountValid,
  } = useTransactionHelpers();
  const transactionsCount = bulkUploadRows.length;
  const needsReviewCount = (() => {
    // return the count of rows that have at least one field null or undefined
    return bulkUploadRows.filter((row) => {
      return (
        !isAmountValid(row.amount ?? 0) ||
        !isDescriptionValid(row.name ?? '') ||
        !isValueDateValid(
          format(row.delivery_date ? new Date(row.delivery_date) : new Date(), 'yyyy-MM-dd'),
        ) ||
        !isSourceAccountValid(row.origin_account_id ?? '') ||
        !isDestinationAccountValid(row.destination_account_id ?? '')
      );
    }).length;
  })();
  const totalAmount = bulkUploadRows.reduce(
    (acc, row) => Number(acc) + Number(row.amount),
    0,
  );
  return { transactionsCount, totalAmount, needsReviewCount };
};

export default useBulkSummaryHelper;
