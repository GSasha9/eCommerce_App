import './_login.scss';
import type { IParameters } from '../../shared/models/interfaces';
import { CreateElement } from '../../shared/utils/create-element';
import { View } from '../view';
import { CreateButton } from '../../components/button/create-button';
import { CreateInput } from '../../components/input/create-input';

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
        callback: (event: MouseEvent): void => {
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

    const inputsType = ['username', 'password'];

    inputsType.forEach((item) => {
      const input = new CreateInput({
        tag: 'input',
        classNames: [`form__input-${item}`],
        textContent: '',
        callback: (): void => {},
      });

      if (item === 'password') input.getElement().setAttribute('type', 'password');

      form.addInnerElement(input);
    });

    const loginButton: CreateButton = new CreateButton({
      tag: 'button',
      classNames: ['form__button'],
      textContent: 'login',
      type: 'button',
      disabled: false,
      callback: (): void => {},
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
