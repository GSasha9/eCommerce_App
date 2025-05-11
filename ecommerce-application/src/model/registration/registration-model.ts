import type RegistrationPage from '../../pages/registration';
import type { IFormValues } from '../../shared/models/interfaces';
import { isFormName } from '../../shared/models/typeguards.ts/typeguards.ts';
import { Validator } from '../../shared/utils/validator.ts';

class RegistrationModel {
  public currentFormValues: IFormValues;
  public page: RegistrationPage;

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
    };
  }

  public setValue(value: string, inputName: keyof IFormValues): void {
    this.currentFormValues[inputName] = value;
  }

  public validateForm(): { errors: (keyof IFormValues)[]; isValidForm: boolean } {
    const errors: (keyof IFormValues)[] = [];
    let isValidForm = true;

    for (const key in this.currentFormValues) {
      if (!isFormName(key)) continue;

      if (!this.currentFormValues[key]) {
        isValidForm = false;
        continue;
      }

      const value = this.currentFormValues[key];

      switch (key) {
        case 'email':
          if (!Validator.isEmail(value)) errors.push(key);

          break;
        case 'password':
          if (!Validator.isPassword(value)) errors.push(key);

          break;
        case 'name':
        case 'surname':
          if (!Validator.isName(value)) errors.push(key);

          break;
        case 'birthday':
          if (!Validator.isDateOfBirth(value)) errors.push(key);

          break;
        case 'street':
        case 'street-billing':
          if (!Validator.isStreet(value)) errors.push(key);

          break;
        case 'city':
        case 'city-billing':
          if (!Validator.isCity(value)) errors.push(key);

          break;
        case 'postal-code':
          if (!Validator.isPostalCode(value, this.currentFormValues.country)) {
            errors.push(key);
          }

          break;
        case 'postal-code-billing':
          if (!Validator.isPostalCode(value, this.currentFormValues['country-billing'])) {
            errors.push(key);
          }

          break;
      }
    }

    return { errors, isValidForm: errors.length === 0 && isValidForm };
  }
}

export default RegistrationModel;
