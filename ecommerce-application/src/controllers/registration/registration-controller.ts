import { ModalGreeting } from '../../components/modals/modal-greeting.ts';
import RegistrationModel from '../../model/registration/registration-model.ts';
import RegistrationPage from '../../pages/registration';
import { route } from '../../router/index.ts';
import { authService } from '../../services/commercetools/auth-service.ts';
import { handleApiError } from '../../services/sdk/handle-api-error.ts';
import {
  isCommercetoolsApiError,
  isFormName,
  isHTMLCheckboxElement,
  isHTMLInputElement,
  isHTMLSelectElement,
} from '../../shared/models/typeguards.ts';
import { LoginController } from '../login/login-controller.ts';

export class RegistrationController {
  private page: RegistrationPage;
  private model: RegistrationModel;

  constructor() {
    this.page = new RegistrationPage();
    this.model = new RegistrationModel(this.page);
  }

  public render(): void {
    document.body.replaceChildren(this.page.getHtmlElement());
    this.page.containerForm.node.addEventListener('input', this.onChangeInputs);
    this.page.credentialElements.visibilityIcon.node.addEventListener('click', this.onClickChangeVisibility);
    this.page.registrationButton.getElement().addEventListener('click', () => void this.onClickRegistration());
  }

  private onClickRegistration = async (): Promise<void> => {
    const data = {
      email: this.model.currentFormValues.email,
      password: this.model.currentFormValues.password,
      dateOfBirth: this.model.currentFormValues.birthday,
      firstName: this.model.currentFormValues.name,
      lastName: this.model.currentFormValues.surname,
      addresses: [
        {
          country: this.model.currentFormValues.country,
          streetName: this.model.currentFormValues.street,
          postalCode: this.model.currentFormValues['postal-code'],
          city: this.model.currentFormValues.city,
        },
        {
          country: this.model.currentFormValues['country-billing'],
          streetName: this.model.currentFormValues['street-billing'],
          postalCode: this.model.currentFormValues['postal-code-billing'],
          city: this.model.currentFormValues['city-billing'],
        },
      ],
      shippingAddresses: [0],
      billingAddresses: this.model.currentFormValues['is-shipping-as-billing'] ? [0] : [1],

      ...(this.model.currentFormValues['is-default-shipping'] && {
        defaultShippingAddress: 0,
      }),
      ...(this.model.currentFormValues['is-default-billing'] && {
        defaultBillingAddress: 1,
      }),
    };

    try {
      await authService.registerCustomer(data);
      await new ModalGreeting('The account was created successfully').open();
      route.navigate('/home');
      LoginController.configureLogoutButton();
    } catch (error) {
      if (isCommercetoolsApiError(error)) {
        handleApiError(error);
      } else {
        console.error('Unknown error', error);
      }
    }
  };

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
    this.checkAndShowErrors();
  };

  private checkAndShowErrors(): void {
    this.page.deleteErrorMessage();
    this.model.validateForm();
    this.model.errors.forEach((name) => this.page.renderErrorMassage(name));
    this.model.determineValidForm();
    this.page.renderDisabledRegister(this.model.isValidForm);
  }

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
