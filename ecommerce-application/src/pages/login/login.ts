import './_login.scss';
import type { IParameters } from '../../shared/models/interfaces';
import { CreateElement } from '../../shared/utils/create-element';
import { View } from '../view';
import { CreateButton } from '../../components/button/create-button';
import { CreateInput } from '../../components/input/create-input';
import { eyeCallback, emailValidation, passwordValidation, formValidation } from './utils';

export class LoginPage extends View {
  private wrapper: CreateElement;
  constructor(parameters: Partial<IParameters> = {}) {
    super({ tag: 'div', classNames: ['login-page'], ...parameters });
    this.wrapper = LoginPage.createWrapper();
    this.createLoginPageContent();
  }

  private static createWrapper(): CreateElement {
    return new CreateElement({
      tag: 'section',
      classNames: ['login'],
      textContent: '',
      callback: (): void => {},
    });
  }

  private createHeader(): void {
    const header = new CreateElement({
      tag: 'header',
      classNames: ['login__header'],
      textContent: '',
      callback: (): void => {},
    });

    const links = ['Login', 'Register'];

    links.forEach((item) => {
      const link = new CreateElement({
        tag: 'a',
        classNames: ['header__menu-link'],
        textContent: item,
        callback: (event: Event): void => {
          event.preventDefault();
          window.location.href = `/${item.toLowerCase()}`;
        },
      });

      header.addInnerElement(link);
    });

    this.wrapper.addInnerElement(header);
  }

  private createForm(): void {
    const form: CreateElement = new CreateElement({
      tag: 'form',
      classNames: ['login__form'],
      textContent: '',
      callback: (): void => {},
    });

    const message: CreateElement = new CreateElement({
      tag: 'h2',
      classNames: ['login__message'],
      textContent: 'Enter your username and password to login',
      callback: (): void => {},
    });

    form.addInnerElement(message);

    const inputsType = ['email', 'password'];

    let inputEmail: HTMLElement;
    let inputPassword: HTMLElement;

    inputsType.forEach((item) => {
      const inputContainer: CreateElement = new CreateElement({
        tag: 'div',
        classNames: [`form__inputbox--${item}`],
        textContent: '',
        callback: (): void => {},
      });

      const input = new CreateInput({
        classNames: [`input-${item}`],
        textContent: '',
        callback: (): void => {},
        type: item,
      });

      if (item === 'email') {
        inputEmail = input.getElement();
        inputEmail.addEventListener('keyup', () => {
          const inputElement = input.getElement();

          if (inputElement instanceof HTMLInputElement) {
            emailValidation(inputElement);
          }
        });
      } else {
        inputPassword = input.getElement();
        inputPassword.addEventListener('keyup', () => {
          const inputElement = input.getElement();

          if (inputElement instanceof HTMLInputElement) {
            passwordValidation(inputElement);
          }
        });
      }

      inputContainer.addInnerElement(input);

      if (item === 'password') {
        const eye: CreateElement = new CreateElement({
          tag: 'div',
          classNames: ['eye', 'eye-close'],
          textContent: '',
          callback: eyeCallback,
        });

        inputContainer.addInnerElement(eye);
      }

      form.addInnerElement(inputContainer);
    });

    const loginButton: CreateButton = new CreateButton({
      classNames: ['form__button'],
      textContent: 'login',
      type: 'button',
      disabled: false,
      callback: (): void => {
        if (inputEmail instanceof HTMLInputElement && inputPassword instanceof HTMLInputElement) {
          formValidation(inputEmail, inputPassword).catch(console.error);
        }
      },
    });

    form.addInnerElement(loginButton);

    this.wrapper.addInnerElement(form);
  }

  private createLoginPageContent(): void {
    this.createHeader();

    this.createForm();

    this.viewElementCreator.addInnerElement(this.wrapper.getElement());
  }
}
