import type RegistrationPage from '../../pages/registration';
import type { IFormValues } from '../../shared/models/interfaces/form-values.ts';
import { isBooleanFormName, isStringFormName } from '../../shared/models/typeguards.ts/typeguards.ts';
import { Validator } from '../../shared/utils/validator.ts';

class RegistrationModel {
  public currentFormValues: IFormValues;
  public page: RegistrationPage;
  public errors: (keyof IFormValues)[];
  public isValidForm: boolean;

  constructor(page: RegistrationPage) {
    this.page = page;
    this.currentFormValues = {
      email: '',
      password: '',
      name: '',
      surname: '',
      birthday: '',
      street: '',
      city: '',
      ['postal-code']: '',
      country: '',
      ['street-billing']: '',
      ['city-billing']: '',
      ['postal-code-billing']: '',
      ['country-billing']: '',
      ['is-default-shipping']: false,
      ['is-shipping-as-billing']: false,
      ['is-default-billing']: false,
    };
    this.errors = [];
    this.isValidForm = true;
  }

  public setStringValue(value: string, inputName: keyof IFormValues): void {
    if (isStringFormName(inputName)) this.currentFormValues[inputName] = value;
  }

  public setBooleanValue(value: boolean, inputName: keyof IFormValues): void {
    if (isBooleanFormName(inputName)) this.currentFormValues[inputName] = value;
  }

  public validateForm(): void {
    for (const key in this.currentFormValues) {
      if (!isStringFormName(key)) continue;

      if (!this.currentFormValues[key]) {
        this.isValidForm = false;
        continue;
      }

      this.errors = [];

      const value = this.currentFormValues[key];

      switch (key) {
        case 'email':
          if (!Validator.isEmail(value)) this.errors.push(key);

          break;
        case 'password':
          if (!Validator.isPassword(value)) this.errors.push(key);

          break;
        case 'name':
        case 'surname':
          if (!Validator.isName(value)) this.errors.push(key);

          break;
        case 'birthday':
          if (!Validator.isDateOfBirth(value)) this.errors.push(key);

          break;
        case 'street':
        case 'street-billing':
          if (!Validator.isStreet(value)) this.errors.push(key);

          break;
        case 'city':
        case 'city-billing':
          if (!Validator.isCity(value)) this.errors.push(key);

          break;
        case 'postal-code':
          if (!Validator.isPostalCode(value, this.currentFormValues.country)) {
            this.errors.push(key);
          }

          break;
        case 'postal-code-billing':
          if (!Validator.isPostalCode(value, this.currentFormValues['country-billing'])) {
            this.errors.push(key);
          }

          break;
      }
    }
  }

  public determineValidForm(): void {
    if (this.errors.length === 0) {
      this.isValidForm = true;
    } else {
      this.isValidForm = false;
    }
  }
}

export default RegistrationModel;
