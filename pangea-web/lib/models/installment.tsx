import { differenceInDays, formatDuration, intervalToDuration } from 'date-fns';
import { isEqual, isError, isString, uniq } from 'lodash';
import {
  PangeaDraftCashflowActionEnum,
  PangeaInstallment,
} from '../api/v2/data-contracts';
import { ClientAuthHelper } from '../authHelper';
import { CashflowStatusType } from '../types';
import { hashString, standardizeDate } from '../utils';
import { BaseHedgeItemTyped } from './baseHedgeItem';
import { Cashflow } from './cashflow';

export class Installment extends BaseHedgeItemTyped<Installment> {
  booked_base_amount: Optional<number>;
  booked_cntr_amount: Optional<number>;
  booked_rate: Optional<number>;
  indicative_base_amount: Optional<number>;
  indicative_cntr_amount: Optional<number>;
  indicative_rate: Optional<number>;
  constructor() {
    super();
    this._type = 'installments';
  }

  private _cashflowsToDelete: Cashflow[] = [];
  private _installmentNeedsUpdate = false;
  private _loadedFromExisting = false;

  public override set name(v: NullableString) {
    this._installmentNeedsUpdate = this._loadedFromExisting && this._name !== v;
    this._name = v;
    this._cashflows.forEach((c) => {
      c.name = v;
    });
  }
  public override get name(): NullableString {
    return super.name;
  }

  public override get modified(): Optional<Date> {
    return this.cashflows.reduce(
      (lastModified, c) => Date.Max(c.modified ?? new Date(0), lastModified),
      new Date(0),
    );
  }

  public override get created(): Optional<Date> {
    return this.cashflows.reduce(
      (firstCreated, c) => Date.Min(c.created ?? new Date(), firstCreated),
      new Date(),
    );
  }

  public get is_forward(): Optional<boolean> {
    return this._cashflows[0]?.is_forward ?? false;
  }

  public get draft_fx_forward_id(): Nullable<number> {
    return this._cashflows[0]?.draft_fx_forward_id ?? -1;
  }
  public override set description(v: NullableString) {
    super.description = v;
    this._cashflows.forEach((c) => {
      c.description = v;
    });
  }
  public override get description(): NullableString {
    return super.description;
  }

  public override set currency(v: NullableString) {
    this._currency = v;
    this._cashflows.forEach((c) => {
      c.currency = v;
    });
  }
  public override get currency(): NullableString {
    return super.currency;
  }

  public override set installment_id(v: Nullable<number>) {
    this._installment_id = v;
    this._cashflows.forEach((c) => {
      c.installment_id = v;
    });
  }
  public override get installment_id(): Nullable<number> {
    return super.installment_id;
  }

  private _cashflows: Cashflow[] = [];
  public get cashflows(): Cashflow[] {
    return this._cashflows;
  }
  private set cashflows(v: Cashflow[]) {
    this._cashflows = v;
  }

  public override get amount(): number {
    return this.cashflows
      .map((v) => v.amount)
      .reduce((prevSum, currentAmt) => {
        return prevSum + currentAmt;
      }, 0);
  }

  public override get nextSettlementAmount(): number {
    return (
      [...this.cashflows]
        .sort((a: any, b: any) => a.date - b.date)
        .find((cashflow) => {
          return cashflow.date > new Date();
        })?.amount || 0
    );
  }
  public override get nextSettlementDate(): Date {
    return (
      [...this.cashflows]
        .sort((a: any, b: any) => a.date - b.date)
        .find((cashflow) => {
          return cashflow.date > new Date();
        })?.date || new Date()
    );
  }
  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  public override set amount(_v: number) {
    throw "can't set amount on installment";
  }

  public get startDate(): Date {
    return this.cashflows
      .map((v) => v.date)
      .reduce((prev, current) => {
        return prev.getTime() <= current.getTime() ? prev : current;
      });
  }

  public override get endDate(): Date {
    return standardizeDate(
      this.cashflows
        .map((v) => v.date)
        .reduce((prev, current) => {
          return prev.getTime() >= current.getTime() ? prev : current;
        }, new Date(0)),
    );
  }

  public override get dateDisplay(): string {
    return this.cashflows.length === 0
      ? 'None'
      : this.cashflows.length === 1
      ? this.cashflows[0].dateDisplay
      : 'Various';
  }
  public override get duration(): string {
    if (!this.cashflows || this.cashflows.length == 0) {
      return '';
    }
    if (this.cashflows.length == 1) {
      return 'Single payment';
    }
    return formatDuration({
      ...intervalToDuration({
        start: Date.Min(...this.cashflows.map((c) => c.date)),
        end: Date.Max(...this.cashflows.map((c) => c.date)),
      }),
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  }

  public override get ui_status(): CashflowStatusType[] {
    if (this.cashflows.length === 0) {
      return ['draft'];
    }
    const status: CashflowStatusType[] = [];
    const statusPrecedence: CashflowStatusType[] = [
      'default',
      'draft',
      'terminated',
      'archived',
      'unhealthy',
      'pending',
      'inflight',
      'active',
    ];

    const sortedStatuses = uniq(this.cashflows.map((c) => c.ui_status[0]))
      .sort((a, b) => statusPrecedence.indexOf(b) - statusPrecedence.indexOf(a))
      .map((s) => statusPrecedence.indexOf(s));

    //add the status with the highest precedence.
    status.push(statusPrecedence[sortedStatuses[0]]);

    if (sortedStatuses.length > 1) {
      status.push(statusPrecedence[sortedStatuses[1]]);
    }

    // if there are any cashflows that have a secondary status,
    if (
      this.cashflows.reduce(
        (prev, curr) =>
          curr.ui_status.length > prev ? curr.ui_status.length : prev,
        0,
      ) > 1
    ) {
      //add the highest order one.
      status.push(
        statusPrecedence[
          this.cashflows
            .map((c) => c.ui_status[1])
            .reduce((prev, current) => {
              const indx = statusPrecedence.indexOf(current);
              return indx > prev ? indx : prev;
            }, -1)
        ],
      );
    }

    return status;
  }

  public override getHashCode(): number {
    const i = this.clone();
    i.originalHash = undefined;
    return hashString(i.toJSON());
  }

  public override get accountId(): number {
    return this.cashflows.find((c) => c.accountId > 0)?.accountId ?? -1;
  }
  public override set accountId(v: number) {
    this.cashflows.forEach((c) => (c.accountId = v));
    this._cashflowsToDelete.forEach((c) => (c.accountId = v));
  }

  public addCashflow = (date: Date, amount: number, internal_uuid: string) => {
    const c =
      this.cashflows.length > 0 ? this.cashflows[0].copyNew() : new Cashflow();
    c.name = this.name;
    c.direction = this.direction;
    c.date = date;
    c.accountId = this.accountId;
    c.amount = amount;
    c.installment_id = this.installment_id;
    c.currency = this.currency;
    c.internal_uuid = internal_uuid;
    this._cashflows.push(c);
    return c;
  };

  public removeCashflow = (cashflow: Optional<Cashflow>) => {
    if (!cashflow) {
      return;
    }
    if (cashflow.id > 0) {
      if (
        !this._cashflowsToDelete.find(
          (value) => value.internal_uuid === cashflow.internal_uuid,
        )
      ) {
        this._cashflowsToDelete = [...this._cashflowsToDelete, cashflow];
      }
    }
    const _filteredCashflows = this._cashflows.filter(
      (value) => !isEqual(value, cashflow),
    );
    this._cashflows = [..._filteredCashflows];
  };

  public removeCashflowByAmountDate = (amount: number, date: Date) => {
    const cashflowToRemove: Optional<Cashflow> = this.cashflows.find(
      (c) =>
        c.amount === amount &&
        differenceInDays(standardizeDate(c.date), standardizeDate(date)) < 1,
    );
    this.removeCashflow(cashflowToRemove);
  };

  public override toObject(): object {
    return {
      ...super.baseJSON(),
      _loadedFromExisting: this._loadedFromExisting,
      _installmentNeedsUpdate: this._installmentNeedsUpdate,
      _cashflowsToDelete: [...this._cashflowsToDelete],
      cashflows: [...this.cashflows],
    };
  }

  public toJSON(): string {
    return JSON.stringify(this.toObject());
  }

  public static fromObject(obj: any): Installment {
    const i = new Installment();
    i.internal_uuid = obj.internal_uuid;
    i.name = obj.name;
    i.description = obj.description;
    i.currency = obj.currency;
    i.type = obj.type;
    i.direction = obj.direction;
    i.installment_id = obj.installment_id;
    i.accountId = obj.accountId;
    i._loadedFromExisting = obj._loadedFromExisting;
    i._installmentNeedsUpdate = obj._installmentNeedsUpdate;
    i.originalHash = obj.originalHash;
    i._cashflowsToDelete =
      (obj._cashflowsToDelete?.map((c: any) =>
        isString(c)
          ? Cashflow.fromObject(JSON.parse(c))
          : Cashflow.fromObject(c),
      ) as Cashflow[]) ?? [];
    i.cashflows =
      (obj.cashflows?.map((c: any) =>
        isString(c)
          ? Cashflow.fromObject(JSON.parse(c))
          : Cashflow.fromObject(c),
      ) as Cashflow[]) ?? [];
    return i;
  }
  public static fromJSON(json: string): Installment {
    return Installment.fromObject(JSON.parse(json));
  }

  public override clone = (): Installment => {
    const i = new Installment();
    i.name = this.name;
    i.description = this.description;
    i.currency = this.currency;
    i.direction = this.direction;
    i.type = 'installments';
    i.installment_id = this.installment_id;
    this._cashflowsToDelete.forEach((c) =>
      i._cashflowsToDelete.push(c.clone()),
    );
    i._loadedFromExisting = this._loadedFromExisting;
    i._installmentNeedsUpdate = this._installmentNeedsUpdate;
    i.originalHash = this.originalHash;
    this.cashflows.forEach((c) => i.cashflows.push(c.clone()));
    i.accountId = this.accountId;
    i.internal_uuid = this.internal_uuid;
    return i;
  };

  public static fromCashflows(cashflows: Cashflow[]): Nullable<Installment> {
    if (!cashflows || cashflows.length == 0) {
      return null;
    }
    const installment = new Installment();
    installment.name = cashflows[0].name;
    installment.description = cashflows[0].description;
    installment.currency = cashflows[0].currency;
    installment.installment_id = cashflows[0].installment_id;
    installment.direction = cashflows[0].direction;
    installment.type = 'installments';
    installment.cashflows = cashflows.filter(
      (c) => c.action !== PangeaDraftCashflowActionEnum.DELETE,
    );
    installment._cashflowsToDelete = cashflows.filter(
      (c) => c.action === PangeaDraftCashflowActionEnum.DELETE,
    );
    if ((installment.installment_id ?? 0) >= 1) {
      installment._loadedFromExisting = true;
      installment._installmentNeedsUpdate = false;
    }
    installment.originalHash = installment.getHashCode();
    return installment;
  }

  public static async fromInstallmentIdAsync(
    installmentId: number,
    authHelper: ClientAuthHelper,
    useDrafts = true,
  ): Promise<Nullable<Installment>> {
    if (!authHelper) {
      return null;
    }
    const api = authHelper.getAuthenticatedApiHelper();
    const installment = await api.getInstallmentDataAsync(
      installmentId,
      useDrafts,
    );
    if (installment) {
      installment.originalHash = installment.getHashCode();
    }
    return installment;
  }

  public async ensureInstallmentExists(authHelper: ClientAuthHelper) {
    if (!authHelper) {
      return;
    }
    const api = authHelper.getAuthenticatedApiHelper();
    if ((this.installment_id ?? 0) < 1) {
      try {
        const installmentContainer = await api.createNewInstallmentAsync(
          this.name ?? 'Installment',
        );
        if (!isError(installmentContainer) && installmentContainer.id) {
          this.installment_id = installmentContainer.id;
        }
      } catch (e) {
        console.error(e);
        return;
      }
    }
    return this.installment_id && this.installment_id >= 1;
  }

  public override async executeAsync(
    authHelper: ClientAuthHelper,
  ): Promise<void> {
    await Promise.all(
      this._cashflowsToDelete.map(
        async (c) => await c.executeAsync(authHelper),
      ),
    );
    await Promise.all(
      this.cashflows.map(async (c) => await c.executeAsync(authHelper)),
    );
  }

  public override async approveAsync(
    authHelper: ClientAuthHelper,
  ): Promise<void> {
    await Promise.all(
      this.cashflows.map(async (c) => await c.approveAsync(authHelper)),
    );
  }

  public override async activateHedgeAsync(
    authHelperInstance: ClientAuthHelper,
  ): Promise<void> {
    await Promise.all(
      this.cashflows.map(
        async (c) => await c.activateHedgeAsync(authHelperInstance),
      ),
    );
  }

  public override async saveAsync(
    authHelper: ClientAuthHelper,
  ): Promise<boolean | Error> {
    // Even though it seems like nonsense, this will have the effect of ensuring
    // each cashflow has the same accountId set.
    // eslint-disable-next-line no-self-assign
    this.accountId = this.accountId;
    if (!authHelper || !this.isDirty) {
      return false;
    }
    const api = authHelper.getAuthenticatedApiHelper();
    if (!(await this.ensureInstallmentExists(authHelper))) {
      return false;
    }

    if (this._installmentNeedsUpdate) {
      await api.saveInstallmentAsync(this.toPangeaInstallment());
    }

    try {
      await Promise.all(
        this.cashflows.map(async (c) => {
          return await c.saveAsync(authHelper);
        }),
      );
    } catch (e) {
      console.error(e);
      return isError(e) ? e : false;
    }
    try {
      await Promise.all(
        this._cashflowsToDelete.map(async (c) => {
          const d = c.clone();
          d.action = PangeaDraftCashflowActionEnum.DELETE;
          return await d.saveAsync(authHelper);
        }),
      );
    } catch (e) {
      console.error(e);
      return isError(e) ? e : false;
    }
    this.originalHash = this.getHashCode();
    return true;
  }

  public toPangeaInstallment(): PangeaInstallment {
    return Installment.toPangeaInstallment(this);
  }

  public static toPangeaInstallment(
    installment: Installment,
  ): PangeaInstallment {
    return {
      id: installment.installment_id,
      installment_name: installment.name,
    } as PangeaInstallment;
  }
}
