import type { Customer } from '@commercetools/platform-sdk';

import { CheckAddress } from '../shared/utils/check-adress.ts';

export class UserState {
  private static instance: UserState;
  private _customer: Customer | undefined = undefined;
  private _isEdited: boolean = false;
  private _editingAddressId: string | null = null;

  private _sortedAddresses: ReturnType<typeof CheckAddress.sortAddresses> | null = null;
  private observers: Array<(customer: Customer | undefined) => void> = [];

  private constructor() {}

  public static getInstance(): UserState {
    if (!UserState.instance) {
      UserState.instance = new UserState();
    }

    return UserState.instance;
  }

  public get customer(): Customer | undefined {
    return this._customer;
  }

  public get sortedAddresses(): ReturnType<typeof CheckAddress.sortAddresses> | null {
    return this._sortedAddresses;
  }

  public set customer(customer: Customer | undefined) {
    this._customer = customer;
    this._sortedAddresses = customer ? CheckAddress.sortAddresses(customer) : null;
    this.notifyObservers();
  }

  public set isEdited(value: boolean) {
    this._isEdited = value;
  }

  public get isEdited(): boolean {
    return this._isEdited;
  }

  public set editingAddressId(id: string | null) {
    this._editingAddressId = id;
  }

  public get editingAddressId(): string | null {
    return this._editingAddressId;
  }

  public subscribe(observer: (customer: Customer | undefined) => void): void {
    this.observers.push(observer);
  }

  public notifyObservers(): void {
    this.observers.forEach((observer) => observer(this._customer));
  }
}
