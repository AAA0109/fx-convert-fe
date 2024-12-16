import { allBulkInitialMarketValueDateState } from 'atoms';
import { Info, parse as parseCsv } from 'csv-parse';
import {
  format,
  isFuture,
  isToday,
  isValid,
  parseISO,
  isSameDay,
  isAfter,
} from 'date-fns';
import { useWalletAndPaymentHelpers } from 'hooks';
import {
  TransactionCsvRecord,
  TransactionDropzoneResult,
  TransactionRecord,
} from 'lib';
import { cloneDeep } from 'lodash';
import { useCallback, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { v4 } from 'uuid';

export const useTransactionHelpers = () => {
  const { allWallets, beneficiaryAccounts, settlementAccounts } =
    useWalletAndPaymentHelpers();
  const allPairsMarketData = useRecoilValue(allBulkInitialMarketValueDateState);
  const isValueDateValid = useCallback((valueDate: string) => {
    const date = parseISO(valueDate);
    return isValid(date) && (isToday(date) || isFuture(date));
  }, []);
  const isDescriptionValid = useCallback((description: string) => {
    return /^[\w\s\W]{1,150}$/.test(description);
  }, []);
  const isAmountValid = useCallback((amount: number) => {
    return amount > 0;
  }, []);

  const validateValueDateByMarket = useCallback(
    (pair: string, valueDate: Date) => {
      const marketData = allPairsMarketData?.spot_dates.find(
        (data) => data.pair === pair,
      );
      if (!marketData) {
        return false;
      }
      const selectedValueDate = valueDate;
      const marketValueDate = parseISO(marketData.spot_date);

      return (
        isSameDay(selectedValueDate, marketValueDate) ||
        isAfter(selectedValueDate, marketValueDate)
      );
    },
    [allPairsMarketData?.spot_dates],
  );

  const isSourceAccountValid = useCallback(
    (sourceAccount: string) => {
      if (allWallets.find((wallet) => wallet.wallet_id === sourceAccount)) {
        return true;
      }
      if (
        settlementAccounts.find(
          (account) => account.wallet_id === sourceAccount,
        )
      ) {
        return true;
      }
      return false;
    },
    [allWallets, settlementAccounts],
  );

  const isDestinationAccountValid = useCallback(
    (destinationAccount: string) => {
      if (
        allWallets.find((wallet) => wallet.wallet_id === destinationAccount)
      ) {
        return true;
      }
      if (
        beneficiaryAccounts.find(
          (account) => account.beneficiary_id === destinationAccount,
        )
      ) {
        return true;
      }
      return false;
    },
    [allWallets, beneficiaryAccounts],
  );

  const parseTransactionsCsvFileAsync = useCallback(
    async (file: File): Promise<TransactionDropzoneResult> => {
      const csvText = await file.text();
      const hasHeaderRow =
        csvText.startsWith('DESCRIPTION') || csvText.startsWith('Description');
      const columnHeaders = [
        'Description',
        'SellCurrency',
        'BuyCurrency',
        'LockSide',
        'Amount',
        'ValueDate',
        'Origin',
        'Destination',
        'PurposeOfPayment',
      ];
      const errors: Error[] = [];
      const transactions: TransactionRecord[] = [];

      if (!hasHeaderRow) {
        errors.push(new Error('Invalid CSV file format'));
        return { errors, transactions };
      }
      return await new Promise<TransactionDropzoneResult>((resolve) => {
        const parser = parseCsv(
          {
            autoParse: true,
            autoParseDate: true,
            delimiter: ',',
            columns: hasHeaderRow ? () => columnHeaders : columnHeaders,
            skip_empty_lines: true,
            skip_records_with_error: true,
          },
          (_err, records: TransactionCsvRecord[]) => {
            const csvErrors = cloneDeep(errors);
            const getLineNumber = (index: number) => {
              let indexLine = 1 + index;
              let prevIndex = indexLine;
              indexLine += csvErrors.filter(
                (e) => (e as unknown as Info).lines <= indexLine,
              ).length;
              while (indexLine > prevIndex) {
                const newErrs = csvErrors.filter(
                  (e) =>
                    (e as unknown as Info).lines <= indexLine &&
                    (e as unknown as Info).lines > prevIndex,
                ).length;
                prevIndex = indexLine;
                indexLine += newErrs;
              }
              return indexLine;
            };
            records.forEach((record: TransactionCsvRecord, index) => {
              let errorMessage = '';
              // Check validity description
              if (!isDescriptionValid(record.Description)) {
                errorMessage = `Invalid description '${record.Description}'`;
              }
              // Check validity amount
              if (!isAmountValid(record.Amount)) {
                errorMessage = `Invalid amount '${record.Amount}'`;
              }
              // Check validity value date
              if (
                record.ValueDate &&
                !isValueDateValid(record.ValueDate.toString())
              ) {
                errorMessage = `Invalid value date '${record.ValueDate}'`;
                if (record.BuyCurrency && record.SellCurrency) {
                  const pair = `${record.SellCurrency}${record.BuyCurrency}`;
                  if (!validateValueDateByMarket(pair, record.ValueDate)) {
                    errorMessage = `Invalid value date '${record.ValueDate}' for pair '${pair}'`;
                  }
                }
              }
              // Check validity source account
              if (!isSourceAccountValid(record.Origin)) {
                errorMessage = `Invalid source account '${record.Origin}'`;
              }
              // Check validity destination account
              if (!isDestinationAccountValid(record.Destination)) {
                errorMessage = `Invalid destination account '${record.Destination}'`;
              }

              if (errorMessage !== '') {
                errors.push(
                  new Error(`${errorMessage} on line ${getLineNumber(index)}`),
                );
              }
              transactions.push({
                name: record.Description,
                sell_currency: record.SellCurrency,
                buy_currency: record.BuyCurrency,
                lock_side: record.LockSide,
                amount: record.Amount,
                delivery_date: record.ValueDate
                  ? format(new Date(record.ValueDate), 'yyyy-MM-dd')
                  : '',
                origin_account_id: record.Origin,
                destination_account_id: record.Destination,
                purpose_of_payment: record.PurposeOfPayment,
                id: v4(),
              } as unknown as TransactionRecord);
            });
            resolve({ errors, transactions });
          },
        );
        parser.on('skip', (err) => {
          errors.push(err);
        });
        parser.write(csvText);
        parser.end();
      });
    },
    [
      isDescriptionValid,
      isAmountValid,
      isValueDateValid,
      isSourceAccountValid,
      isDestinationAccountValid,
      validateValueDateByMarket,
    ],
  );

  return useMemo(
    () => ({
      parseTransactionsCsvFileAsync,
      isValueDateValid,
      isDescriptionValid,
      isAmountValid,
      isSourceAccountValid,
      isDestinationAccountValid,
      validateValueDateByMarket,
    }),
    [
      isAmountValid,
      isDescriptionValid,
      isDestinationAccountValid,
      isSourceAccountValid,
      isValueDateValid,
      parseTransactionsCsvFileAsync,
      validateValueDateByMarket,
    ],
  );
};
