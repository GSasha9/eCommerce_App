import type AccountPage from '../../pages/account/account-page.ts';
import type { IFormValues } from '../../shared/models/interfaces';
import { isBooleanFormName, isStringFormName } from '../../shared/models/typeguards.ts';
import { Validator } from '../../shared/utils/validator.ts';

export class AccountModel {
  private static instance: AccountModel;
  public currentFormValuesAccount: {
    name: string;
    surname: string;
    birthday: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    streetBilling: string;
    cityBilling: string;
    postalCodeBilling: string;
    countryBilling: string;
    isDefaultShipping?: boolean;
    isShippingAsBilling?: boolean;
    isDefaultBilling?: boolean;
  };

  public page: AccountPage;
  public errorsAcc: (keyof IFormValues)[];
  public isValidForm: boolean;

  private constructor(page: AccountPage) {
    this.page = page;

    this.currentFormValuesAccount = {
      name: '',
      surname: '',
      birthday: '',
      street: '',
      city: '',
      postalCode: '',
      country: '',
      streetBilling: '',
      cityBilling: '',
      postalCodeBilling: '',
      countryBilling: '',
      isDefaultShipping: false,
      isShippingAsBilling: false,
      isDefaultBilling: false,
    };
    this.errorsAcc = [];
    this.isValidForm = true;
  }

  /*
  private updateFormValuesFromSortedAddresses(): void {
    if (!this.data) return;

    this.currentFormValuesAccount = {
      name: this.customer?.firstName ?? '',
      surname: this.customer?.lastName ?? '',
      birthday: this.customer?.dateOfBirth ?? '',
      street: this.data.shippingAddress?.streetName ?? '',
      city: this.data.shippingAddress?.city ?? '',
      postalCode: this.data.shippingAddress?.postalCode ?? '',
      country: this.data.shippingAddress?.country ?? '',
      streetBilling: this.data.billingAddress?.streetName ?? '',
      cityBilling: this.data.billingAddress?.city ?? '',
      postalCodeBilling: this.data.billingAddress?.postalCode ?? '',
      countryBilling: this.data.billingAddress?.country ?? '',
      isDefaultShipping: !!this.data.defaultShippingAddress,
      isShippingAsBilling: false,
      isDefaultBilling: false,
    };

    console.log("Updated form values:", this.currentFormValuesAccount);
  } */
  public static getInstance(page: AccountPage): AccountModel {
    if (!AccountModel.instance) {
      AccountModel.instance = new AccountModel(page);
    }

    return AccountModel.instance;
  }

  public setStringValue(value: string, inputName: keyof Omit<IFormValues, 'email' | 'password'>): void {
    if (isStringFormName(inputName)) {
      this.currentFormValuesAccount[inputName] = value;
    }
  }

  public setBooleanValue(value: boolean, inputName: keyof IFormValues): void {
    if (isBooleanFormName(inputName)) this.currentFormValuesAccount[inputName] = value;
  }

  public determineValidForm(): void {
    if (this.errorsAcc.length === 0) {
      this.isValidForm = true;
    } else {
      this.isValidForm = false;
    }

    if (Object.values(this.currentFormValuesAccount).some((value) => value === '')) {
      this.isValidForm = false;
    } else {
      this.isValidForm = true;
    }
  }

  public validateForm(): void {
    this.errorsAcc.length = 0;

    const keys: Array<
      keyof Pick<
        typeof this.currentFormValuesAccount,
        | 'name'
        | 'surname'
        | 'birthday'
        | 'street'
        | 'city'
        | 'postalCode'
        | 'country'
        | 'streetBilling'
        | 'cityBilling'
        | 'postalCodeBilling'
        | 'countryBilling'
      >
    > = [
      'name',
      'surname',
      'birthday',
      'street',
      'city',
      'postalCode',
      'country',
      'streetBilling',
      'cityBilling',
      'postalCodeBilling',
      'countryBilling',
    ];

    for (const key of keys) {
      const value = this.currentFormValuesAccount[key];

      // Make sure value is a non-empty string
      if (typeof value !== 'string' || value.trim() === '') {
        this.isValidForm = false;
        continue;
      }

      switch (key) {
        case 'name':
        case 'surname': {
          if (!Validator.isName(value)) {
            this.errorsAcc.push(key);
          }

          break;
        }
        case 'birthday': {
          if (!Validator.isDateOfBirth(value)) {
            this.errorsAcc.push(key);
          }

          break;
        }
        case 'street':
        case 'streetBilling': {
          if (!Validator.isStreet(value)) {
            this.errorsAcc.push(key);
          }

          break;
        }
        case 'city':
        case 'cityBilling': {
          if (!Validator.isCity(value)) {
            this.errorsAcc.push(key);
          }

          break;
        }
        case 'postalCode': {
          if (!Validator.isPostalCode(value, this.currentFormValuesAccount.country)) {
            this.errorsAcc.push(key);
          }

          break;
        }
        case 'postalCodeBilling': {
          if (!Validator.isPostalCode(value, this.currentFormValuesAccount.countryBilling)) {
            this.errorsAcc.push(key);
          }

          break;
        }
        default:
          break;
      }
    }
  }
}
