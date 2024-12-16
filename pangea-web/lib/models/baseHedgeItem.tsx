import * as uuid from 'uuid';
import { ClientAuthHelper } from '../authHelper';
import {
  CashflowDirectionType,
  CashflowStatusType,
  FrequencyType,
} from '../types';

export abstract class BaseHedgeItem {
  private static readonly DESCRIPTION_MAXIMUM_LENGTH = 255;
  private static readonly NAME_MAXIMUM_LENGTH = 60;
  protected _direction: CashflowDirectionType = 'paying';
  public get direction(): CashflowDirectionType {
    return this._direction;
  }
  public set direction(v: CashflowDirectionType) {
    this._direction = v;
  }

  protected _name: NullableString;
  public get name(): NullableString {
    return this._name;
  }
  public set name(v: NullableString) {
    if (v && v.length > BaseHedgeItem.NAME_MAXIMUM_LENGTH) {
      console.warn(
        `Name too long ${v.length}/${BaseHedgeItem.NAME_MAXIMUM_LENGTH} characters.\r\nName: ${v}`,
      );
    }

    this._name = v === '' ? null : v;
  }

  private _description: NullableString;
  public get description(): NullableString {
    return this._description;
  }
  public set description(v: NullableString) {
    if (v && v.length > BaseHedgeItem.DESCRIPTION_MAXIMUM_LENGTH) {
      throw `Description too long ${v.length}/${BaseHedgeItem.DESCRIPTION_MAXIMUM_LENGTH} characters`;
    }

    this._description = v === '' ? null : v;
  }

  private _internal_uuid: string = uuid.v4();
  public get internal_uuid(): string {
    return this._internal_uuid;
  }
  public set internal_uuid(v: string) {
    if (v && !RegExp(/^[\da-f]{8}-([\da-f]{4}-){3}[\da-f]{12}$/).test(v)) {
      throw 'Invalid UUID';
    }
    this._internal_uuid = v;
  }

  protected _type: FrequencyType = 'onetime';
  public get type(): FrequencyType {
    return this._type;
  }
  public set type(v: FrequencyType) {
    this._type = v;
  }

  protected _currency: NullableString;
  public get currency(): NullableString {
    return this._currency;
  }
  public set currency(v: NullableString) {
    if ((v || v === '') && !RegExp(/^[A-Z]{3}$/).test(v)) {
      throw 'Invalid mnemonic';
    }
    this._currency = v;
  }

  protected _accountId = -1;
  public get accountId(): number {
    return this._accountId;
  }
  public set accountId(v: number) {
    if (v < -1 || Number(v.toFixed(0)) !== v) {
      throw 'Invalid Account ID';
    }
    this._accountId = v;
  }

  protected _installment_id: Nullable<number> = null;
  public get installment_id(): Nullable<number> {
    return this._installment_id;
  }
  public set installment_id(v: Nullable<number>) {
    if (v && (v < -1 || Number(v.toFixed(0)) !== v)) {
      throw 'Invalid Installment ID';
    }
    this._installment_id = v;
  }

  protected _amount = 0;
  public get amount(): number {
    return this._amount;
  }
  public set amount(v: number) {
    this._amount = Math.abs(v);
  }

  public get totalAmount(): number {
    return this.amount;
  }

  public get directionalAmount(): number {
    if (Math.abs(this.amount) === 0) {
      return 0;
    }
    return this._direction === 'receiving' ? this.amount : this.amount * -1;
  }
  public set directionalAmount(v: number) {
    this.direction = v <= 0 ? 'paying' : 'receiving';
    this.amount = v;
  }

  private _originalHash: Optional<number>;
  protected get originalHash(): Optional<number> {
    return this._originalHash;
  }
  protected set originalHash(v: Optional<number>) {
    this._originalHash = v;
  }

  public get isDirty(): boolean {
    return !this.originalHash || this.originalHash !== this.getHashCode();
  }

  public get frequencyDisplayText(): string {
    switch (this.type) {
      case 'installments':
        return 'Installments';
      case 'onetime':
        return 'One-Time';
      case 'recurring':
        return 'Recurring';
      default:
        return '';
    }
  }
  public abstract get nextSettlementAmount(): number;
  public abstract get nextSettlementDate(): Date;

  public abstract get endDate(): Date;

  public abstract get dateDisplay(): string;

  public abstract get duration(): string;

  public abstract get ui_status(): CashflowStatusType[];

  public abstract get modified(): Optional<Date>;

  public abstract get created(): Optional<Date>;

  public abstract get is_forward(): Optional<boolean>;
  public abstract get draft_fx_forward_id(): Nullable<number>;

  public abstract getHashCode(): number;

  public abstract toObject(): object;

  public abstract saveAsync(
    authHelper: ClientAuthHelper,
  ): Promise<boolean | Error>;
  public abstract executeAsync(
    authHelper: ClientAuthHelper,
  ): Promise<unknown | Error>;
  public abstract approveAsync(
    authHelper: ClientAuthHelper,
  ): Promise<unknown | Error>;
  public abstract activateHedgeAsync(
    authHelper: ClientAuthHelper,
  ): Promise<unknown | Error>;
  public abstract clone(): BaseHedgeItem;

  protected baseJSON(): object {
    return {
      installment_id: this.installment_id,
      accountId: this.accountId,
      currency: this.currency,
      type: this.type,
      name: this.name,
      description: this.description,
      direction: this.direction,
      originalHash: this.originalHash,
      internal_uuid: this.internal_uuid,
      is_forward: this.is_forward,
      draft_fx_forward_id: this.draft_fx_forward_id,
    };
  }
}

export abstract class BaseHedgeItemTyped<
  T extends BaseHedgeItem,
> extends BaseHedgeItem {
  public abstract clone(): T;
}
