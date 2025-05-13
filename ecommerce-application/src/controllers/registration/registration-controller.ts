import RegistrationModel from '../../model/registration/registration-model.ts';
import RegistrationPage from '../../pages/registration';
import {
  isFormName,
  isHTMLCheckboxElement,
  isHTMLInputElement,
  isHTMLSelectElement,
} from '../../shared/models/typeguards.ts';
import { MESSAGE_CONTENT } from '../../shared/utils/validator-сonstants.ts';

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
    this.page.containerForm.node.addEventListener('input', this.onFocusOut);
    this.page.credentialElements.visibilityIcon.node.addEventListener('click', this.onClickChangeVisibility);
  }

  private onChangeInputs = (event: Event): void => {
    if (!(isHTMLInputElement(event.target) || isHTMLSelectElement(event.target))) return;

    const inputName = event.target.name;

    if (isHTMLCheckboxElement(event.target)) {
      const value = event.target.checked;

      if (isFormName(inputName)) {
        this.model.setBooleanValue(value, inputName);
      }
    } else {
      const value = event.target.value;

      if (isFormName(inputName)) {
        this.model.setStringValue(value, inputName);
      }
    }

    this.page.updateBillingAddress(this.model);
  };

  private onFocusOut = (event: Event): void => {
    if (!(isHTMLInputElement(event.target) || isHTMLSelectElement(event.target))) return;

    const { errors, isValidForm } = this.model.validateForm();

    this.page.deleteErrorMessage();
    errors.forEach((name) => this.page.renderErrorMassage(name, MESSAGE_CONTENT[name]));
    this.page.renderDisabledRegister(!isValidForm);
  };

  private onClickChangeVisibility = (): void => {
    const input = this.page.credentialElements.inputPassword.getElement();
    const icon = this.page.credentialElements.visibilityIcon.node;
    const inputType = input.getAttribute('type');

    if (inputType === 'text') {
      input.setAttribute('type', 'password');
      input.setAttribute('placeholder', '********');
      icon.classList.remove('hide');
    }

    if (inputType === 'password') {
      input.setAttribute('type', 'text');
      input.setAttribute('placeholder', 'your password');
      icon.classList.add('hide');
    }

    return;
  };
}
