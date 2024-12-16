import {
  activeHedgeFrequencyTypeState,
  bulkUploadItemsState,
  cashflowOriginalState,
  cashflowState,
  clientApiState,
  corpayCurrencyDefinitionState,
  currencyListState,
  installmentOriginalState,
  installmentState,
  internalBulkUploadItemsState,
  internalCashflowOriginalState,
  internalCashflowState,
  internalInstallmentOriginalState,
  internalInstallmentState,
} from 'atoms';
import { Info, parse as parseCsv } from 'csv-parse';
import {
  AnyHedgeItem,
  BaseHedgeItem,
  Cashflow,
  CashflowCsvRecord,
  DropzoneResult,
  ICashflowUpdateObject,
  Installment,
  PangeaCashFlowCore,
  PangeaCashflowStatusEnum,
  PangeaCurrencyDefinition,
  PangeaDraftCashflowActionEnum,
  PangeaDraftFxForward,
  getEarliestAllowableStartDate,
  getTwoYearsFromToday,
  recurrenceDataFromPattern,
  shortenPayDate,
  standardizeDate,
} from 'lib';
import { cloneDeep, isError, isUndefined, uniq } from 'lodash';
import { useCallback, useMemo } from 'react';
import {
  useRecoilTransaction_UNSTABLE,
  useRecoilValue,
  useRecoilValueLoadable,
} from 'recoil';
import { RRule } from 'rrule';

export const useCashflowHelpers = () => {
  const cashflow = useRecoilValue(cashflowState);
  const installment = useRecoilValue(installmentState);
  const bulkUploadItems = useRecoilValue(bulkUploadItemsState);
  const cashflowOriginal = useRecoilValue(cashflowOriginalState);
  const installmentOriginal = useRecoilValue(installmentOriginalState);
  const authHelper = useRecoilValue(clientApiState);
  const currencies = useRecoilValueLoadable(currencyListState).getValue();
  const MinStartDate = useMemo(() => getEarliestAllowableStartDate(), []);
  const internalUpdateStates = useRecoilTransaction_UNSTABLE(
    ({ set }) =>
      ({
        installmentOriginal,
        installment,
        cashflowOriginal,
        cashflow,
        hedges,
        type,
      }: ICashflowUpdateObject) => {
        if (cashflow) {
          set(internalCashflowState, cashflow.toObject());
          set(internalBulkUploadItemsState, [cashflow.toObject()]);
        }
        if (cashflowOriginal) {
          set(internalCashflowOriginalState, cashflowOriginal.toObject());
        }
        if (installment) {
          set(internalInstallmentState, installment.toObject());
          set(internalBulkUploadItemsState, [installment.toObject()]);
        }
        if (installmentOriginal) {
          set(internalInstallmentOriginalState, installmentOriginal.toObject());
        }
        if (hedges) {
          set(
            internalBulkUploadItemsState,
            hedges.map((item) => item.toObject()),
          );
        }
        if (type) {
          set(activeHedgeFrequencyTypeState, type);
        }
      },
  );
  const saveCurrentCashflowAsync = useCallback(async () => {
    try {
      const c = cashflow.clone();
      await c.saveAsync(authHelper);
      internalUpdateStates({ cashflow: c });
    } catch (e) {
      console.error(e);
    }
  }, [authHelper, cashflow, internalUpdateStates]);

  const saveCurrentInstallmentAsync = useCallback(async () => {
    try {
      const i = installment.clone();
      await i.saveAsync(authHelper);
      internalUpdateStates({ installment: i });
    } catch (e) {
      console.error(e);
    }
  }, [authHelper, installment, internalUpdateStates]);
  const saveBulkUploadHedgeItemsAsync = useCallback(
    async (items = bulkUploadItems) => {
      try {
        const hedgeItemClones = items.map((i) => i.clone());
        const hedgesToUpdate = await Promise.all(
          hedgeItemClones.map(async (h) => {
            await h.saveAsync(authHelper);
            return h;
          }),
        );
        internalUpdateStates({ hedges: hedgesToUpdate });
      } catch (e) {
        console.error(e);
      }
    },
    [authHelper, bulkUploadItems, internalUpdateStates],
  );
  const activateCashflowsAsync = useCallback(async (): Promise<boolean> => {
    try {
      const results = await Promise.all(
        bulkUploadItems.map((hI) => hI.clone().executeAsync(authHelper)),
      );
      if (
        !results.reduce((containsError, result) => {
          if (isError(result)) {
            console.error({ result });
          }
          return containsError || isError(result);
        }, false)
      )
        return true;
    } catch (e) {
      console.error(e);
    }
    return false;
  }, [authHelper, bulkUploadItems]);

  const approveCashflowsAsync = useCallback(async (): Promise<boolean> => {
    try {
      const results = await Promise.all(
        bulkUploadItems.map((hI) => hI.clone().approveAsync(authHelper)),
      );
      if (
        !results.reduce((containsError, result) => {
          if (isError(result)) {
            console.error({ result });
          }
          return containsError || isError(result);
        }, false)
      )
        return true;
    } catch (e) {
      console.error(e);
    }
    return false;
  }, [authHelper, bulkUploadItems]);

  const activateFwHedgeItemsAsync = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        let fXFwdItem: Nullable<PangeaDraftFxForward | Error> = null;
        const api = authHelper.getAuthenticatedApiHelper();

        fXFwdItem = await api.corPayHedgeForwardActivateAsync(id ?? 0);
        bulkUploadItems.forEach((item) => {
          deleteDraftAsync(item);
        });
        if (fXFwdItem && !isError(fXFwdItem) ? fXFwdItem : null) return true;
      } catch (e) {
        console.error(e);
      }
      return false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authHelper, bulkUploadItems],
  );

  const loadFromExistingInstallmentToStateAsync = useCallback(
    async (id: number, force = false, useDrafts = true): Promise<boolean> => {
      if (
        !force &&
        installment.installment_id === id &&
        installmentOriginal?.installment_id == id
      ) {
        return true;
      }
      const api = authHelper.getAuthenticatedApiHelper();
      const pangeaInstallment = await api.getInstallmentByIdAsync(id);
      if (!pangeaInstallment || isError(pangeaInstallment)) {
        return false;
      }
      const i: Nullable<Installment> = await Installment.fromInstallmentIdAsync(
        id,
        authHelper,
        useDrafts,
      );
      if (!i) {
        return false;
      }
      const updateObj: ICashflowUpdateObject = {};
      if (
        force ||
        !installmentOriginal ||
        installmentOriginal.installment_id !== i.installment_id
      ) {
        updateObj.installmentOriginal = i;
        if (
          force ||
          (installment.installment_id ?? 0) < 1 ||
          installment.installment_id !== i.installment_id
        ) {
          updateObj.installment = i;
        }
      }
      updateObj.type = i.type;
      await internalUpdateStates(updateObj);
      return true;
    },
    [
      authHelper,
      installment.installment_id,
      installmentOriginal,
      internalUpdateStates,
    ],
  );
  const loadFromExistingCashflowToStateAsync = useCallback(
    async (
      id: number,
      force = false,
      loadDraftIfAvailable = true,
    ): Promise<boolean> => {
      const api = authHelper.getAuthenticatedApiHelper();
      const pangeaCashflow = await api.getCashflowAsync(id);
      if (!pangeaCashflow || isError(pangeaCashflow)) return false;
      if (pangeaCashflow.installment?.id && pangeaCashflow.installment.id > 0) {
        return await loadFromExistingInstallmentToStateAsync(
          pangeaCashflow.installment.id,
          force,
          loadDraftIfAvailable,
        );
      }
      const c: Cashflow = Cashflow.fromCashflowObject(pangeaCashflow);
      const updateObj: ICashflowUpdateObject = {};
      if (
        force ||
        !cashflowOriginal ||
        cashflowOriginal.id !== c.id ||
        (cashflow.modified && c.modified && cashflow.modified < c.modified) ||
        (cashflowOriginal.modified &&
          c.modified &&
          cashflowOriginal.modified < c.modified) ||
        (c.childDraft && loadDraftIfAvailable && !cashflow.isFromDraftObject())
      ) {
        updateObj.cashflowOriginal = c.clone();
        if (c.childDraft && loadDraftIfAvailable) {
          const childDraft = Cashflow.fromDraftObject(c.childDraft);
          if (
            childDraft.accountId == Cashflow.DEFAULT_ACCOUNT_ID &&
            c.accountId != Cashflow.DEFAULT_ACCOUNT_ID
          ) {
            childDraft.accountId = c.accountId;
          }
          if (childDraft.internal_uuid !== cashflow.internal_uuid) {
            updateObj.cashflow = childDraft;
          }
        } else {
          /*
          I don't really remember why I did this, so I'm going to try just cloning.
          It seems that I was intending this to look like a new draft on the cashflow
          which is probably why i am setting the cashflow_id to the c from above's id.

          */
          const newCashflow = c.copyNew();
          newCashflow.cashflow_id = c.id;

          if (force || cashflow.id < 1 || cashflow.id !== newCashflow.id) {
            updateObj.cashflow = newCashflow;
          }
        }
      }

      updateObj.type = c.type;
      await internalUpdateStates(updateObj);
      return true;
    },
    [
      authHelper,
      cashflow,
      cashflowOriginal,
      internalUpdateStates,
      loadFromExistingInstallmentToStateAsync,
    ],
  );

  const loadFromExistingDraftToStateAsync = useCallback(
    async (id: number): Promise<boolean> => {
      const api = authHelper.getAuthenticatedApiHelper();
      const pangeaDraft = await api.loadDraftByIdAsync(id);
      if (!pangeaDraft || pangeaDraft instanceof Error) return false;
      if (pangeaDraft.cashflow_id && pangeaDraft.cashflow_id > 0) {
        return await loadFromExistingCashflowToStateAsync(
          pangeaDraft.cashflow_id,
        );
      }
      if (pangeaDraft.installment_id && pangeaDraft.installment_id > 0) {
        return await loadFromExistingInstallmentToStateAsync(
          pangeaDraft.installment_id,
          false,
          true,
        );
      }
      const c: Cashflow = Cashflow.fromDraftObject(pangeaDraft);
      const updateObj: ICashflowUpdateObject = {};
      if (
        !cashflowOriginal ||
        cashflowOriginal.id !== c.id ||
        cashflow.id !== c.id
      ) {
        updateObj.cashflowOriginal = c.clone();
        if (cashflow.id !== c.id) {
          updateObj.cashflow = c;
        }
      }
      updateObj.type = c.type;
      await internalUpdateStates(updateObj);
      return true;
    },
    [
      authHelper,
      cashflow.id,
      cashflowOriginal,
      internalUpdateStates,
      loadFromExistingCashflowToStateAsync,
      loadFromExistingInstallmentToStateAsync,
    ],
  );

  const deleteDraftAsync = useCallback(
    async (hedgeItem: BaseHedgeItem) => {
      if (hedgeItem.type !== 'installments') {
        const cashflowItem = hedgeItem as Cashflow;
        const result = await cashflowItem.discard(authHelper);
        if (result && isError(result)) {
          return false;
        }
        return true;
      } else {
        const installmentItem = hedgeItem as Installment;
        let result = true;
        installmentItem?.cashflows.forEach((c) => {
          result = result && !isError(c.discard(authHelper));
        });
        return result;
      }
    },
    [authHelper],
  );
  const deleteHedgeItemAsync = useCallback(
    async (hedgeItem: BaseHedgeItem) => {
      const apiHelper = authHelper.getAuthenticatedApiHelper();
      if (hedgeItem.type !== 'installments') {
        const cashflowItem = hedgeItem as Cashflow;
        cashflowItem.action = PangeaDraftCashflowActionEnum.DELETE;
        const result = await cashflowItem.executeAsync(authHelper);
        if (result && isError(result)) {
          return false;
        }
        return true;
      } else {
        const installmentItem = hedgeItem as Installment;
        if (!installmentItem || !installmentItem.installment_id) {
          return false;
        }
        const result = await apiHelper.deactivateInstallmentAsync(
          installmentItem.installment_id,
        );
        if (result && isError(result)) {
          return false;
        }
        return true;
      }
    },
    [authHelper],
  );

  const getAllCashflowsForAccountByCurrencyAsync = useCallback(
    async (
      account: number,
      newCashflows?: PangeaCashFlowCore[],
      excludeCashflowIds?: number[],
    ): Promise<Record<string, PangeaCashFlowCore[]>[]> => {
      const api = authHelper.getAuthenticatedApiHelper();
      try {
        const allAccountCashflows = (
          await api.getAllCashflowsByQueryAsync({
            account,
            status__in: [
              PangeaCashflowStatusEnum.Active,
              PangeaCashflowStatusEnum.PendingActivation,
            ],
          })
        ).filter(
          (c) => !c.cashflow_id || !excludeCashflowIds?.includes(c.cashflow_id),
        );
        if (newCashflows) {
          newCashflows.forEach((cashflow) => {
            const transformedCashflow = Cashflow.fromCoreObject(cashflow);
            if (transformedCashflow)
              allAccountCashflows.push(transformedCashflow);
          });
        }
        const allCurrencies = uniq(
          allAccountCashflows.map((c) => c.currency),
        ).filter((c) => c && c.length > 0);
        return allCurrencies.map((currency) => {
          // We should never see 'unknown' because we're filtering for non-null above.
          return {
            [currency ?? 'unknown']: allAccountCashflows
              .filter((c) => c.currency === currency)
              .map((c) => c.toCashflowCore(true)),
          };
        });
      } catch (e) {
        console.error(e);
      }
      return [];
    },
    [authHelper],
  );
  const parseCashflowsCsvFileAsync = useCallback(
    async (file: File): Promise<DropzoneResult> => {
      const csvText = await file.text();
      const hasHeaderRow =
        csvText.startsWith('Name') || csvText.startsWith('"Name');
      const columnHeaders = [
        'Name',
        'Description',
        'Currency',
        'Frequency',
        'Recurrence',
        'EndDate',
        'Amount',
      ];
      const errors: Error[] = [];
      return await new Promise<DropzoneResult>((resolve) => {
        const parser = parseCsv(
          {
            autoParse: true,
            autoParseDate: true,
            delimiter: ',',
            columns: hasHeaderRow ? () => columnHeaders : columnHeaders,
            skip_empty_lines: true,
            skip_records_with_error: true,
          },
          (_err, records: CashflowCsvRecord[]) => {
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
            const cashflows: Cashflow[] = [];
            const installments: Installment[] = [];
            const validCurrencyMnemonics = currencies.map((c) => c.mnemonic);
            records.forEach((record: CashflowCsvRecord, index) => {
              const cashflow = new Cashflow();
              cashflow.name = record.Name;
              cashflow.description = record.Description;
              let errorMessage = '';
              // Check validity of currency
              if (!validCurrencyMnemonics.includes(record.Currency)) {
                errorMessage = `Invalid currency '${record.Currency}'`;
              }
              // Check validity of EndDate
              if (new Date(record.EndDate).getTime() < MinStartDate.getTime()) {
                errorMessage += `${errorMessage ? ', ' : ''}Invalid date '${
                  record.EndDate
                }'`;
              }
              // Create new error if both Currency and EndDate or any are invalid
              if (errorMessage !== '') {
                errors.push(
                  new Error(`${errorMessage} on line ${getLineNumber(index)}`),
                );
              }
              cashflow.currency = record.Currency;
              cashflow.directionalAmount = Number(record.Amount);
              switch (record.Frequency) {
                case 'onetime': {
                  cashflow.type = record.Frequency;
                  cashflow.date = new Date(record.EndDate);
                  cashflows.push(cashflow);
                  break;
                }
                case 'recurring': {
                  cashflow.type = record.Frequency;
                  let rrule = null;
                  try {
                    rrule = RRule.fromString(record.Recurrence);
                  } catch {
                    try {
                      rrule = RRule.fromText(record.Recurrence);
                    } catch {
                      errors.push(
                        new Error(
                          `Invalid recurrence pattern ${JSON.stringify(
                            record.Recurrence,
                          )} on line ${getLineNumber(index + 1)}`,
                        ),
                      );
                      break;
                    }
                  }
                  if (rrule) {
                    if (record.EndDate) {
                      rrule.origOptions.until = standardizeDate(record.EndDate);
                    }
                    cashflow.recurrenceData = recurrenceDataFromPattern(
                      rrule.toString(),
                    );
                  }

                  cashflows.push(cashflow);
                  break;
                }
                case 'installments': {
                  cashflow.date = new Date(record.EndDate);
                  const matchingInstallment = installments.find(
                    (i) => i.name === record.Name,
                  );
                  if (matchingInstallment) {
                    matchingInstallment.addCashflow(
                      cashflow.date,
                      cashflow.amount,
                      cashflow.internal_uuid,
                    );
                  } else {
                    const newInstallment = new Installment();
                    newInstallment.name = cashflow.name;
                    newInstallment.currency = cashflow.currency;
                    newInstallment.direction = cashflow.direction;
                    newInstallment.addCashflow(
                      cashflow.date,
                      cashflow.amount,
                      cashflow.internal_uuid,
                    );
                    installments.push(newInstallment);
                  }
                  break;
                }
                default: {
                  break;
                }
              }
            });
            resolve({ errors, cashflows, installments });
          },
        );
        parser.on('skip', (err) => {
          errors.push(err);
        });
        parser.write(csvText);
        parser.end();
      });
    },
    [MinStartDate, currencies],
  );
  const isCashflowDateValid = useCallback(
    (date: Date): boolean => {
      return (
        date.getTime() >= MinStartDate.getTime() &&
        date.getTime() <= getTwoYearsFromToday().getTime()
      );
    },
    [MinStartDate],
  );
  const isCashflowCurrencyValid = useCallback(
    (currency: string): boolean => {
      const validCurrencyMnemonics = currencies.map((c) => c.mnemonic);
      return validCurrencyMnemonics.includes(currency);
    },
    [currencies],
  );
  const isHedgeItemValid = useCallback(
    (hedgeItem: Optional<Nullable<AnyHedgeItem>>): boolean => {
      if (!hedgeItem) {
        return false;
      }
      if (!hedgeItem.name) {
        return false;
      }
      switch (hedgeItem.type) {
        case 'onetime': {
          const c = hedgeItem as Cashflow;
          return c.amount > 0 && isCashflowDateValid(c.date) && !!c.currency;
        }
        case 'recurring': {
          const c = hedgeItem as Cashflow;
          return c.amount > 0 && !!c.recurrenceData && !!c.currency;
        }
        case 'installments': {
          const i = hedgeItem as Installment;
          if (i.cashflows.length == 0) {
            return false;
          }
          if (
            !i.cashflows.reduce(
              (allDatesValid, cashflow) =>
                allDatesValid &&
                (cashflow.date.getTime() >= MinStartDate.getTime() ||
                  !cashflow.isFromDraftObject()),
              true,
            )
          ) {
            return false;
          }
          return true;
        }
        default:
          return false;
      }
    },
    [MinStartDate, isCashflowDateValid],
  );
  const getGraphData = useCallback(
    () =>
      bulkUploadItems.reduce<Record<string, PangeaCashFlowCore[]>>(
        (obj, hI) => {
          if (!hI.currency) {
            return obj;
          }
          const currencyObj =
            hI.type === 'installments'
              ? (hI as Installment).cashflows.map((c) =>
                  shortenPayDate(c.toCashflowCore()),
                )
              : [shortenPayDate((hI as Cashflow).toCashflowCore())];
          const newObj = cloneDeep(obj);
          if (Object.hasOwn(newObj, hI.currency)) {
            newObj[hI.currency].push(...currencyObj);
          } else {
            newObj[hI.currency] = [...currencyObj];
          }
          return newObj;
        },
        {},
      ),
    [bulkUploadItems],
  );
  const getCashflowDates = useCallback(
    (): Date[] =>
      bulkUploadItems
        .flatMap((hI) => {
          switch (hI.type) {
            case 'onetime':
              return (hI as Cashflow).date;
            case 'recurring':
              return (hI as Cashflow).getRrule()?.all();
            case 'installments':
              return (hI as Installment).cashflows.map((c) => c.date);
            default:
              return [];
          }
        })
        .filter((d) => !isUndefined(d)) as Date[],
    [bulkUploadItems],
  );

  const resetHedgeItemsFromOriginal = useCallback(() => {
    internalUpdateStates({
      cashflow: cashflowOriginal ?? cashflow,
      installment: installmentOriginal ?? installment,
    });
  }, [
    cashflow,
    cashflowOriginal,
    installment,
    installmentOriginal,
    internalUpdateStates,
  ]);

  // List of wallet currencies/
  const walletCurrenciesLoadable = useRecoilValueLoadable<
    PangeaCurrencyDefinition[]
  >(corpayCurrencyDefinitionState);
  const isLoadingCurrencies = walletCurrenciesLoadable.state === 'loading';
  const hasAllWalletCurrencies = walletCurrenciesLoadable.state === 'hasValue';
  const allWalletCurrencies = useMemo(
    () =>
      !isLoadingCurrencies && hasAllWalletCurrencies
        ? walletCurrenciesLoadable.getValue()
        : [],
    [hasAllWalletCurrencies, isLoadingCurrencies, walletCurrenciesLoadable],
  );

  return useMemo(
    () => ({
      allWalletCurrencies,
      activateCashflowsAsync,
      approveCashflowsAsync,
      activateFwHedgeItemsAsync,
      saveCurrentCashflowAsync,
      saveCurrentInstallmentAsync,
      saveBulkUploadHedgeItemsAsync,
      loadFromExistingCashflowToStateAsync,
      loadFromExistingInstallmentToStateAsync,
      loadFromExistingDraftToStateAsync,
      getAllCashflowsForAccountByCurrencyAsync,
      deleteDraftAsync,
      deleteHedgeItemAsync,
      parseCashflowsCsvFileAsync,
      isHedgeItemValid,
      isCashflowDateValid,
      isCashflowCurrencyValid,
      getGraphData,
      getCashflowDates,
      resetHedgeItemsFromOriginal,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
};
