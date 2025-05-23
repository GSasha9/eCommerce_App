import { authService } from '../../commerce-tools/auth-service.ts';
import { CreateButton } from '../../components/button/create-button.ts';
import { route } from '../../router';
import { CreateElement } from '../../shared/utils/create-element.ts';

export class Header {
  private readonly headerElement: HTMLElement;

  constructor() {
    this.headerElement = Header.createHeader();
  }

  private static createHeader(): HTMLElement {
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
      callback: (evt): void => {
        evt.preventDefault();
        route.navigate('/home');
      },
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

      if (item === 'Home') {
        li.getElement().classList.add('header__menu-item-active');
      }

      const link: CreateElement = new CreateElement({
        tag: 'a',
        classNames: ['header__menu-link'],
        textContent: item,
        callback: (event): void => {
          event.preventDefault();
          route.navigate(`/${item.toLowerCase()}`);
        },
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

    const regButton: CreateElement = new CreateElement({
      tag: 'div',
      classNames: ['header__button', 'header__button--reg', 'root-button'],
      textContent: 'Register',
      callback: (event): void => {
        event.preventDefault();
        route.navigate('/registration');
      },
    });

    const isAuthenticated: boolean = !!localStorage.getItem('isLoggedPlants');

    const loginButton: CreateButton = new CreateButton({
      classNames: ['header__button', 'header__button--login', isAuthenticated ? 'logout' : 'login'],
      textContent: isAuthenticated ? 'Logout' : 'Login',
      type: 'button',
      disabled: false,
      callback: (event: Event): void => {
        event.preventDefault();

        if (isAuthenticated) {
          if (event.target instanceof HTMLButtonElement) {
            event.target.classList.remove('logout');
            event.target.classList.add('login');
            event.target.textContent = 'Login';
            authService.logOutCustomer();
            localStorage.clear();
            route.navigate('/login');
          }
        } else {
          route.navigate('/login');
        }
      },
    });

    authContainer.addInnerElement(regButton.getElement());
    authContainer.addInnerElement(loginButton.getElement());

    header.addInnerElement(logo.getElement());
    header.addInnerElement(navContainer.getElement());
    header.addInnerElement(authContainer.getElement());

    return header.getElement();
  }

  public getElement(): HTMLElement {
    return this.headerElement;
  }
}
