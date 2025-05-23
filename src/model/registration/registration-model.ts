import type RegistrationPage from '../../pages/registration/index.ts';
import type { IFormValues } from '../../shared/models/interfaces/form-values.ts';
import { isBooleanFormName, isStringFormName } from '../../shared/models/typeguards.ts/typeguards.ts';
import { Validator } from '../../shared/utils/validator.ts';

class RegistrationModel {
  private static instance: RegistrationModel;
  public currentFormValues: IFormValues;
  public page: RegistrationPage;
  public errors: (keyof IFormValues)[];
  public isValidForm: boolean;

  private constructor(page: RegistrationPage) {
    this.page = page;
    this.currentFormValues = {
      email: '',
      password: '',
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
    this.errors = [];
    this.isValidForm = true;
  }

  public static getInstance(page: RegistrationPage): RegistrationModel {
    if (!RegistrationModel.instance) {
      RegistrationModel.instance = new RegistrationModel(page);
    }

    return RegistrationModel.instance;
  }

  public setStringValue(value: string, inputName: keyof IFormValues): void {
    if (isStringFormName(inputName)) {
      this.currentFormValues[inputName] = value;
    }
  }

  public setBooleanValue(value: boolean, inputName: keyof IFormValues): void {
    if (isBooleanFormName(inputName)) this.currentFormValues[inputName] = value;
  }

  public validateForm(): void {
    this.errors.length = 0;
    for (const key in this.currentFormValues) {
      if (!isStringFormName(key)) continue;

      if (!this.currentFormValues[key]) {
        this.isValidForm = false;
        continue;
      }

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
        case 'streetBilling':
          if (!Validator.isStreet(value)) this.errors.push(key);

          break;
        case 'city':
        case 'cityBilling':
          if (!Validator.isCity(value)) {
            this.errors.push(key);
          }

          break;
        case 'postalCode':
          if (!Validator.isPostalCode(value, this.currentFormValues.country)) {
            this.errors.push(key);
          }

          break;
        case 'postalCodeBilling':
          if (!Validator.isPostalCode(value, this.currentFormValues['countryBilling'])) {
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

    if (Object.values(this.currentFormValues).some((value) => value === '')) {
      this.isValidForm = false;
    } else {
      this.isValidForm = true;
    }
  }
}

export default RegistrationModel;
