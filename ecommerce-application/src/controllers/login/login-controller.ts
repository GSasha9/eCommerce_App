import { LoginModel } from '../../model/login/login-model.ts';
import { LoginPage } from '../../pages/login/login';
import { findUserByEmailResponse } from '../../shared/models/typeguards.ts';
import { MESSAGE_CONTENT } from '../../shared/utils/validator-сonstants.ts';
import { isHTMLInputElement, isHTMLSelectElement, isFormName } from '../../shared/models/typeguards.ts';
import { authService } from '../../services/commercetools/auth-service.ts';
import { Modal } from '../../components/modals/modal.ts';
import ConfirmModal from '../../components/modals/confirm-modal/confirm-modal.ts';

export class LoginController {
  private loginPage: LoginPage;
  private loginModel: LoginModel;

  constructor() {
    this.loginPage = new LoginPage({}, this);
    this.loginModel = new LoginModel(this.loginPage);
    //this.render();
  }

  public render(): void {
    document.body.replaceChildren(this.loginPage.getHtmlElement());
    this.loginPage.containerForm.node.addEventListener('input', this.onChangeInputs);
    this.loginPage.containerForm.node.addEventListener('input', this.onFocusOut);
    this.loginPage.credentialElements.visibilityIcon.node.addEventListener('click', this.onClickChangeVisibility);
    this.loginPage.loginButton.getElement().addEventListener('click', (event) => {
      event?.preventDefault();
      void this.onClickLogin();
    });
  }

  private onClickLogin = async (): Promise<void> => {
    const data = {
      email: this.loginModel.currentFormValues.email,
      password: this.loginModel.currentFormValues.password,
    };

    if (data.email && data.password)
      try {
        const response = await authService.signInCustomer(data.email, data.password);

        console.log(response);

        if (response) {
          const modal = new Modal(`Hello, ${response.customer.firstName}`);

          modal.open();
          setTimeout(() => {
            window.location.replace('/main');
          }, 3000);
        }
      } catch {
        try {
          const response = await authService.getCustomerByEmail(data.email);

          if (findUserByEmailResponse(response)) {
            if (response.body?.results.length === 0) {
              console.log('this email doesnt register');
              const modal = new ConfirmModal('No account found with this email. Do you want to register?');

              modal.setAction(() => {
                window.location.href = '/registration';
              });
              modal.open();
            } else {
              const modal = new Modal('Incorrect password');

              modal.open();
              console.log('incorrect password');
            }
          }
        } catch {
          console.error('error');
        }
      }
  };

  private onChangeInputs = (event: Event): void => {
    if (!(isHTMLInputElement(event.target) || isHTMLSelectElement(event.target))) return;

    const inputName = event.target.name;

    const value = event.target.value;

    if (isFormName(inputName)) {
      this.loginModel.setStringValue(value, inputName);
    }
  };

  private onFocusOut = (event: Event): void => {
    if (!(isHTMLInputElement(event.target) || isHTMLSelectElement(event.target))) return;

    const { errors, isValidForm } = this.loginModel.validateForm();

    this.loginPage.deleteErrorMessage();
    errors.forEach((name) => this.loginPage.renderErrorMassage(name, MESSAGE_CONTENT[name]));
    this.loginPage.renderDisabledLogin(!isValidForm);
  };

  private onClickChangeVisibility = (): void => {
    const input = this.loginPage.credentialElements.inputPassword.getElement();
    const icon = this.loginPage.credentialElements.visibilityIcon.node;
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
