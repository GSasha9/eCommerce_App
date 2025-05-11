import RegistrationModel from '../../model/registration/registration-model.ts';
import RegistrationPage from '../../pages/registration';
import { isFormName, isHTMLInputElement, isHTMLSelectElement } from '../../shared/models/typeguards.ts';
import { MESSAGE_CONTENT } from '../../shared/utils/validator-сonstants.ts';
import { Validator } from '../../shared/utils/validator.ts';

export class RegistrationController {
  private page: RegistrationPage;
  private model: RegistrationModel;

  constructor() {
    this.page = new RegistrationPage();
    this.model = new RegistrationModel(this.page);
    this.render();
  }

  public render(): void {
    document.body.replaceChildren(this.page.getHtmlElement());
    this.page.containerForm.node.addEventListener('input', this.onChangeInputs);
    this.page.containerForm.node.addEventListener('focusout', this.onBlur);
  }

  private onChangeInputs = (event: Event): void => {
    if (!(isHTMLInputElement(event.target) || isHTMLSelectElement(event.target))) return;

    const inputName = event.target.name;
    const value = event.target.value;

    if (isFormName(inputName)) {
      this.model.setValue(value, inputName);
    }

    console.log('current Form Values-', this.model.currentFormValues);
  };

  private onBlur = (event: Event): void => {
    if (!(isHTMLInputElement(event.target) || isHTMLSelectElement(event.target))) return;

    const inputName = event.target.name;
    const value = event.target.value;
    let isValid;

    if (!isFormName(inputName)) return;

    switch (inputName) {
      case 'email':
        isValid = Validator.isEmail(value);

        break;
      case 'password':
        isValid = Validator.isPassword(value);

        break;
      case 'name':
      case 'surname':
        isValid = Validator.isName(value);

        break;
      case 'birthday':
        isValid = Validator.isDateOfBirth(value);

        break;
      case 'street':
      case 'street-billing':
        isValid = Validator.isStreet(value);

        break;
      case 'city':
      case 'city-billing':
        isValid = Validator.isCity(value);

        break;

      case 'postal-code':
        isValid = Validator.isPostalCode(value, this.model.currentFormValues.city);

        break;
      case 'postal-code-billing':
        isValid = Validator.isPostalCode(value, this.model.currentFormValues['city-billing']);

        break;
    }

    if (isValid !== undefined) {
      this.model.setValidationResult(isValid, inputName);
      console.log(this.model.validationResult);
    }

    this.page.deleteErrorMessage(inputName);

    if (!isValid) {
      this.model.checkDisabledSubmit();
      const message = MESSAGE_CONTENT[inputName];

      this.page.renderErrorMassage(inputName, message);
    }
  };
}
