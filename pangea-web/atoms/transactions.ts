import {
  PangeaBulkPaymentNettingResult,
  PangeaBulkRfqStatus,
  PangeaCurrencyResponse,
  PangeaPayment,
  TransactionRecord,
} from 'lib';
import { atom, DefaultValue, selector } from 'recoil';
import { v4 as uuid } from 'uuid';
import { plainLocalStorageEffect } from './effects';

export type ExtendablePayment = Array<
  Partial<PangeaPayment> & {
    spot_rate?: Nullable<number>;
    fee?: Nullable<string>;
  }
>;
export type ExtendedPangeaBulkPaymentResponse = {
  payments: ExtendablePayment;
  netting: PangeaBulkPaymentNettingResult[];
  payment_group?: string;
};

export const internalExistingPaymentIdState = atom<Nullable<string>>({
  key: 'internalExistingPaymentId',
  default: selector({
    key: 'internalExistingPaymentId/Default',
    get: () => null,
  }),
  effects: [plainLocalStorageEffect('existing-payment-id')],
});

export const existingPaymentIdState = selector<Nullable<string>>({
  key: 'existingPaymentId',
  get: ({ get }) => {
    return get(internalExistingPaymentIdState);
  },
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      set(internalExistingPaymentIdState, null);
      return;
    }

    set(internalExistingPaymentIdState, newValue);
  },
});

export const internalBulkTransactionUploadItemsState = atom<object[]>({
  key: 'internalBulkTransactionUploadItems',
  default: selector({
    key: 'internalBulkTransactionUploadItems/Default',
    get: () => [],
  }),
  effects: [plainLocalStorageEffect('internal-bulk-transaction-upload-items')],
});

export const bulkUploadTransactionItemsState = selector<TransactionRecord[]>({
  key: 'bulkUploadTransactionItems',
  get: ({ get }) => {
    const serializedItems = get(internalBulkTransactionUploadItemsState);
    return serializedItems.map(
      (item) =>
        ({
          ...item,
          internal_uuid: uuid(),
        } as TransactionRecord),
    );
  },
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      set(internalBulkTransactionUploadItemsState, []);
      return;
    }

    set(
      internalBulkTransactionUploadItemsState,
      newValue.map((item) => new Object(item)),
    );
  },
});

export const createdBulkTransactionItemsState =
  atom<ExtendedPangeaBulkPaymentResponse>({
    key: 'createdBulkTransactionItems',
    default: selector({
      key: 'createdBulkTransactionItems/Default',
      get: () => ({
        payments: [],
        netting: [],
        payment_group: '',
      }),
    }),
    effects: [plainLocalStorageEffect('created-bulk-transaction-items')],
  });

export const allBulkTransactionItemsState =
  selector<ExtendedPangeaBulkPaymentResponse>({
    key: 'allBulkTransactionItems',
    get: ({ get }) => {
      const serializedItems = get(createdBulkTransactionItemsState);
      return serializedItems;
    },
    set: ({ set }, newValue) => {
      if (newValue instanceof DefaultValue) {
        set(createdBulkTransactionItemsState, {
          payments: [],
          netting: [],
          payment_group: '',
        });
        return;
      }

      set(createdBulkTransactionItemsState, newValue);
    },
  });

export const bulkPaymentRfqState = atom<Nullable<PangeaBulkRfqStatus>>({
  key: 'bulkPaymentRfq',
  default: null,
});

export const sellCurrencyState = atom<Nullable<PangeaCurrencyResponse>>({
  key: 'sellCurrency',
  default: null,
});

export const buyCurrencyState = atom<Nullable<PangeaCurrencyResponse>>({
  key: 'buyCurrency',
  default: null,
});

export const beneficiaryCreatePayloadState = atom<{ [x: string]: any }>({
  key: 'beneficiaryCreatePayload',
  default: {},
});

export const transactionToApproveState = atom<Nullable<string>>({
  key: 'transactionToApprove',
  default: null,
});
