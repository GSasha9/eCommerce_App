import { CreateElement } from '../../shared/utils/create-element.ts';
import type { IParameters } from '../../shared/models/interfaces';
import { View } from '../view.ts';
import { CreateButton } from '../../components/button/create-button.ts';

export class HomePage extends View {
  constructor(parameters: Partial<IParameters> = {}) {
    super({ tag: 'div', classNames: ['home-page'], ...parameters });
    this.createHeader();
  }

  private createHeader(): void {
    const header: CreateElement = new CreateElement({
      tag: 'header',
      classNames: ['header', 'wrapper'],
      textContent: '',
      callback: (): void => {},
    });

    const logo: CreateElement = new CreateElement({
      tag: 'div',
      classNames: ['header__logo'],
      textContent: 'Plants',
      callback: (): void => {},
    });

    const navContainer: CreateElement = new CreateElement({
      tag: 'div',
      classNames: ['header__nav'],
      textContent: '',
      callback: (): void => {},
    });

    const navList: CreateElement = new CreateElement({
      tag: 'ul',
      classNames: ['header__menu'],
      textContent: '',
      callback: (): void => {},
    });

    const menuItems: string[] = ['Home', 'Shop', 'Blog', 'About'];

    menuItems.forEach((item: string): void => {
      const li: CreateElement = new CreateElement({
        tag: 'li',
        classNames: ['header__menu-item'],
        textContent: '',
        callback: (): void => {},
      });

      const link: CreateElement = new CreateElement({
        tag: 'a',
        classNames: ['header__menu-link'],
        textContent: item,
        callback: (): void => {},
      });

      li.addInnerElement(link.getElement());
      navList.addInnerElement(li.getElement());
    });

    navContainer.addInnerElement(navList.getElement());

    const authContainer: CreateElement = new CreateElement({
      tag: 'div',
      classNames: ['header__auth'],
      textContent: '',
      callback: (): void => {},
    });

    const loginButton: CreateButton = new CreateButton({
      tag: 'button',
      classNames: ['header__button', 'header__button--login'],
      textContent: 'Login',
      type: 'button',
      disabled: false,
      callback: (): void => {},
    });

    const regButton: CreateButton = new CreateButton({
      tag: 'button',
      classNames: ['header__button', 'header__button--register'],
      textContent: 'Register',
      type: 'button',
      disabled: false,
      callback: (): void => {},
    });

    authContainer.addInnerElement(loginButton.getElement());
    authContainer.addInnerElement(regButton.getElement());

    header.addInnerElement(logo.getElement());
    header.addInnerElement(navContainer.getElement());
    header.addInnerElement(authContainer.getElement());

    this.viewElementCreator.addInnerElement(header.getElement());
  }
}
