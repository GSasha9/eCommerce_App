import type { LoginPage } from '../../pages/login/login';
import type { IFormValues } from '../../shared/models/interfaces';
import { isStringFormName, isBooleanFormName } from '../../shared/models/typeguards.ts';
import { Validator } from '../../shared/utils/validator';

export class LoginModel {
  public currentFormValues: Partial<IFormValues>;
  public page: LoginPage;
  private isValidForm: boolean;

  constructor(page: LoginPage) {
    this.page = page;
    this.currentFormValues = {
      email: '',
      password: '',
    };
    this.isValidForm = false;
  }

  public setStringValue(value: string, inputName: keyof IFormValues): void {
    if (isStringFormName(inputName)) this.currentFormValues[inputName] = value;
  }

  public setBooleanValue(value: boolean, inputName: keyof IFormValues): void {
    if (isBooleanFormName(inputName)) this.currentFormValues[inputName] = value;
  }

  public validateForm(): { errors: (keyof IFormValues)[]; isValidForm: boolean } {
    const errors: (keyof IFormValues)[] = [];

    this.isValidForm = true;

    for (const key in this.currentFormValues) {
      if (!isStringFormName(key)) continue;

      if (!this.currentFormValues[key]) {
        this.isValidForm = false;
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
      }
    }

    return { errors, isValidForm: errors.length === 0 && this.isValidForm };
  }
}
