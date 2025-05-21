import { LoginModel } from '../../model/login/login-model.ts';
import { LoginPage } from '../../pages/login/login';
import { MESSAGE_CONTENT } from '../../shared/utils/validator-сonstants.ts';
import { isHTMLInputElement, isHTMLSelectElement, isFormName } from '../../shared/models/typeguards.ts';
import { authService } from '../../services/commercetools/auth-service.ts';
import ConfirmModal from '../../components/modals/confirm-modal/confirm-modal.ts';
import { route } from '../../router/index.ts';
import { ModalGreeting } from '../../components/modals/modal-greeting.ts';
import { Layout } from '../../pages/layout.ts';

export class LoginController {
  private readonly loginPage: LoginPage;
  private loginModel: LoginModel;

  constructor() {
    this.loginPage = LoginPage.getInstance({}, this);
    this.loginModel = LoginModel.getInstance(this.loginPage);
    this.initListeners();
  }

  public static configureLogoutButton(): void {
    const loginButton = document.querySelector('.header__button--login');

    if (loginButton) {
      loginButton.classList.add('logout');
      loginButton.classList.remove('login');
      loginButton.textContent = 'Logout';

      loginButton.addEventListener('click', (evt: Event): void => {
        evt.preventDefault();
        authService.logOutCustomer();

        loginButton.classList.remove('logout');
        loginButton.classList.add('login');
        loginButton.textContent = 'Login';
        localStorage.clear();
        route.navigate('/login');
      });
    }
  }

  public initListeners(): void {
    this.loginPage.containerForm.node.addEventListener('input', this.onChangeInputs);
    this.loginPage.containerForm.node.addEventListener('input', this.onFocusOut);
    this.loginPage.credentialElements.visibilityIcon.node.addEventListener('click', this.onClickChangeVisibility);
    this.loginPage.loginButton.getElement().addEventListener('click', (event) => {
      event.preventDefault();
      void this.onClickLogin();
    });
  }

  public render(): void {
    const layout = Layout.getInstance();

    layout.setMainContent(this.loginPage.getHtmlElement());
  }

  private onClickLogin = async (): Promise<void> => {
    const data = {
      email: this.loginModel.currentFormValues.email,
      password: this.loginModel.currentFormValues.password,
    };

    if (data.email && data.password)
      try {
        const response = await authService.signInCustomer(data.email, data.password);

        if (response) {
          const modal = new ModalGreeting(`Hello, ${response.customer.firstName}`);

          await modal.open();
          route.navigate('/home');
          localStorage.setItem('isLoggedPlants', 'true');
          LoginController.configureLogoutButton();
        }
      } catch {
        const modal = new ConfirmModal(
          'Account with these credentials was not found. Please check your login or password. Would you like to register?',
        );

        modal.setAction(() => {
          route.navigate('/registration');
        });
        await modal.open();
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
