import { CreateElement } from '../../shared/utils/create-element.ts';
import type { IParameters } from '../../shared/models/interfaces';
import { View } from '../view.ts';
import { CreateButton } from '../../components/button/create-button.ts';
import '../home/_home.scss';
import { HomePage } from '../home/home.ts';

export class ShopPage extends View {
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
      tag: 'h1',
      classNames: ['header__logo'],
      textContent: 'PLANTS',
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

    const menuItems: string[] = ['Home', 'Products', 'About'];

    menuItems.forEach((item: string): void => {
      const li: CreateElement = new CreateElement({
        tag: 'li',
        classNames: ['header__menu-item'],
        textContent: '',
        callback: (): void => {},
      });

      if (item === 'Products') {
        li.getElement().classList.add('header__menu-item-active');
      }

      const link: CreateElement = new CreateElement({
        tag: 'a',
        classNames: ['header__menu-link'],
        textContent: item,
        callback: (): void => {window.location.href = `/${item.toLowerCase()}`},
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

    const isAuthenticated: boolean = HomePage.isAuth();

    const loginButton: CreateButton = new CreateButton({
      classNames: ['header__button', 'header__button--login', isAuthenticated ? 'logout' : 'login'],
      textContent: isAuthenticated ? 'Logout' : 'Login',
      type: 'button',
      disabled: false,
      callback: (): void => {
        if (HomePage.isAuth()) {
          localStorage.removeItem('ct_user_token');
          window.location.href = '/login';
        } else {
          window.location.href = '/login';
        }
      },
    });

    authContainer.addInnerElement(loginButton.getElement());

    header.addInnerElement(logo.getElement());
    header.addInnerElement(navContainer.getElement());
    header.addInnerElement(authContainer.getElement());

    this.viewElementCreator.addInnerElement(header.getElement());
  }

}
