import { addDays, formatDuration, intervalToDuration } from 'date-fns';
import { isError, isObject, uniq } from 'lodash';
import { RRule } from 'rrule';
import * as uuid from 'uuid';
import {
  PangeaCalendarEnum,
  PangeaCashFlowCore,
  PangeaCashflow,
  PangeaCashflowStatusEnum,
  PangeaDraftCashflow,
  PangeaDraftCashflowActionEnum,
  PangeaDraftFxForward,
  PangeaRollConventionEnum,
} from '../api/v2/data-contracts';
import { ClientAuthHelper } from '../authHelper';
import type { CashflowStatusType, FrequencyType } from '../types';
import { IRecurrenceData } from '../types';
import {
  getOccurrencesFromPattern,
  hashString,
  recurrenceDataFromPattern,
  serializeDateTime,
  standardizeDate,
} from '../utils';
import { BaseHedgeItemTyped } from './baseHedgeItem';

export class Cashflow extends BaseHedgeItemTyped<Cashflow> {
  static readonly DEFAULT_ROLL_CONVENTION = PangeaRollConventionEnum.NEAREST;
  static readonly DEFAULT_CALENDAR = PangeaCalendarEnum.NULL_CALENDAR;
  static readonly DEFAULT_ID = -1;
  static readonly DEFAULT_ACCOUNT_ID = Cashflow.DEFAULT_ID;
  private _id = -1;
  private _date: Date;
  private _recurrenceData: Nullable<IRecurrenceData>;
  private _is_forward: Optional<boolean>;
  private _cashflow_id: Nullable<number>;
  private _draft_fx_forward_id: Nullable<number>;
  private _roll_convention: PangeaRollConventionEnum;
  private _status: Optional<Nullable<PangeaCashflowStatusEnum>>;
  private _calendar: PangeaCalendarEnum;
  private _childDraft: Nullable<PangeaDraftCashflow>;
  private _created: Optional<Date>;
  private _modified: Optional<Date>;
  private _action: Optional<PangeaDraftCashflowActionEnum>;
  private _booked_base_amount: Optional<number>;
  private _booked_cntr_amount: Optional<number>;
  private _booked_rate: Optional<number>;
  private _indicative_base_amount: Optional<number>;
  private _indicative_cntr_amount: Optional<number>;
  private _indicative_rate: Optional<number>;

  constructor() {
    super();
    this._type = 'onetime';
    this._date = new Date(0);
    this._recurrenceData = null;
    this._cashflow_id = null;
    this._roll_convention = Cashflow.DEFAULT_ROLL_CONVENTION;
    this._calendar = Cashflow.DEFAULT_CALENDAR;
    this._childDraft = null;
    this._draft_fx_forward_id = null;
  }

  public get id(): number {
    return this._id;
  }
  public set id(v: number) {
    if ((v < -1 && v != Cashflow.DEFAULT_ID) || Number(v.toFixed(0)) !== v) {
      throw 'Invalid ID';
    }
    this._id = v;
  }
  public get date(): Date {
    if (this.type == 'recurring' && !!this.recurrenceData?.startDate) {
      return this.recurrenceData.startDate;
    }
    return Number(new Date(this._date)) > 0
      ? new Date(this._date)
      : new Date(0);
  }
  public set date(v: Date) {
    this._date = v;
    if (this.type == 'recurring') {
      this.recurrenceData = {
        ...this.recurrenceData,
        startDate: v,
      } as IRecurrenceData;
    }
  }

  public override get type(): FrequencyType {
    return super.type;
  }
  public override set type(v: FrequencyType) {
    const origType = super.type;
    super.type = v;
    if (origType === 'recurring' && v !== 'recurring') {
      this.recurrenceData = null;
    }
  }

  public get created(): Optional<Date> {
    return this._created;
  }
  public override set created(v: Optional<Date>) {
    this._created = v;
  }

  public override get modified(): Optional<Date> {
    return this._modified;
  }
  public set modified(v: Optional<Date>) {
    this._modified = v;
  }
  public get nextSettlementAmount(): number {
    return this.amount;
  }
  public get nextSettlementDate(): Date {
    return this.date;
  }
  public get recurrenceData(): Nullable<IRecurrenceData> {
    return this._recurrenceData;
  }
  public set recurrenceData(v: Nullable<IRecurrenceData>) {
    if (v?.pattern == null) {
      this._recurrenceData = v;
      return;
    }

    this._recurrenceData = recurrenceDataFromPattern(v.pattern);
    if (!this._recurrenceData) {
      return;
    }
    if (v.startDate || v.endDate) {
      const effectiveStartDate = v.startDate ?? this._recurrenceData.startDate;
      const effectiveEndDate = v.endDate ?? this._recurrenceData.endDate;
      if (
        effectiveStartDate &&
        effectiveEndDate &&
        new Date(effectiveEndDate).getTime() <
          new Date(effectiveStartDate).getTime()
      ) {
        throw `End date ${effectiveEndDate} must be after start date ${effectiveStartDate}.`;
      }
    }
    if (v.startDate) {
      this._recurrenceData.startDate = new Date(v.startDate);
    }
    if (v.endDate) {
      this._recurrenceData.endDate = new Date(v.endDate);
    }
    if (v.numOccurrences) {
      this._recurrenceData.numOccurrences = v.numOccurrences;
    }
  }

  public getRrule = (): Nullable<RRule> => {
    if (this.type !== 'recurring') {
      return null;
    }

    if (!this.recurrenceData?.pattern) {
      return null;
    }

    return RRule.fromString(this.recurrenceData.pattern);
  };

  public isValidRRulePattern = () => {
    const rrule = this.getRrule();
    return (
      !!rrule &&
      !!rrule.after(new Date(), true) &&
      Number(this.endDate) <= Number(addDays(standardizeDate(), 729))
    );
  };

  public get is_forward(): Optional<boolean> {
    return this._is_forward;
  }

  public override set is_forward(v: Optional<boolean>) {
    this._is_forward = v;
  }
  public get draft_fx_forward_id(): Nullable<number> {
    return this._draft_fx_forward_id;
  }

  public override set draft_fx_forward_id(v: Nullable<number>) {
    this._draft_fx_forward_id = v;
  }

  public get cashflow_id(): Nullable<number> {
    return this._cashflow_id;
  }

  public set cashflow_id(v: Nullable<number>) {
    if (
      v &&
      ((v < -1 && v != Cashflow.DEFAULT_ID) || Number(v.toFixed(0)) !== v)
    ) {
      throw 'Invalid Cashflow ID';
    }
    this._cashflow_id = v;
  }

  public get roll_convention(): PangeaRollConventionEnum {
    return this._roll_convention;
  }
  public set roll_convention(v: PangeaRollConventionEnum) {
    this._roll_convention = v;
  }

  public get status(): Nullable<Optional<PangeaCashflowStatusEnum>> {
    return this._status;
  }
  private set status(v: Nullable<Optional<PangeaCashflowStatusEnum>>) {
    this._status = v;
  }

  public get action(): Optional<PangeaDraftCashflowActionEnum> {
    return this._action;
  }
  public set action(v: Optional<PangeaDraftCashflowActionEnum>) {
    this._action = v;
  }

  public override get totalAmount(): number {
    if (this.type === 'onetime') {
      return this.amount;
    } else if (this.type === 'recurring') {
      return (this.getRrule()?.all().length ?? 1) * this.amount;
    }
    return 0;
  }

  public override get ui_status(): CashflowStatusType[] {
    let uiStatus: CashflowStatusType[] = [];
    if (this.isFromDraftObject()) {
      return ['draft'];
    }
    if (this.status == PangeaCashflowStatusEnum.Inactive) {
      uiStatus.push('terminated');
    } else if (this.status == PangeaCashflowStatusEnum.PendingActivation) {
      uiStatus.push('inflight');
    } else if (this.status == PangeaCashflowStatusEnum.Active) {
      uiStatus.push('active');
    } else if (this.status == PangeaCashflowStatusEnum.PendingMargin) {
      uiStatus.push('pending_margin');
    } else if (this.status == PangeaCashflowStatusEnum.PendingPayment) {
      uiStatus.push('pending_payment');
    } else if (this.status == PangeaCashflowStatusEnum.PendingApproval) {
      uiStatus.push('pending_approval');
    } else if (this.status == PangeaCashflowStatusEnum.PendingDeactivation) {
      uiStatus.push('pending');
      uiStatus.push('terminated');
      return uiStatus;
    }
    if (this.endDate < standardizeDate(new Date())) {
      uiStatus = ['archived'];
    }
    //TODO: Jay to add in-flight status
    if (this.childDraft?.name != null) {
      uiStatus.push('draft');
    }
    return uiStatus.length > 0 ? uniq(uiStatus).slice(0, 2) : ['pending'];
  }

  public get calendar(): PangeaCalendarEnum {
    return this._calendar;
  }
  public set calendar(v: PangeaCalendarEnum) {
    this._calendar = v;
  }

  public get booked_base_amount(): Optional<number> {
    return this._booked_base_amount;
  }
  public set booked_base_amount(v: Optional<number>) {
    this._booked_base_amount = v;
  }
  public get booked_cntr_amount(): Optional<number> {
    return this._booked_cntr_amount;
  }
  public set booked_cntr_amount(v: Optional<number>) {
    this._booked_cntr_amount = v;
  }
  public get booked_rate(): Optional<number> {
    return this._booked_rate;
  }
  public set booked_rate(v: Optional<number>) {
    this._booked_rate = v;
  }
  public get indicative_base_amount(): Optional<number> {
    return this._indicative_base_amount;
  }
  public set indicative_base_amount(v: Optional<number>) {
    this._indicative_base_amount = v;
  }
  public get indicative_cntr_amount(): Optional<number> {
    return this._indicative_cntr_amount;
  }
  public set indicative_cntr_amount(v: Optional<number>) {
    this._indicative_cntr_amount = v;
  }
  public get indicative_rate(): Optional<number> {
    return this._indicative_rate;
  }
  public set indicative_rate(v: Optional<number>) {
    this._indicative_rate = v;
  }

  private instanceOfPangeaDraftCashflow = (
    data: PangeaDraftCashflow,
  ): data is PangeaDraftCashflow => {
    return 'id' in data && 'amount' in data && 'currency' in data;
  };

  public get childDraft(): Nullable<PangeaDraftCashflow> {
    return this._childDraft;
  }
  public set childDraft(v: Nullable<PangeaDraftCashflow>) {
    if (v && (!isObject(v) || !this.instanceOfPangeaDraftCashflow(v))) {
      throw 'Object is not a draft cashflow.';
    }
    this._childDraft = v;
  }

  public override get endDate(): Date {
    if (this.type === 'onetime') {
      return standardizeDate(this.date ?? new Date());
    } else if (this.type === 'recurring') {
      const recurData = this.recurrenceData;
      const recurArray = getOccurrencesFromPattern(recurData?.pattern ?? null);
      if (recurArray.length) {
        return standardizeDate(recurArray[recurArray.length - 1] ?? new Date());
      }
    }
    return standardizeDate(new Date());
  }

  public override get dateDisplay(): string {
    if (this.type === 'onetime') {
      const d = standardizeDate(this.date);
      return d ? new Date(d).toLocaleDateString() : 'Unknown date';
    } else if (this.type === 'recurring') {
      const recurData = this.recurrenceData;
      if (
        recurData &&
        recurData.displayText &&
        (recurData.displayText?.length ?? 0) > 2
      ) {
        const dT = recurData.displayText;
        return dT[0].toUpperCase() + dT.substring(1);
      }
      return 'Invalid pattern';
    } else {
      return 'Unknown';
    }
  }

  public override get duration(): string {
    switch (this.type) {
      case 'onetime':
        return 'Single payment';
      case 'recurring': {
        const start = standardizeDate(
          this.recurrenceData?.startDate ?? this.date,
        );
        const end = standardizeDate(this.endDate);
        return Number(start) == Number(end)
          ? 'Single payment'
          : formatDuration({
              ...intervalToDuration({
                start,
                end,
              }),
              hours: 0,
              minutes: 0,
              seconds: 0,
            });
      }
      default:
        return '';
    }
  }

  public isFromDraftObject(): boolean {
    return !this.status && !this.childDraft;
  }

  /**
   * Saves an in-progress draft
   * @date 7/19/2022 - 9:29:48 AM
   *
   * @public
   * @async
   * @param {ClientAuthHelper} authHelperInstance
   * @returns {Promise<void>}
   */
  public override async saveAsync(
    authHelperInstance: ClientAuthHelper,
  ): Promise<boolean | Error> {
    if (!this.isDirty) {
      return false;
    }
    if (this.status == PangeaCashflowStatusEnum.Inactive) {
      return false;
    }
    const apiHelper = authHelperInstance.getAuthenticatedApiHelper();
    const draftObj = this.toDraftObject(); // recurring and one-time should only have one. We'll assume that's true
    let createdObj: Nullable<PangeaDraftCashflow | Error> = null;
    if (this.id < 1 && (!this.cashflow_id || this.cashflow_id < 1)) {
      // we're in create mode and draft has not yet been saved
      createdObj = await apiHelper.createNewDraftAsync(draftObj);
    } else if (this.id > 0 && (!this.cashflow_id || this.cashflow_id < 1)) {
      // draft has been saved once before but hasn't been 'executed' yet
      createdObj = await apiHelper.saveDraftAsync(draftObj);
    } else if (
      this.id > 0 &&
      this.cashflow_id &&
      this.cashflow_id > 0 &&
      this.accountId > 0 &&
      this.isFromDraftObject()
    ) {
      // draft is part of active cashflow
      createdObj = await apiHelper.saveDraftAsync(draftObj);
    } else if (
      (this.id < 1 ||
        (this.id === this.cashflow_id && !this.isFromDraftObject())) &&
      this.cashflow_id &&
      this.cashflow_id > 0 &&
      this.accountId > 0
    ) {
      // new draft creating on existing cashflow
      const originalAccountId = await this.getOriginalAccountIdAsync(
        authHelperInstance,
      );
      createdObj = await apiHelper.createNewDraftOnCashflow(
        draftObj,
        originalAccountId,
      );
    }
    if (createdObj && !isError(createdObj)) {
      const c = Cashflow.fromDraftObject(createdObj);
      this.id = c.id;
      this.modified = c.modified;
      this.created = c.created;
      this.cashflow_id = c.cashflow_id;
      this.accountId = c.accountId;
      this.status = c.status;
      this.childDraft = c.childDraft;
      this.originalHash = this.getHashCode();
      this.booked_base_amount = c.booked_base_amount;
      this.booked_cntr_amount = c.booked_cntr_amount;
      this.booked_rate = c.booked_rate;
      this.indicative_base_amount = c.indicative_base_amount;
      this.indicative_cntr_amount = c.indicative_cntr_amount;
      this.indicative_rate = c.indicative_rate;
      return true;
    } else if (createdObj && isError(createdObj)) {
      return createdObj;
    }
    return false;
  }

  /**
   * Activates a draft making it a real cashflow and deletes draft.
   * @date 7/19/2022 - 9:30:36 AM
   *
   * @public
   * @async
   * @param {ClientAuthHelper} authHelperInstance
   * @returns {Promise<void>}
   */
  public override async executeAsync(
    authHelperInstance: ClientAuthHelper,
  ): Promise<Nullable<Cashflow | Error>> {
    if (this.childDraft) {
      return await Cashflow.fromDraftObject(this.childDraft).executeAsync(
        authHelperInstance,
      );
    }
    if (this.action !== PangeaDraftCashflowActionEnum.DELETE) {
      if (this.accountId < 1) {
        const err = new Error(
          "Cash flow does not yet have an account assigned. Can't activate it yet.",
        );
        err.name = 'errNoAccountId';
        return err;
      }
      if (this.status) {
        const err = new Error('Cash flow was already activated.');
        err.name = 'errAlreadyActivated';
        return err;
      }
    }
    const apiHelper = authHelperInstance.getAuthenticatedApiHelper();
    if (this.action !== PangeaDraftCashflowActionEnum.DELETE) {
      const saveResponse = await this.saveAsync(authHelperInstance);
      if (isError(saveResponse)) {
        console.error(saveResponse, this);
        return saveResponse;
      }
    }

    // We need to determine if we're in a situation where we're switching accounts.
    const originalAccountId = await this.getOriginalAccountIdAsync(
      authHelperInstance,
    );
    const accountIdChanged = this.accountId !== originalAccountId;

    let cashflowObj: Nullable<PangeaCashflow | Error> = null;
    if (
      this.cashflow_id &&
      this.cashflow_id > 0 &&
      this.accountId > 0 &&
      this.isFromDraftObject()
    ) {
      // this is a draft on an existing cashflow

      if (
        this.action === PangeaDraftCashflowActionEnum.DELETE ||
        accountIdChanged
      ) {
        const deleteResponse = await apiHelper.deactivateCashflowAsync(
          originalAccountId,
          this.cashflow_id,
        );
        cashflowObj = isError(deleteResponse) ? deleteResponse : null;
      }
      if (accountIdChanged) {
        cashflowObj = await apiHelper.executeCashflow(
          this.accountId,
          this.toCashflowCore(),
        );
      } else if (
        !isError(cashflowObj) &&
        this.action !== PangeaDraftCashflowActionEnum.DELETE
      ) {
        cashflowObj = await apiHelper.executeCashflow(
          originalAccountId, // we are calling execute on a draft in a cashflow, so we need the parent cashflow's account id
          undefined,
          this.cashflow_id, // and cashflow id
          this.toDraftObject(),
        );
      }
    } else {
      // this is a draft, never executed before.
      if (this.action === PangeaDraftCashflowActionEnum.DELETE) {
        await this.discard(authHelperInstance);
      } else {
        cashflowObj = await apiHelper.executeCashflow(
          this.accountId,
          this.toCashflowCore(),
        );

        if (
          !isError(cashflowObj) &&
          cashflowObj?.id &&
          (cashflowObj?.id ?? 0) > 0
        ) {
          await this.discard(authHelperInstance);
          this.cashflow_id = cashflowObj.id;
        }
      }
    }
    return cashflowObj && !isError(cashflowObj)
      ? Cashflow.fromCashflowObject(cashflowObj)
      : cashflowObj;
  }

  public override async approveAsync(
    authHelperInstance: ClientAuthHelper,
  ): Promise<Nullable<Cashflow | Error>> {
    const apiHelper = authHelperInstance.getAuthenticatedApiHelper();
    let cashflowObj: Nullable<PangeaCashflow | Error> = null;
    cashflowObj = await apiHelper.approveCashflow(
      this.accountId,
      this.cashflow_id,
    );

    if (
      !isError(cashflowObj) &&
      cashflowObj?.id &&
      (cashflowObj?.id ?? 0) > 0
    ) {
      await this.discard(authHelperInstance);
      this.cashflow_id = cashflowObj.id;
    }
    return cashflowObj && !isError(cashflowObj)
      ? Cashflow.fromCashflowObject(cashflowObj)
      : cashflowObj;
  }

  public override async activateHedgeAsync(
    authHelperInstance: ClientAuthHelper,
  ): Promise<Nullable<PangeaDraftFxForward | Error>> {
    const api = authHelperInstance.getAuthenticatedApiHelper();
    let fXFwdItem: Nullable<PangeaDraftFxForward | Error> = null;
    fXFwdItem = await api.corPayHedgeForwardActivateAsync(this.id ?? 0);

    if (!isError(fXFwdItem) && fXFwdItem?.id && (fXFwdItem?.id ?? 0) > 0) {
      await this.discard(authHelperInstance);
      this.cashflow_id = fXFwdItem.id;
    }
    return fXFwdItem && !isError(fXFwdItem) ? fXFwdItem : null;
  }

  private async getOriginalAccountIdAsync(
    authHelperInstance: ClientAuthHelper,
  ) {
    const apiHelper = authHelperInstance.getAuthenticatedApiHelper();
    let originalAccountId = this.accountId;
    if (
      this.cashflow_id &&
      this.cashflow_id > Cashflow.DEFAULT_ID &&
      this.accountId > Cashflow.DEFAULT_ACCOUNT_ID
    ) {
      const originalCashflow = await apiHelper.getCashflowAsync(
        this.cashflow_id,
      );
      if (originalCashflow && !isError(originalCashflow)) {
        originalAccountId = originalCashflow.account.id;
      }
    }
    return originalAccountId;
  }

  /**
   * Discards a draft.
   * @date 7/19/2022 - 9:40:22 AM
   *
   * @async
   * @param {ClientAuthHelper} authHelperInstance
   * @returns {Promise<void>}
   */
  public async discard(
    authHelperInstance: ClientAuthHelper,
  ): Promise<boolean | Error> {
    const apiHelper = authHelperInstance.getAuthenticatedApiHelper();

    // If this isn't a draft object, but has one attached, discard it.
    if (!this.isFromDraftObject() && this.childDraft && this.cashflow_id) {
      const discardResult = !isError(
        await apiHelper.deleteDraftOnCashflow(
          this.childDraft.id,
          this.cashflow_id,
          this.accountId,
        ),
      );
      if (!isError(discardResult)) {
        this.childDraft = null;
      }
      return discardResult;
    }

    // Make sure if we made it this far, we're dealing with a saved draft
    if (this.id === Cashflow.DEFAULT_ID) {
      return true;
    }
    if (!this.isFromDraftObject()) {
      return false;
    }

    if (
      this.cashflow_id &&
      this.cashflow_id !== Cashflow.DEFAULT_ID &&
      this.accountId !== Cashflow.DEFAULT_ACCOUNT_ID
    ) {
      const originalCashflow = await Cashflow.fromCashflowIdAsync(
        this.cashflow_id,
        authHelperInstance,
      );
      if (!originalCashflow || isError(originalCashflow)) {
        return false;
      }

      return !isError(
        await apiHelper.deleteDraftOnCashflow(
          this.id,
          this.cashflow_id,
          originalCashflow.accountId,
        ),
      );
    } else {
      return !isError(await apiHelper.deleteDraft(this.id));
    }
  }

  public override toObject() {
    return {
      ...super.baseJSON(),
      id: this.id,
      amount: this.directionalAmount,
      calendar: this.calendar,
      cashflow_id: this.cashflow_id,
      created: this.created,
      date: this.date,
      description: this.description,
      modified: this.modified,
      recurrenceData: this.recurrenceData ? { ...this.recurrenceData } : null,
      roll_convention: this.roll_convention,
      status: this.status,
      childDraft: this.childDraft,
      internal_uuid: this.internal_uuid,
      action: this.action,
      booked_base_amount: this.booked_base_amount,
      booked_cntr_amount: this.booked_cntr_amount,
      booked_rate: this.booked_rate,
      indicative_base_amount: this.indicative_base_amount,
      indicative_cntr_amount: this.indicative_cntr_amount,
      indicative_rate: this.indicative_rate,
    };
  }

  public toJSON(): string {
    return JSON.stringify(this.toObject());
  }

  public override getHashCode(): number {
    const c = this.clone();

    //original hash shouldn't be included in the hashing
    c.originalHash = undefined;
    return hashString(c.toJSON());
  }

  public static fromObject(obj: any): Cashflow {
    try {
      const c = new Cashflow();
      c.id = obj.id;
      c.type = obj.type;
      c.direction = obj.direction;
      c.accountId = obj.accountId;
      c.amount = obj.amount;
      c.calendar = obj.calendar;
      c.is_forward = obj.is_forward;
      c.draft_fx_forward_id = obj.draft_fx_forward_id;
      c.cashflow_id = obj.cashflow_id;
      c.date = obj.date;
      c.currency = obj.currency;
      c.description = obj.description;
      c.installment_id = obj.installment_id;
      c.name = obj.name;
      c.modified = obj.modified;
      c.created = obj.created;
      c.internal_uuid = obj.internal_uuid;
      c.originalHash = obj.originalHash;
      c.recurrenceData = obj.recurrenceData?.pattern
        ? ({ ...obj.recurrenceData } as IRecurrenceData)
        : null;
      c.roll_convention = obj.roll_convention;
      c.status = obj.status;
      c.childDraft = obj.childDraft;
      c.action = obj.action;
      c.booked_base_amount = obj.booked_base_amount;
      c.booked_cntr_amount = obj.booked_cntr_amount;
      c.booked_rate = obj.booked_rate;
      c.indicative_base_amount = obj.indicative_base_amount;
      c.indicative_cntr_amount = obj.indicative_cntr_amount;
      c.indicative_rate = obj.indicative_rate;
      return c;
    } catch (e) {
      console.error('invalid object', obj);
      throw e;
    }
  }

  public static async fromDraftIdAsync(
    id: number,
    authHelper: ClientAuthHelper,
  ): Promise<Nullable<Cashflow>> {
    const api = authHelper.getAuthenticatedApiHelper();
    const draft = await api.loadDraftByIdAsync(id);
    if (!isError(draft)) {
      return Cashflow.fromDraftObject(draft as PangeaDraftCashflow);
    }

    return null;
  }

  public static async fromCashflowIdAsync(
    id: number,
    authHelper: ClientAuthHelper,
  ): Promise<Nullable<Cashflow>> {
    const api = authHelper.getAuthenticatedApiHelper();
    const cashflow = await api.getCashflowAsync(id);
    if (!isError(cashflow)) {
      return Cashflow.fromCashflowObject(cashflow as PangeaCashflow);
    }

    return null;
  }

  public static fromJSON(json: string): Cashflow {
    return Cashflow.fromObject(JSON.parse(json));
  }

  public copyNew(): Cashflow {
    const c = this.clone();
    c.id = Cashflow.DEFAULT_ID;
    c.internal_uuid = uuid.v4();
    c.created = undefined;
    c.modified = undefined;
    c.status = undefined;
    c.childDraft = null;
    c.action = undefined;
    c.booked_base_amount = undefined;
    c.booked_cntr_amount = undefined;
    c.booked_rate = undefined;
    c.indicative_base_amount = undefined;
    c.indicative_cntr_amount = undefined;
    c.indicative_rate = undefined;
    //not reseting originalHash on purpose so this will look dirty
    return c;
  }

  public override clone(): Cashflow {
    const c = new Cashflow();
    c.id = this.id;
    c.type = this.type;
    c.direction = this.direction;
    c.accountId = this.accountId;
    c.amount = this.amount;
    c.calendar = this.calendar;
    c.is_forward = this.is_forward;
    c.draft_fx_forward_id = this.draft_fx_forward_id;
    c.cashflow_id = this.cashflow_id;
    c.date = this.date;
    c.currency = this.currency;
    c.description = this.description;
    c.created = this.created;
    c.modified = this.modified;
    c.installment_id = this.installment_id;
    c.name = this.name;
    c.internal_uuid = this.internal_uuid;
    c.originalHash = this.originalHash;
    c.recurrenceData = this.recurrenceData?.pattern
      ? ({ ...this.recurrenceData } as IRecurrenceData)
      : null;
    c.roll_convention = this.roll_convention;
    c.status = this.status;
    c.childDraft =
      this.childDraft && ({ ...this.childDraft } as PangeaDraftCashflow);
    c.action = this.action;
    c.booked_base_amount = this.booked_base_amount;
    c.booked_cntr_amount = this.booked_cntr_amount;
    c.booked_rate = this.booked_rate;
    c.indicative_base_amount = this.indicative_base_amount;
    c.indicative_cntr_amount = this.indicative_cntr_amount;
    c.indicative_rate = this.indicative_rate;
    return c;
  }

  public toCashflowCore(shortDateFormat = false): PangeaCashFlowCore {
    const core = {
      amount: this.directionalAmount,
      currency: this.currency,
      pay_date: shortDateFormat
        ? serializeDateTime(this.date)?.split('T')[0]
        : serializeDateTime(this.date),
      calendar: this.calendar ?? undefined,
      description: this.description?.trim() ?? undefined,
      end_date:
        (shortDateFormat
          ? serializeDateTime(this.recurrenceData?.endDate)?.split('T')[0]
          : serializeDateTime(this.recurrenceData?.endDate)) ?? undefined,
      installment:
        this.installment_id && this.installment_id > 0
          ? this.installment_id
          : undefined,
      name: this.name?.trim(),
      periodicity: this.recurrenceData?.pattern ?? undefined,
      roll_convention: this.roll_convention ?? undefined,
      book_base_amount: this.booked_base_amount ?? undefined,
      book_cntr_amount: this.booked_cntr_amount ?? undefined,
      book_rate: this.booked_rate ?? undefined,
      indicative_base_amount: this.indicative_base_amount ?? undefined,
      indicative_cntr_amount: this.indicative_cntr_amount ?? undefined,
      indicative_rate: this.indicative_rate ?? undefined,
    } as PangeaCashFlowCore;
    return core;
  }

  public toDraftObject(): PangeaDraftCashflow {
    const draft = {
      account_id:
        this.accountId === Cashflow.DEFAULT_ACCOUNT_ID
          ? undefined
          : this.accountId,
      amount: this.directionalAmount,
      currency: this.currency,
      date: serializeDateTime(this.date),
      id: this.id,
      cashflow_id: this.cashflow_id,
      calendar: this.calendar,
      description: this.description?.trim(),
      installment_id:
        this.installment_id && this.installment_id > 0
          ? this.installment_id
          : undefined,
      created: serializeDateTime(this.created),
      modified: serializeDateTime(this.modified),
      name: this.name?.trim(),
      roll_convention: this.roll_convention ?? undefined,
      action:
        this.action ??
        (this.cashflow_id ?? Cashflow.DEFAULT_ID > 0
          ? PangeaDraftCashflowActionEnum.UPDATE
          : PangeaDraftCashflowActionEnum.CREATE),
      booked_base_amount: this.booked_base_amount ?? undefined,
      booked_cntr_amount: this.booked_cntr_amount ?? undefined,
      booked_rate: this.booked_rate ?? undefined,
      indicative_base_amount: this.indicative_base_amount ?? undefined,
      indicative_cntr_amount: this.indicative_cntr_amount ?? undefined,
      indicative_rate: this.indicative_rate ?? undefined,
    } as unknown as PangeaDraftCashflow;
    if (this.type === 'recurring' && this.recurrenceData) {
      draft.date =
        serializeDateTime(this.recurrenceData.startDate ?? new Date()) ?? '';
      draft.end_date =
        serializeDateTime(this.recurrenceData.endDate, null) ?? undefined;
      draft.periodicity = this.recurrenceData.pattern ?? undefined;
    }
    return draft;
  }

  public static fromCoreObject(
    core: PangeaCashFlowCore,
    accountId = 0,
  ): Nullable<Cashflow> {
    if (!core) {
      return null;
    }
    const cashflowObj = new Cashflow();
    cashflowObj.type = core.periodicity ? 'recurring' : 'onetime';
    cashflowObj.direction = core.amount <= 0 ? 'paying' : 'receiving';
    cashflowObj.accountId = accountId;
    cashflowObj.amount = core.amount;
    core.calendar && (cashflowObj.calendar = core.calendar);
    cashflowObj.currency = core.currency;
    cashflowObj.date = new Date(core.pay_date);
    cashflowObj.description = core.description;
    cashflowObj.name = core.name;
    cashflowObj.installment_id = core.installment ?? null;
    cashflowObj.recurrenceData = core.periodicity
      ? ({
          pattern: core.periodicity,
        } as IRecurrenceData)
      : null;

    cashflowObj.roll_convention =
      core.roll_convention ?? Cashflow.DEFAULT_ROLL_CONVENTION;
    //has to be the last prop set.
    cashflowObj.originalHash = cashflowObj.getHashCode();
    return cashflowObj;
  }

  public static fromCashflowObject(cashflow: PangeaCashflow): Cashflow {
    const cashflowObj = new Cashflow();
    cashflowObj.id = cashflow.id;
    cashflowObj.accountId = cashflow.account.id;
    cashflowObj.name = cashflow.name;
    cashflowObj.amount = cashflow.amount;
    cashflowObj.is_forward = cashflow.is_forward;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    cashflowObj.created = new Date(cashflow.created!);
    cashflowObj.date = new Date(cashflow.date);
    cashflowObj.description = cashflow.description;
    cashflowObj.direction = cashflow.amount <= 0 ? 'paying' : 'receiving';
    cashflowObj.roll_convention =
      cashflow.roll_convention ?? Cashflow.DEFAULT_ROLL_CONVENTION;
    cashflowObj.currency = cashflow.currency.mnemonic;
    cashflowObj.cashflow_id = cashflow.id;
    cashflow.calendar && (cashflowObj.calendar = cashflow.calendar);
    cashflowObj.installment_id = cashflow.installment
      ? cashflow.installment.id ?? null
      : null;
    cashflowObj.modified = new Date(cashflow.modified);
    cashflowObj.status = cashflow.status;
    cashflowObj.childDraft = cashflow.draft ? { ...cashflow.draft } : null;
    cashflowObj.booked_base_amount = cashflow.booked_base_amount;
    cashflowObj.booked_cntr_amount = cashflow.booked_cntr_amount;
    cashflowObj.booked_rate = cashflow.booked_rate;
    cashflowObj.indicative_base_amount =
      cashflow.indicative_base_amount ?? undefined;
    cashflowObj.indicative_cntr_amount =
      cashflow.indicative_cntr_amount ?? undefined;
    cashflowObj.indicative_rate = cashflow.indicative_rate ?? undefined;
    if (cashflow.periodicity) {
      cashflowObj.type = 'recurring';
      cashflowObj.recurrenceData = recurrenceDataFromPattern(
        cashflow.periodicity,
      );
      if (cashflowObj.recurrenceData && cashflow.end_date) {
        cashflowObj.recurrenceData.endDate = new Date(cashflow.end_date);
      }
    }
    //must be last thing set.
    cashflowObj.originalHash = cashflowObj.getHashCode();
    return cashflowObj;
  }

  public static fromDraftObject(draft: PangeaDraftCashflow): Cashflow {
    const cashflowObj = new Cashflow();
    cashflowObj.direction = draft.amount <= 0 ? 'paying' : 'receiving';
    cashflowObj.type = draft.periodicity ? 'recurring' : 'onetime';
    cashflowObj.accountId = draft.account_id ?? Cashflow.DEFAULT_ACCOUNT_ID;
    cashflowObj.amount = draft.amount;
    cashflowObj.created = new Date(draft.created);
    cashflowObj.currency = draft.currency;
    cashflowObj.date = draft.date ? new Date(draft.date) : new Date();
    cashflowObj.description = draft.description;
    cashflowObj.id = draft.id;
    cashflowObj.modified = new Date(draft.modified);
    cashflowObj.draft_fx_forward_id = draft.draft_fx_forward_id;
    cashflowObj.name = draft.name;
    cashflowObj.cashflow_id = draft.cashflow_id;
    cashflowObj.installment_id = draft.installment_id ?? null;
    cashflowObj.action = draft.action;
    cashflowObj.booked_base_amount = draft.booked_base_amount;
    cashflowObj.booked_cntr_amount = draft.booked_cntr_amount;
    cashflowObj.booked_rate = draft.booked_rate;
    cashflowObj.indicative_base_amount =
      draft.indicative_base_amount ?? undefined;
    cashflowObj.indicative_cntr_amount =
      draft.indicative_cntr_amount ?? undefined;
    cashflowObj.indicative_rate = draft.indicative_rate ?? undefined;
    draft.calendar && (cashflowObj.calendar = draft.calendar);
    cashflowObj.roll_convention =
      (draft.roll_convention as unknown as PangeaRollConventionEnum) ??
      Cashflow.DEFAULT_ROLL_CONVENTION;
    if (cashflowObj.type === 'recurring' && draft.periodicity) {
      const rrule = RRule.fromString(draft.periodicity);
      cashflowObj.recurrenceData = {
        pattern: draft.periodicity,
        displayText: rrule.toText(),
        startDate: new Date(draft.date),
      };
      if (rrule.options.until) {
        cashflowObj.recurrenceData.endDate = rrule.options.until;
      } else if (rrule.options.count) {
        cashflowObj.recurrenceData.numOccurrences = rrule.options.count;
      }
    }
    cashflowObj.originalHash = cashflowObj.getHashCode();
    return cashflowObj;
  }
}
