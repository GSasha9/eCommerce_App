import RegistrationModel from '../../model/registration/registration-model.ts';
import RegistrationPage from '../../pages/registration';
import { isFormName, isHTMLInputElement, isHTMLSelectElement } from '../../shared/models/typeguards.ts';
// import { Validator } from '../../shared/utils/validator.ts';

export class RegistrationController {
  private page: RegistrationPage;
  private model: RegistrationModel;

  constructor() {
    this.page = new RegistrationPage();
    this.model = new RegistrationModel();
    this.render();
  }

  public render(): void {
    document.body.replaceChildren(this.page.getHtmlElement());
    this.page.containerForm.node.addEventListener('input', this.onChangeInputs);
    // this.page.containerForm.node.addEventListener('focusout', this.onBlur);
  }

  private onChangeInputs = (event: Event): void => {
    if (!(isHTMLInputElement(event.target) || isHTMLSelectElement(event.target))) return;

    const inputName = event.target.name;
    const value = event.target.value;
    // let isValid;

    console.log('this.currentFormValues-', this.model.currentFormValues);

    if (isFormName(inputName)) {
      this.model.setValue(value, inputName);
    }

    console.log('this.currentFormValues-', this.model.currentFormValues);

    // switch (inputName) {
    //   case 'email':
    //     isValid = Validator.isEmail(value);

    //     break;
    //   case 'password':
    //     isValid = Validator.isPassword(value);

    //     break;
    //   case 'name':
    //   case 'surname':
    //     isValid = Validator.isName(value);

    //     break;
    //   case 'birthday':
    //     isValid = Validator.isDateOfBirth(value);

    //     break;
    //   case 'street':
    //   case 'street-billing':
    //     isValid = Validator.isStreet(value);

    //     break;
    //   case 'city':
    //   case 'city-billing':
    //     isValid = Validator.isCity(value);

    //     break;

    //   case 'postal-code':
    //     isValid = Validator.isPostalCode(value, this.model.currentFormValues.city);

    //     break;
    //   case 'postal-code-billing':
    //     isValid = Validator.isPostalCode(value, this.model.currentFormValues['city-billing']);

    //     break;
    // }

    // if (!isValid) {
    //   this.showErrorMessage();
    // }

    // this.deleteErrorMessage();
  };

  // private onBlur = (event: Event): void => {
  //   console.log('BLUR', event);
  //   console.log(this.model.currentFormValues);
  // };

  // private showErrorMessage(): void {}

  // private deleteErrorMessage(): void {}
}
