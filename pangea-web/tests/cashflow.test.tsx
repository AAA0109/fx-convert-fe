import { addDays, formatDuration, intervalToDuration } from 'date-fns';
import {
  Cashflow,
  CashflowDirectionType,
  FrequencyType,
  Installment,
  PangeaCalendarEnum,
  PangeaCashflow,
  PangeaCashflowStatusEnum,
  PangeaDraftCashflow,
  PangeaRollConventionEnum,
} from 'lib';

import { v4 } from 'uuid';

const draft_recurring_cashflow = {
  id: 72,
  date: '2022-08-01T04:00:00Z',
  end_date: '2024-10-20T04:00:00Z',
  currency: 'EUR',
  amount: -147.0,
  created: '2022-07-29T22:01:21.172198Z',
  modified: '2022-07-29T22:02:46.226914Z',
  name: 'A Friday Recurring Demo',
  description: null,
  periodicity:
    'DTSTART:20230801T040000Z\nRRULE:FREQ=MONTHLY;INTERVAL=2;BYDAY=+1MO;UNTIL=20241020T040000Z',
  calendar: 'WESTERN_CALENDAR',
  roll_convention: 'NEAREST',
  installment_id: null,
  cashflow_id: null,
};

const status_object: PangeaCashflow = {
  id: 104,
  date: '2022-08-17T00:00:00Z',
  end_date: null,
  currency: {
    id: 8,
    symbol: '元',
    mnemonic: 'CNY',
    name: 'Chinese Yuan',
    unit: null,
    numeric_code: '156',
  },
  amount: 715,
  created: '2022-07-29T21:20:30.334969Z',
  modified: '2022-07-29T21:31:12.715146Z',
  name: 'asdf',
  description: null,
  status: PangeaCashflowStatusEnum.PendingDeactivation,
  installment: undefined,
  account: {
    id: 2,
    name: 'moderate',
  },
  periodicity: null,
  calendar: PangeaCalendarEnum.WESTERN_CALENDAR,
  roll_convention: PangeaRollConventionEnum.UNADJUSTED,
  draft: undefined,
  next_date: '',
  draft_fxforward: [],
  fxforward: [],
  booked_rate: 0,
  booked_base_amount: 0,
  booked_cntr_amount: 0,
};

describe('Cash Flow Class Tests', () => {
  //TODO: Issue # 771
  //Deficiency in code/logic. name property needs validation on the setter
  //name - STANDARD
  test('name returns expected value when set', () => {
    const c = new Cashflow();
    ['expected value', null, undefined].forEach((ev) => {
      const expectedValue = ev;
      c.name = expectedValue;
      expect(c.name).toEqual(expectedValue);
      expect(c.name).not.toBe(0);
    });
  });

  //direction - STANDARD
  test('direction returns expected value when set', () => {
    const c = new Cashflow();
    ['paying', 'receiving', null].forEach((ev) => {
      const expectedValue = ev as CashflowDirectionType;
      c.direction = expectedValue;
      expect(c.direction).toEqual(expectedValue);
    });
  });

  //type - STANDARD
  test('type returns expected value when set', () => {
    const c = new Cashflow();
    ['onetime', 'installments', 'recurring', null].forEach((ev) => {
      const expectedValue = ev as FrequencyType;
      c.type = expectedValue;
      expect(c.type).toEqual(expectedValue);
    });
  });

  //currency - STANDARD
  test('currency returns expected value when set', () => {
    const c = new Cashflow();
    ['EUR', null, undefined].forEach((ev) => {
      const expectedValue = ev;
      c.currency = expectedValue;
      expect(c.currency).toEqual(expectedValue);
    });
    ['something', '', 'usd'].forEach((ev) => {
      expect(() => {
        c.currency = ev;
      }).toThrow();
    });
  });

  //accountId - STANDARD
  test('accountId returns expected value when set to number', () => {
    const c = new Cashflow();
    const expectedValue = 1000000;
    c.accountId = expectedValue;
    expect(c.accountId).toEqual(expectedValue);
    expect(() => {
      c.accountId = -1000;
    }).toThrow();
  });

  //installment_id - STANDARD
  test('installment_id returns expected value when set', () => {
    const c = new Cashflow();
    [-1, 0, 1, 2, 100, 10000, 100000].forEach((ev) => {
      const expectedValue = ev;
      c.installment_id = expectedValue;
      expect(c.installment_id).toEqual(expectedValue);
    });
    [-10, -2].forEach((ev) => {
      const expectedValue = ev;
      expect(() => {
        c.installment_id = expectedValue;
      }).toThrow();
    });
  });

  //amount - STANDARD
  test('amount returns expected value when set', () => {
    const c = new Cashflow();
    [0, -10, 100, -1000, 10000, 100000, NaN].forEach((ev) => {
      const expectedValue = ev;
      c.amount = expectedValue;
      expect(c.amount).toEqual(Math.abs(expectedValue));
      expect(c.amount).not.toBeUndefined();
      expect(c.amount).not.toBeNull();
    });
  });

  //directionalAmount - STANDARD
  test('directionalAmount returns expected value when set', () => {
    const c = new Cashflow();
    [0, -10, 100, -1000, 10000, 100000, NaN].forEach((ev) => {
      const expectedValue = ev;
      c.directionalAmount = expectedValue;
      expect(c.amount).toEqual(Math.abs(expectedValue));
      expect(c.directionalAmount).toEqual(expectedValue);
      expect(c.directionalAmount).not.toBeUndefined();
      expect(c.directionalAmount).not.toBeNull();
    });
  });

  //originalHash - STANDARD
  test('Original Hash works from Draft Cashflow', () => {
    const c = Cashflow.fromDraftObject(
      draft_recurring_cashflow as PangeaDraftCashflow,
    );
    const originalHash = (c as any).originalHash;
    expect(originalHash !== 0).toBeTruthy();
    expect(originalHash).toBe(c.getHashCode());
    c.name = 'test change';
    expect(originalHash !== c.getHashCode()).toBe(true);
  });

  //TODO: Issue # 775
  //Deficiency in code/logic. id should not be able to be set to a negative value other than -1, but nothing less than -1
  test('id returns expected value when set', () => {
    const c = new Cashflow();
    [-1, 0, 1, 2, 100, 10000, 100000].forEach((ev) => {
      const expectedValue = ev;
      c.id = expectedValue;
      expect(c.id).toEqual(expectedValue);
      expect(c.id).not.toBeNaN();
    });

    [-100, -10].forEach((ev) => {
      const expectedValue = ev;
      expect(() => {
        c.id = expectedValue;
      }).toThrow();
    });
  });

  //internal_uuid - STANDARD
  test('internal_uuid returns expected value when set', () => {
    const c = new Cashflow();
    const expectedValue = v4();
    c.internal_uuid = expectedValue;
    expect(c.internal_uuid).toEqual(expectedValue);
    expect(c.internal_uuid).not.toEqual(undefined);
    expect(c.internal_uuid).not.toBeNull();
    expect(() => {
      c.internal_uuid = 'not a guid';
    }).toThrow();
  });

  //date - STANDARD
  test('date returns expected value when set', () => {
    const c = new Cashflow();
    const expectedValue = new Date();
    c.date = expectedValue;
    expect(c.date).toEqual(expectedValue);
  });

  //created - STANDARD
  test('created returns expected value when set', () => {
    const c = new Cashflow();
    const expectedValue = new Date();
    c.created = expectedValue;
    expect(c.created).toEqual(expectedValue);
    expect(c.created !== new Date()).toBeTruthy();
  });
  test('created returns expected value when set to undefined', () => {
    const c = new Cashflow();
    const expectedValue = undefined;
    c.created = expectedValue;
    expect(c.created).toEqual(expectedValue);
    expect(c.created).toBeUndefined();
    expect(c.created === undefined).toBeTruthy();
    expect(c.created !== undefined).toBeFalsy();
  });

  //modified - STANDARD
  test('modified returns expected value when set', () => {
    const c = new Cashflow();
    const expectedValue = new Date();
    c.modified = expectedValue;
    expect(c.modified).toEqual(expectedValue);
    expect(c.modified !== new Date()).toBeTruthy();
  });
  test('modified returns expected value when set to undefined', () => {
    const c = new Cashflow();
    const expectedValue = undefined;
    c.modified = expectedValue;
    expect(c.modified).toEqual(expectedValue);
    expect(c.modified).toBeUndefined();
    expect(c.modified === undefined).toBeTruthy();
    expect(c.modified !== undefined).toBeFalsy();
  });

  //description - STANDARD
  test('description returns expected value when set', () => {
    const c = new Cashflow();
    ['expected value', null, undefined].forEach((ev) => {
      const expectedValue = ev;
      c.description = expectedValue;
      expect(c.description).toEqual(expectedValue);
    });
  });

  //cashflow_id - STANDARD
  test('cashflow_id returns expected value when set', () => {
    const c = new Cashflow();
    [0, -1, 100, 10000, 100000, null, NaN].forEach((ev) => {
      const expectedValue = ev;
      c.cashflow_id = expectedValue;
      expect(c.cashflow_id).toEqual(expectedValue);
      expect(c.cashflow_id).not.toEqual(undefined);
    });
    [-2, -200].forEach((ev) => {
      const expectedValue = ev;
      expect(() => {
        c.cashflow_id = expectedValue;
      }).toThrow();
    });
  });

  //roll_convention - STANDARD
  test('roll_convention returns expected value when set', () => {
    const c = new Cashflow();
    [
      PangeaRollConventionEnum.FOLLOWING,
      PangeaRollConventionEnum.HALF_MONTH_MODIFIED_FOLLOWING,
      PangeaRollConventionEnum.MODIFIED_FOLLOWING,
      PangeaRollConventionEnum.MODIFIED_PRECEDING,
      PangeaRollConventionEnum.NEAREST,
      PangeaRollConventionEnum.PRECEDING,
      PangeaRollConventionEnum.UNADJUSTED,
    ].forEach((roll) => {
      const expectedValue = roll;
      c.roll_convention = expectedValue;
      expect(c.roll_convention).toEqual(expectedValue);
    });
  });

  //calendar - STANDARD
  test('calendar returns expected value when set', () => {
    const c = new Cashflow();
    [
      PangeaCalendarEnum.WESTERN_CALENDAR,
      PangeaCalendarEnum.NULL_CALENDAR,
    ].forEach((ev) => {
      const expectedValue = ev;
      c.calendar = expectedValue;
      expect(c.calendar).toEqual(expectedValue);
    });
  });

  test('childDraft returns expected value when set', () => {
    const c = new Cashflow();
    const x: unknown = { foo: 1 };
    const expectedValue = x as PangeaDraftCashflow;
    expect(() => {
      c.childDraft = expectedValue;
    }).toThrow();
  });
  test('childDraft returns expected value when set to null', () => {
    const c = new Cashflow();
    const expectedValue = null;
    c.childDraft = expectedValue;
    expect(c.childDraft).toEqual(expectedValue);
    expect(c.childDraft).toBeNull();
  });

  //isDirty - COMPLEX
  // test('isDirty returns expected value when set', () => {
  //   let c = new Cashflow();
  //   expect(c.isDirty).toBe(true);
  //   c.name = 'blah';
  //   expect(c.isDirty).toBe(true);

  //   c = Cashflow.fromDraftObject(
  //     draft_recurring_cashflow as PangeaDraftCashflow,
  //   );
  //   expect(c.isDirty).toBe(false);

  //   c.name = 'A Friday Recurring Demo';
  //   expect(c.isDirty).toBe(false);

  //   c.name = 'flapdoodle';
  //   expect(c.isDirty).toBe(true);

  //   c = Cashflow.fromDraftObject(
  //     draft_recurring_cashflow as PangeaDraftCashflow,
  //   );

  //   c.accountId = 4000;
  //   expect(c.isDirty).toBe(true);

  //   c = Cashflow.fromDraftObject(
  //     draft_recurring_cashflow as PangeaDraftCashflow,
  //   );

  //   c.amount = -147.0;
  //   expect(c.isDirty).toBe(false);

  //   c.amount = 1_000_000;
  //   expect(c.isDirty).toBe(true);

  //   c = Cashflow.fromDraftObject(
  //     draft_recurring_cashflow as PangeaDraftCashflow,
  //   );

  //   c.calendar = 'WESTERN_CALENDAR' as PangeaCalendarEnum;
  //   expect(c.isDirty).toBe(false);

  //   c.calendar = 'EASTERN_CALENDAR' as PangeaCalendarEnum;
  //   expect(c.isDirty).toBe(true);

  //   c = Cashflow.fromDraftObject(
  //     draft_recurring_cashflow as PangeaDraftCashflow,
  //   );

  //   c.cashflow_id = null;
  //   expect(c.isDirty).toBe(false);

  //   c.cashflow_id = 100;
  //   expect(c.isDirty).toBe(true);

  //   c = Cashflow.fromDraftObject(
  //     draft_recurring_cashflow as PangeaDraftCashflow,
  //   );

  //   c.childDraft = null;
  //   expect(c.isDirty).toBe(false);

  //   c = Cashflow.fromDraftObject(
  //     draft_recurring_cashflow as PangeaDraftCashflow,
  //   );

  //   c.created = undefined;
  //   expect(c.isDirty).toBe(true);

  //   c.created = new Date();
  //   expect(c.isDirty).toBe(true);

  //   c = Cashflow.fromDraftObject(
  //     draft_recurring_cashflow as PangeaDraftCashflow,
  //   );

  //   c.currency = 'EUR';
  //   expect(c.isDirty).toBe(false);

  //   c.currency = null;
  //   expect(c.isDirty).toBe(true);

  //   c.currency = undefined;
  //   expect(c.isDirty).toBe(true);

  //   c = Cashflow.fromDraftObject(
  //     draft_recurring_cashflow as PangeaDraftCashflow,
  //   );

  //   c.date = new Date();
  //   expect(c.isDirty).toBe(true);

  //   c.date = new Date();
  //   expect(c.isDirty).not.toBeNull();

  //   c.date = new Date();
  //   expect(c.isDirty).not.toBeUndefined();

  //   c = Cashflow.fromDraftObject(
  //     draft_recurring_cashflow as PangeaDraftCashflow,
  //   );

  //   c.description = null;
  //   expect(c.isDirty).toBe(false);

  //   c.description = undefined;
  //   expect(c.isDirty).toBe(true);

  //   c.description = 'flapdoodle';
  //   expect(c.isDirty).toBe(true);

  //   c = Cashflow.fromDraftObject(
  //     draft_recurring_cashflow as PangeaDraftCashflow,
  //   );

  //   c.direction = 'flapdoodle' as CashflowDirectionType;
  //   expect(c.isDirty).toBe(true);

  //   c.direction = 'receiving';
  //   expect(c.isDirty).toBe(true);

  //   c.direction = 'paying';
  //   expect(c.isDirty).toBe(false);

  //   c.direction = null;
  //   expect(c.isDirty).toBe(true);

  //   c = Cashflow.fromDraftObject(
  //     draft_recurring_cashflow as PangeaDraftCashflow,
  //   );

  //   c.directionalAmount = 100.1679067901;
  //   expect(c.isDirty).toBe(true);

  //   c.directionalAmount = NaN;
  //   expect(c.isDirty).toBe(true);

  //   c = Cashflow.fromDraftObject(
  //     draft_recurring_cashflow as PangeaDraftCashflow,
  //   );

  //   c.id = 72;
  //   expect(c.isDirty).toBe(false);

  //   c = Cashflow.fromDraftObject(
  //     draft_recurring_cashflow as PangeaDraftCashflow,
  //   );

  //   c.installment_id = null;
  //   expect(c.isDirty).toBe(false);

  //   c.installment_id = 45;
  //   expect(c.isDirty).toBe(true);

  //   c = Cashflow.fromDraftObject(
  //     draft_recurring_cashflow as PangeaDraftCashflow,
  //   );

  //   c.internal_uuid = v4();
  //   expect(c.isDirty).toBe(true);

  //   c = Cashflow.fromDraftObject(
  //     draft_recurring_cashflow as PangeaDraftCashflow,
  //   );

  //   c.modified = new Date();
  //   expect(c.isDirty).toBe(true);

  //   c.modified = undefined;
  //   expect(c.isDirty).toBe(true);

  //   c = Cashflow.fromDraftObject(
  //     draft_recurring_cashflow as PangeaDraftCashflow,
  //   );

  //   c.roll_convention = 'NEAREST' as PangeaRollConventionEnum;
  //   expect(c.isDirty).toBe(false);

  //   c.roll_convention = 'flapdoodle' as PangeaRollConventionEnum;
  //   expect(c.isDirty).toBe(true);

  //   c = Cashflow.fromDraftObject(
  //     draft_recurring_cashflow as PangeaDraftCashflow,
  //   );

  //   c.type = 'onetime' as FrequencyType;
  //   expect(c.isDirty).toBe(true);

  //   c.type = 'installments' as FrequencyType;
  //   expect(c.isDirty).toBe(true);

  //   c.type = 'recurring' as FrequencyType;
  //   expect(c.isDirty).toBe(true);

  //   c.type = null;
  //   expect(c.isDirty).toBe(true);

  //   c.type = 'flapdoodle' as FrequencyType;
  //   expect(c.isDirty).toBe(true);
  // });

  //status - COMPLEX
  test('status returns expected value when set', () => {
    const c = Cashflow.fromCashflowObject(status_object);
    expect(c.status).toEqual(status_object.status);
  });

  //ui_status - COMPLEX
  test('ui_status returns expected value when set', () => {
    // Pending Deactivation
    const cashflow_status_object = JSON.parse(
      JSON.stringify(status_object),
    ) as PangeaCashflow;
    let c = Cashflow.fromCashflowObject(cashflow_status_object);
    expect(c.ui_status).toEqual(['pending', 'terminated']);

    //Active
    cashflow_status_object.status = PangeaCashflowStatusEnum.Active;
    c = Cashflow.fromCashflowObject(cashflow_status_object);
    expect(c.ui_status.length).toBeGreaterThanOrEqual(1);
    expect(c.ui_status[0]).toEqual('archived'); // date is in past.

    //Inctive
    cashflow_status_object.status = PangeaCashflowStatusEnum.Inactive;
    c = Cashflow.fromCashflowObject(cashflow_status_object);
    c.date = addDays(new Date(), 4);
    expect(c.ui_status.length).toBeGreaterThanOrEqual(1);
    expect(c.ui_status[0]).toEqual('terminated');

    // Pending Deactivation + Draft
    cashflow_status_object.draft =
      draft_recurring_cashflow as PangeaDraftCashflow;
    cashflow_status_object.status =
      PangeaCashflowStatusEnum.PendingDeactivation;
    c = Cashflow.fromCashflowObject(cashflow_status_object);
    expect(c.ui_status.length).toBeLessThanOrEqual(2);
    expect(c.ui_status).toEqual(['pending', 'terminated']);

    // Pending Activation
    cashflow_status_object.draft = undefined;
    cashflow_status_object.status = PangeaCashflowStatusEnum.PendingActivation;
    c = Cashflow.fromCashflowObject(cashflow_status_object);
    c.date = addDays(new Date(), 4);
    expect(c.ui_status.length).toEqual(1);
    expect(c.ui_status).toEqual(['inflight']);

    // Draft
    c = Cashflow.fromDraftObject(
      draft_recurring_cashflow as PangeaDraftCashflow,
    );
    expect(c.ui_status).toEqual(['draft']);

    // New Cash Flows Have Draft status
    c = new Cashflow();
    expect(c.ui_status).toEqual(['draft']);
  });

  // recurrenceData - COMPLEX
  /* TODO: change recurring appts to only use pattern as input
  test('recurrenceData returns expected value when set', () => {
    let c = new Cashflow();
    c.recurrenceData = null;
    expect(c.recurrenceData).toBeNull();

    c.recurrenceData = {};
    expect(c.recurrenceData).toEqual({});

    c = Cashflow.fromDraftObject(
      draft_recurring_cashflow as PangeaDraftCashflow,
    );
    expect(c.recurrenceData).not.toBeNull();
    expect(Number(c.recurrenceData?.endDate)).toBeGreaterThan(
      Number(new Date('2023-10-18')),
    );
    expect(Number(c.recurrenceData?.endDate)).toBeLessThan(
      Number(new Date('2023-10-22')),
    );

    c = new Cashflow();
    c.recurrenceData = {
      pattern: draft_recurring_cashflow.periodicity,
      endDate: new Date('2024-12-25'),
    };
    expect(c.recurrenceData.endDate).toEqual(new Date('2024-12-25'));

    c = new Cashflow();
    expect(() => {
      c.recurrenceData = {
        pattern: draft_recurring_cashflow.periodicity,
        //startDate: new Date('2024-12-25'),
      };
    }).toThrow('End date must be after start date.');

    c.recurrenceData = {
      pattern: draft_recurring_cashflow.periodicity,
      // startDate: new Date('2024-12-25'),
      // endDate: new Date('2025-12-25'),
    };
    expect(c.recurrenceData.startDate).toEqual(new Date('2024-12-25'));

    //numOccurrences
    c = new Cashflow();
    c.recurrenceData = {
      pattern: draft_recurring_cashflow.periodicity,
      numOccurrences: 1,
    };

    expect(c.recurrenceData.numOccurrences).toBeGreaterThanOrEqual(1);
    expect(c.recurrenceData.numOccurrences).not.toBeNull();
  });*/

  //fromDraftObject - METHOD
  test('fromDraftObject returns expected value when set', () => {
    const c = Cashflow.fromDraftObject(
      draft_recurring_cashflow as PangeaDraftCashflow,
    );
    expect(c.recurrenceData).not.toBeNull();
    expect(c.direction).toEqual('paying');
    expect(c.type).toEqual('recurring');
    expect(c.amount).toEqual(Math.abs(draft_recurring_cashflow.amount));
    expect(c.created).toEqual(new Date(draft_recurring_cashflow.created));
    expect(c.currency).toEqual(draft_recurring_cashflow.currency);
    expect(c.date).toEqual(new Date(draft_recurring_cashflow.date));
    expect(c.description).toEqual(draft_recurring_cashflow.description);
    expect(c.id).toEqual(draft_recurring_cashflow.id);
    expect(c.modified).toEqual(new Date(draft_recurring_cashflow.modified));
    expect(c.name).toEqual(draft_recurring_cashflow.name);
    expect(c.cashflow_id).toEqual(draft_recurring_cashflow.cashflow_id);
    expect(c.installment_id).toEqual(draft_recurring_cashflow.installment_id);
    expect(c.calendar).toEqual(draft_recurring_cashflow.calendar);
    expect(c.roll_convention).toEqual(draft_recurring_cashflow.roll_convention);
  });

  //toDraftObject - METHOD
  test('toDraftObject returns expected value when set', () => {
    const c = Cashflow.fromDraftObject(
      draft_recurring_cashflow as PangeaDraftCashflow,
    );
    const draft = c.toDraftObject();
    expect(draft.amount).toEqual(draft_recurring_cashflow.amount);
    expect(draft.currency).toEqual(c.currency);
    expect(draft.currency).toEqual(c.currency);
    expect(draft.date).not.toBeNull();
    expect(draft.id).toEqual(c.id);
    expect(draft.cashflow_id).toEqual(c.cashflow_id);
    expect(draft.calendar).toEqual(c.calendar);
    expect(draft.description).not.toBeNull();
    expect(draft.name).toEqual(c.name);
    expect(draft.roll_convention).toEqual(c.roll_convention);
    expect(draft.installment_id).not.toBeNull();
    expect(draft.periodicity).not.toBeNull();
    expect(draft.periodicity).toEqual(c.recurrenceData?.pattern);
    expect(draft.periodicity).not.toBeUndefined();
    expect(draft.action).not.toBeNaN();
    expect(draft.action).not.toBeUndefined();
    expect(draft.created).not.toBeNull();
    expect(draft.modified).not.toBeNull();
    expect(draft.roll_convention).not.toBeNull();
    expect(draft.roll_convention).toEqual(c.roll_convention);
    expect(draft.roll_convention).not.toBeUndefined();
  });

  // (constructor) - METHOD
  test('(constructor) returns expected value when set', () => {
    const c = new Cashflow();
    expect(c.amount).toEqual(0);
    expect(c.date).toEqual(new Date(0));
    expect(c.type).toEqual('onetime');
    expect(c.calendar).toEqual(Cashflow.DEFAULT_CALENDAR);
    expect(c.roll_convention).toEqual(Cashflow.DEFAULT_ROLL_CONVENTION);
    expect(c.recurrenceData).toBeNull();
    expect(c.cashflow_id).toBeNull();
    expect(c.childDraft).toBeNull();
  });

  //toObject- METHOD
  test('toObject returns expected value when set', () => {
    const c = Cashflow.fromDraftObject(
      draft_recurring_cashflow as PangeaDraftCashflow,
    );
    const obj = c.toObject();
    expect(obj.id).toEqual(c.id);
    expect(obj.amount).toEqual(draft_recurring_cashflow.amount);
    expect(obj.calendar).toEqual(draft_recurring_cashflow.calendar);
    expect(obj.cashflow_id).toEqual(draft_recurring_cashflow.cashflow_id);
    expect(obj.created).toEqual(new Date(draft_recurring_cashflow.created));
    expect(obj.date).toEqual(new Date(draft_recurring_cashflow.date));
    expect(obj.description).toEqual(draft_recurring_cashflow.description);
    expect(obj.modified).toEqual(new Date(draft_recurring_cashflow.modified));
    expect(obj.recurrenceData).not.toBeNull();
    expect(obj.roll_convention).toEqual(
      draft_recurring_cashflow.roll_convention,
    );
    expect(obj.status).toEqual(c.status);
    expect(obj.childDraft).toEqual(c.childDraft);
    expect(obj.internal_uuid).toEqual(c.internal_uuid);
    expect(obj.action).not.toBeNull();
  });

  //fromObject - METHOD
  //Write tests for fromObject method
  test('fromObject returns expected value when set', () => {
    const c = Cashflow.fromDraftObject(
      draft_recurring_cashflow as PangeaDraftCashflow,
    );
    const obj = c.toObject();
    const c2 = Cashflow.fromObject(obj);
    const originalHash = (c as any).originalHash;
    expect(originalHash !== 0).toBeTruthy();
    expect(originalHash).toBe(c.getHashCode());
    c.name = 'test change';
    expect(originalHash !== c.getHashCode()).toBe(true);
    expect(c2.id).toEqual(c.id);
    expect(c2.type).toEqual(c.type);
    expect(c2.direction).toEqual(c.direction);
    expect(c2.accountId).toEqual(c.accountId);
    expect(c2.amount).toBe(c.amount);
    expect(c2.calendar).toEqual(draft_recurring_cashflow.calendar);
    expect(c2.cashflow_id).toEqual(draft_recurring_cashflow.cashflow_id);
    expect(c2.date).toEqual(new Date(draft_recurring_cashflow.date));
    expect(c2.currency).toEqual(draft_recurring_cashflow.currency);
    expect(c2.description).toEqual(draft_recurring_cashflow.description);
    expect(c2.installment_id).toEqual(draft_recurring_cashflow.installment_id);
    expect(c2.name).toEqual(draft_recurring_cashflow.name);
    expect(c2.modified).toEqual(new Date(draft_recurring_cashflow.modified));
    expect(c2.created).toEqual(new Date(draft_recurring_cashflow.created));
    expect(c2.internal_uuid).toEqual(c.internal_uuid);
    expect(c2.recurrenceData).not.toBeUndefined();
    expect(c2.roll_convention).toEqual(
      draft_recurring_cashflow.roll_convention,
    );
    expect(c2.status).toEqual(c.status);
    expect(c2.childDraft).toEqual(c.childDraft);
    expect(c2.action).not.toBeNull();
  });

  //toJSON - METHOD
  test('toJSON returns expected value when set', () => {
    const c = Cashflow.fromDraftObject(
      draft_recurring_cashflow as PangeaDraftCashflow,
    );
    const obj = c.toJSON();
    expect(obj).toEqual(JSON.stringify(c.toObject()));
  });

  //getHashCode - METHOD
  test('getHashCode returns expected value when set', () => {
    const c = Cashflow.fromDraftObject(
      draft_recurring_cashflow as PangeaDraftCashflow,
    );
    const hash = c.getHashCode();
    expect(hash).not.toBeUndefined();
    expect(hash).not.toBeNaN();
    expect(hash).not.toBeNull();
  });

  //copyNew - METHOD
  test('copyNew returns expected value when set', () => {
    const c = Cashflow.fromDraftObject(
      draft_recurring_cashflow as PangeaDraftCashflow,
    );
    const c2 = c.copyNew();
    expect(c2.id).not.toEqual(c.id);
    expect(c2.type).toEqual(c.type);
    expect(c2.direction).toEqual(c.direction);
    expect(c2.accountId).toEqual(c.accountId);
    expect(c2.amount).toBe(c.amount);
    expect(c2.calendar).toEqual(draft_recurring_cashflow.calendar);
    expect(c2.cashflow_id).toEqual(draft_recurring_cashflow.cashflow_id);
    expect(c2.date).toEqual(new Date(draft_recurring_cashflow.date));
    expect(c2.currency).toEqual(draft_recurring_cashflow.currency);
    expect(c2.description).toEqual(draft_recurring_cashflow.description);
    expect(c2.installment_id).toEqual(draft_recurring_cashflow.installment_id);
    expect(c2.name).toEqual(draft_recurring_cashflow.name);
    expect(c2.modified).not.toEqual(
      new Date(draft_recurring_cashflow.modified),
    );
    expect(c2.created).toBeUndefined();
    expect(c2.internal_uuid).not.toEqual(c.internal_uuid);
    expect(c2.recurrenceData).not.toBeUndefined();
    expect(c2.roll_convention).toEqual(
      draft_recurring_cashflow.roll_convention,
    );
    expect(c2.status).toEqual(c.status);
    expect(c2.childDraft).toEqual(c.childDraft);
    expect(c2.action).not.toBeNull();
  });

  //clone - METHOD
  test('clone returns expected value when set', () => {
    const c = Cashflow.fromDraftObject(
      draft_recurring_cashflow as PangeaDraftCashflow,
    );
    const c2 = c.clone();
    expect(c2.id).toEqual(c.id);
    expect(c2.type).toEqual(c.type);
    expect(c2.direction).toEqual(c.direction);
    expect(c2.accountId).toEqual(c.accountId);
    expect(c2.amount).toBe(c.amount);
    expect(c2.calendar).toEqual(draft_recurring_cashflow.calendar);
    expect(c2.cashflow_id).toEqual(draft_recurring_cashflow.cashflow_id);
    expect(c2.date).toEqual(new Date(draft_recurring_cashflow.date));
    expect(c2.currency).toEqual(draft_recurring_cashflow.currency);
    expect(c2.description).toEqual(draft_recurring_cashflow.description);
    expect(c2.installment_id).toEqual(draft_recurring_cashflow.installment_id);
    expect(c2.name).toEqual(draft_recurring_cashflow.name);
    expect(c2.modified).toEqual(new Date(draft_recurring_cashflow.modified));
    expect(c2.created).toEqual(new Date(draft_recurring_cashflow.created));
    expect(c2.internal_uuid).toEqual(c.internal_uuid);
    expect(c2.recurrenceData).not.toBeUndefined();
    expect(c2.roll_convention).toEqual(
      draft_recurring_cashflow.roll_convention,
    );
    expect(c2.status).toEqual(c.status);
    expect(c2.childDraft).toEqual(c.childDraft);
    expect(c2.action).not.toBeNull();
  });

  //toCashflowCore - METHOD
  // test('toCashflowCore returns expected value when set', () => {});

  //fromCoreObject - METHOD
  // Write tests for fromCoreObject
  // test('fromCoreObject returns expected value when set', () => {});

  //fromCashflowObject - METHOD
  // Write tests for fromCashflowObject
  // test('fromCashflowObject returns expected value when set', () => {});

  test('installment ui_status works', () => {
    const i = new Installment();
    i.cashflows.push(
      Cashflow.fromObject({
        ...new Cashflow().toObject(),
        date: addDays(new Date(), 30).toISOString(),
        status: 'active',
      }),
    );

    i.cashflows.push(new Cashflow());
    i.cashflows.push(
      Cashflow.fromObject({
        ...new Cashflow().toObject(),
        date: addDays(new Date(), 30).toISOString(),
        status: 'inactive',
      }),
    );
    i.cashflows.push(
      Cashflow.fromObject({
        ...new Cashflow().toObject(),
        date: addDays(new Date(), 30).toISOString(),
        status: 'pending_activation',
      }),
    );
    expect(i.ui_status).toStrictEqual(['active', 'inflight']);
  });
  test('should remove cashflow', async () => {
    const cashflowMocks = [
      {
        date: new Date(),
        amount: 1000,
        internal_uuid: v4(),
      },
      {
        date: new Date(),
        amount: 2000,
        internal_uuid: v4(),
      },
    ];
    const testObject = new Installment();
    cashflowMocks.forEach(({ date, amount, internal_uuid }) => {
      testObject.addCashflow(date, amount, internal_uuid);
    });
    const addedCashflows = testObject.cashflows;
    testObject.removeCashflow(testObject.cashflows[0]);
    expect(testObject.cashflows).toEqual(addedCashflows.slice(1));
  });

  test('should remove cashflow by date', async () => {
    const cashflowMocks = [
      {
        date: new Date(),
        amount: 1000,
        internal_uuid: v4(),
      },
      {
        date: new Date(),
        amount: 2000,
        internal_uuid: v4(),
      },
    ];
    const testObject = new Installment();
    cashflowMocks.forEach(({ date, amount, internal_uuid }) => {
      testObject.addCashflow(date, amount, internal_uuid);
    });
    const addedCashflows = testObject.cashflows;
    testObject.removeCashflowByAmountDate(
      testObject.cashflows[0].amount,
      testObject.cashflows[0].date,
    );
    expect(testObject.cashflows).toEqual(addedCashflows.slice(1));
  });

  test('calculates the total amount of cashflows', () => {
    const cashflowMocks = [
      {
        date: new Date(),
        amount: 1000,
        internal_uuid: v4(),
      },
      {
        date: new Date(),
        amount: 2000,
        internal_uuid: v4(),
      },
    ];
    const testObject = new Installment();

    let expectedAmount = 0;

    cashflowMocks.forEach(({ date, amount, internal_uuid }) => {
      testObject.addCashflow(date, amount, internal_uuid);
    });

    expectedAmount = testObject.cashflows
      .map((v) => v.amount)
      .reduce((prevSum, currentAmt) => {
        return prevSum + currentAmt;
      }, 0);

    expect(testObject.amount).toEqual(expectedAmount);
  });

  test('try to set an ammount on installment', () => {
    const testObject = new Installment();
    expect(() => {
      testObject.amount = 100;
    }).toThrowError("can't set amount on installment");
  });

  test('should return the earliest date from the cashflow array', () => {
    const cashflowMocks = [
      {
        date: new Date('2022-01-01'),
        amount: 1000,
        internal_uuid: v4(),
      },
      {
        date: new Date('2022-02-01'),
        amount: 2000,
        internal_uuid: v4(),
      },
    ];
    const testObject = new Installment();
    cashflowMocks.forEach(({ date, amount, internal_uuid }) => {
      testObject.addCashflow(date, amount, internal_uuid);
    });
    expect(testObject.startDate).toEqual(testObject.cashflows[0].date);
  });

  test.skip('should return the latest date from the cashflow array', () => {
    const cashflowMocks = [
      {
        date: new Date('2022-01-01'),
        amount: 1000,
        internal_uuid: v4(),
      },
      {
        date: new Date('2022-04-01'),
        amount: 2000,
        internal_uuid: v4(),
      },
    ];
    const testObject = new Installment();
    cashflowMocks.forEach(({ date, amount, internal_uuid }) => {
      testObject.addCashflow(date, amount, internal_uuid);
    });
    expect(testObject.endDate).toEqual(new Date('2022-04-01'));
  });

  test('should return "None" when cashflows array is empty', () => {
    const installment = new Installment();
    expect(installment.dateDisplay).toEqual('None');
  });

  test('should return the dateDisplay of first cashflow when cashflows array have only one element', () => {
    const cashflowMocks = [
      {
        date: new Date('2022-01-01'),
        amount: 1000,
        internal_uuid: v4(),
      },
    ];
    const testObject = new Installment();
    cashflowMocks.forEach(({ date, amount, internal_uuid }) => {
      testObject.addCashflow(date, amount, internal_uuid);
    });
    expect(testObject.dateDisplay).toEqual(testObject.cashflows[0].dateDisplay);
  });

  test('should return "Various" when cashflows array have more than one element', () => {
    const cashflowMocks = [
      {
        date: new Date('2022-01-01'),
        amount: 1000,
        internal_uuid: v4(),
      },
      {
        date: new Date('2023-01-01'),
        amount: 2000,
        internal_uuid: v4(),
      },
    ];
    const testObject = new Installment();
    cashflowMocks.forEach(({ date, amount, internal_uuid }) => {
      testObject.addCashflow(date, amount, internal_uuid);
    });
    expect(testObject.dateDisplay).toEqual('Various');
  });

  test('should return an empty string when cashflows array is empty', () => {
    const installment = new Installment();
    expect(installment.duration).toBe('');
  });

  test('should return "Single payment" when cashflows array have only one element', () => {
    const cashflowMocks = [
      {
        date: new Date('2022-01-01'),
        amount: 1000,
        internal_uuid: v4(),
      },
    ];
    const installment = new Installment();
    cashflowMocks.forEach(({ date, amount, internal_uuid }) => {
      installment.addCashflow(date, amount, internal_uuid);
    });
    expect(installment.duration).toBe('Single payment');
  });

  test('should return formatted duration when cashflows array have more than one element', () => {
    const cashflowMocks = [
      {
        date: new Date('2022-01-01'),
        amount: 1000,
        internal_uuid: v4(),
      },
      {
        date: new Date('2023-01-01'),
        amount: 2000,
        internal_uuid: v4(),
      },
    ];
    const start = new Date(
      Math.min(...cashflowMocks.map((c) => c.date.getTime())),
    );
    const end = new Date(
      Math.max(...cashflowMocks.map((c) => c.date.getTime())),
    );
    const duration = formatDuration({
      ...intervalToDuration({ start, end }),
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
    const installment = new Installment();
    cashflowMocks.forEach(({ date, amount, internal_uuid }) => {
      installment.addCashflow(date, amount, internal_uuid);
    });
    expect(installment.duration).toBe(duration);
  });

  test('should create a Cashflow from JSON', () => {
    const cashflowDraftObject = Cashflow.fromDraftObject(
      draft_recurring_cashflow as PangeaDraftCashflow,
    );
    const jsonCashflow = cashflowDraftObject.toJSON();
    Cashflow.fromJSON(jsonCashflow);

    expect(Cashflow.fromJSON(jsonCashflow)).toBeInstanceOf(Cashflow);
  });

  test('should copy a new cashflow', () => {
    const mockCashflow = new Cashflow();
    mockCashflow.installment_id = 123;
    expect(mockCashflow.installment_id).toEqual(
      mockCashflow.copyNew().installment_id,
    );
  });
  test('should clone a cashflow', () => {
    const cashflowDraftObject = Cashflow.fromDraftObject(
      draft_recurring_cashflow as PangeaDraftCashflow,
    );
    expect(cashflowDraftObject.clone().internal_uuid).toEqual(
      cashflowDraftObject.internal_uuid,
    );
  });

  test('toCashflowCore returns expected value when set', () => {
    const cashflowDraftObject = Cashflow.fromDraftObject(
      draft_recurring_cashflow as PangeaDraftCashflow,
    );
    expect(cashflowDraftObject.toCashflowCore()).toEqual({
      amount: -147,
      calendar: 'WESTERN_CALENDAR',
      currency: 'EUR',
      description: undefined,
      end_date: '2024-10-20T04:00:00.000Z',
      installment: undefined,
      name: 'A Friday Recurring Demo',
      pay_date: '2022-08-01T04:00:00.000Z',
      periodicity:
        'DTSTART:20230801T040000Z\nRRULE:FREQ=MONTHLY;INTERVAL=2;BYDAY=+1MO;UNTIL=20241020T040000Z',
      roll_convention: 'NEAREST',
    });
  });

  test('fromCoreObject returns expected value when set', () => {
    const cashflowDraftObject = Cashflow.fromDraftObject(
      draft_recurring_cashflow as PangeaDraftCashflow,
    );
    cashflowDraftObject.installment_id = 123;
    const coreObject = cashflowDraftObject.toCashflowCore();
    expect(Cashflow.fromCoreObject(coreObject)?.installment_id).toEqual(
      cashflowDraftObject.installment_id,
    );
  });
});
