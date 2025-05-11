import type RegistrationPage from '../../pages/registration';
import type { IFormValues, IValidationResult } from '../../shared/models/interfaces';
import { FORM_INITIALIZATION, VALIDATION_RESULT } from '../../shared/utils/validator-сonstants';

class RegistrationModel {
  public currentFormValues: IFormValues;
  public validationResult: IValidationResult;
  public page: RegistrationPage;

  constructor(page: RegistrationPage) {
    this.page = page;
    this.currentFormValues = FORM_INITIALIZATION;
    this.validationResult = VALIDATION_RESULT;
  }

  public setValue(value: string, inputName: keyof IFormValues): void {
    this.currentFormValues[inputName] = value;
  }

  public setValidationResult(isValid: boolean, inputName: keyof IFormValues): void {
    this.validationResult[inputName] = isValid;
  }

  public checkDisabledSubmit(): void {
    const isDisabled = Object.values(this.validationResult).some((value) => value === false);

    this.page.renderDisabledRegister(isDisabled);
  }
}

export default RegistrationModel;
