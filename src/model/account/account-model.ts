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

  public errorsAcc: (keyof IFormValues)[];
  public isValidForm: boolean;

  private constructor() {
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

  public validatePersonalInfo(): boolean {
    this.errorsAcc.length = 0;
    const name = this.currentFormValuesAccount.name;

    if (!name || !Validator.isName(name)) {
      this.errorsAcc.push('name');
    }

    const surname = this.currentFormValuesAccount.surname;

    if (!surname || !Validator.isName(surname)) {
      this.errorsAcc.push('surname');
    }

    const birthday = this.currentFormValuesAccount.birthday;

    if (!birthday || !Validator.isDateOfBirth(birthday)) {
      this.errorsAcc.push('birthday');
    }

    this.isValidForm = this.errorsAcc.length === 0;

    return this.isValidForm;
  }

  public static getInstance(): AccountModel {
    if (!AccountModel.instance) {
      AccountModel.instance = new AccountModel();
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
    const hasNoErrors = this.errorsAcc.length === 0;

    const noEmptyFields = !Object.entries(this.currentFormValuesAccount)
      .filter((entry): entry is [string, string] => typeof entry[1] === 'string')
      .some(([, value]) => value.trim() === '');

    this.isValidForm = hasNoErrors && noEmptyFields;
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
