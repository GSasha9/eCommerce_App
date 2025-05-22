import './_login.scss';
import type { IParameters } from '../../shared/models/interfaces/index.ts';
import { CreateElement } from '../../shared/utils/create-element.ts';
import { View } from '../view.ts';
import { CreateButton } from '../../components/button/create-button.ts';
import Element from '../../components/element/element.ts';
import { CredentialElements } from '../registration/credentials-elements.ts';
import type { LoginController } from '../../controllers/login/login-controller.ts';
import { route } from '../../router/index.ts';

export class LoginPage extends View {
  private static instance: LoginPage;
  public credentialElements: CredentialElements;
  public loginButton: CreateButton;
  public containerForm: Element<'form'>;
  public loginController: LoginController;

  private constructor(parameters: Partial<IParameters> = {}, controller: LoginController) {
    super({ tag: 'div', classNames: ['login-page'], ...parameters });
    this.loginController = controller;

    const close = new CreateElement({
      tag: 'a',
      classNames: ['close'],
      textContent: '',
      callback: (event: Event): void => {
        event.preventDefault();
        route.navigate(`/home`);
      },
    });

    const mainTitle = new CreateElement({
      tag: 'h2',
      classNames: ['title-login'],
      textContent: 'Login',
    });

    const registrationLink = new CreateElement({
      tag: 'a',
      classNames: ['link-registration'],
      textContent: 'Registration',
      callback: (event: Event): void => {
        event.preventDefault();
        route.navigate(`/registration`);
      },
    });

    const span = new CreateElement({
      tag: 'span',
      classNames: ['login-span'],
      textContent: '',
      callback: (): void => {},
    });
    const spanElement = span.getElement();

    const containerLoginRegister = new CreateElement({
      tag: 'div',
      classNames: ['container-registration'],
      textContent: '',
      callback: (): void => {},
    });
    const container = containerLoginRegister.getElement();

    container.appendChild(mainTitle.getElement());
    container.appendChild(spanElement);
    container.appendChild(registrationLink.getElement());

    this.credentialElements = new CredentialElements();

    this.loginButton = new CreateButton({
      classNames: ['form__button'],
      textContent: 'LOGIN',
      type: 'button',
      disabled: true,
    });

    this.containerForm = new Element<'form'>({
      tag: 'form',
      className: 'wrapper-form-login',
      children: [close.getElement(), container, this.credentialElements.getElement(), this.loginButton.getElement()],
    });

    this.viewElementCreator.addInnerElement(this.containerForm.node);
  }

  public static getInstance(parameters: Partial<IParameters> = {}, controller: LoginController): LoginPage {
    if (!LoginPage.instance) {
      LoginPage.instance = new LoginPage(parameters, controller);
    }

    return LoginPage.instance;
  }

  public renderDisabledLogin(isDisabled: boolean): void {
    if (isDisabled) {
      this.loginButton.getElement().setAttribute('disabled', 'true');
    } else {
      this.loginButton.getElement().removeAttribute('disabled');
    }
  }

  public renderErrorMassage(inputName: string, message?: string): void {
    const elem = this.containerForm.node.querySelector(`.input-${inputName}`);
    const node = new CreateElement({
      tag: 'div',
      classNames: ['error-message'],
      textContent: `${message}`,
    });

    if (elem) {
      elem.append(node.getElement());
    }
  }

  public deleteErrorMessage(): void {
    const messages = this.containerForm.node.querySelectorAll(`.error-message`);

    if (messages) {
      messages.forEach((message) => message.remove());
    }
  }
}
