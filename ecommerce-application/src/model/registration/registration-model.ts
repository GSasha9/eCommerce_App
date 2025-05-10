import type { IFormValues } from '../../shared/models/interfaces';
import { FORM_INITIALIZATION } from '../../shared/utils/validator-сonstants';

class RegistrationModel {
  public currentFormValues: IFormValues;

  constructor() {
    this.currentFormValues = FORM_INITIALIZATION;
  }

  public setValue(value: string, inputName: keyof IFormValues): void {
    this.currentFormValues[inputName] = value;
  }
}

export default RegistrationModel;
