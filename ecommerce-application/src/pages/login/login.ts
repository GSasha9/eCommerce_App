import type { IParameters } from '../../shared/models/interfaces';
import { CreateElement } from '../../shared/utils/create-element.ts';
import { View } from '../view.ts';
import { CreateButton } from '../../components/button/create-button.ts';

export class LoginPage extends View {
  constructor(parameters: Partial<IParameters> = {}) {
    super({ tag: 'div', classNames: ['login-page'], ...parameters });
    this.createLoginPageContent();
  }

  private static createHeader(): CreateElement {
    const header = new CreateElement({
      tag: 'header',
      classNames: ['header'],
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

    return header;
  }

  private createLoginPageContent(): void {
    const container: CreateElement = new CreateElement({
      tag: 'section',
      classNames: ['login'],
      textContent: '',
      callback: (): void => {},
    });

    const message: CreateElement = new CreateElement({
      tag: 'h1',
      classNames: ['not-found__message'],
      textContent: 'This is login',
      callback: (): void => {},
    });

    const header = LoginPage.createHeader();

    const homeButton: CreateButton = new CreateButton({
      tag: 'button',
      classNames: ['not-found__button'],
      textContent: 'login',
      type: 'button',
      disabled: false,
      callback: (): void => {},
    });

    container.addInnerElement(header.getElement());
    container.addInnerElement(message.getElement());
    container.addInnerElement(homeButton.getElement());

    this.viewElementCreator.addInnerElement(container.getElement());
  }
}
