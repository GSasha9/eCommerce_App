import { authService } from '../../commerce-tools/auth-service.ts';
import { CreateButton } from '../../components/button/create-button.ts';
import { route } from '../../router';
import { CreateElement } from '../../shared/utils/create-element.ts';

export class Header {
  private readonly headerElement: HTMLElement;
  private static instance: Header;

  constructor() {
    this.headerElement = Header.createHeader();
  }

  public static getInstance(): Header {
    if (!Header.instance) {
      Header.instance = new Header();
    }

    return Header.instance;
  }

  private static createHeader(): HTMLElement {
    const header: CreateElement = new CreateElement({
      tag: 'header',
      classNames: ['header'],
      textContent: '',
      callback: (): void => {},
    });
    const headerWrapper: CreateElement = new CreateElement({
      tag: 'div',
      classNames: ['header-wrapper', 'wrapper'],
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

    const menuItems: string[] = ['Home', 'Catalog', 'About'];

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

        if (regButton.getElement().classList.contains('header__button--cabinet')) {
          route.navigate('/account');
        } else {
          route.navigate('/registration');
        }
      },
    });

    const isAuthenticated: boolean = !!localStorage.getItem('ct_user_token');

    const loginButton: CreateButton = new CreateButton({
      classNames: ['header__button', 'header__button--login', isAuthenticated ? 'logout' : 'login'],
      textContent: isAuthenticated ? 'Logout' : 'Login',
      //type: 'button',
      disabled: false,
      callback: (event: Event): void => {
        event.preventDefault();

        if (isAuthenticated) {
          if (event.target instanceof HTMLButtonElement) {
            event.target.classList.remove('logout');
            event.target.classList.add('login');
            event.target.textContent = 'Login';
            authService.logOutCustomer();
            //localStorage.removeItem('ct_user_token');
            this.switchBtn();
            route.navigate('/login');
          }
        } else {
          this.switchBtn();
          route.navigate('/login');
        }
      },
    });

    authContainer.addInnerElement(regButton.getElement());
    authContainer.addInnerElement(loginButton.getElement());

    header.addInnerElement(headerWrapper.getElement());
    headerWrapper.addInnerElement(logo.getElement());
    headerWrapper.addInnerElement(navContainer.getElement());
    headerWrapper.addInnerElement(authContainer.getElement());

    return header.getElement();
  }

  public static switchBtn(): void {
    const headerReg = document.querySelector('.header__button');

    if (!headerReg) return;

    const isLoggedIn = !!localStorage.getItem('ct_user_token');

    if (isLoggedIn) {
      headerReg.textContent = 'Account';
      headerReg.classList.add('header__button--cabinet');
      headerReg.classList.remove('header__button--reg');
    } else {
      headerReg.textContent = 'Register';
      headerReg.classList.remove('header__button--cabinet');
      headerReg.classList.add('header__button--reg');
    }
  }

  public getElement(): HTMLElement {
    return this.headerElement;
  }
}
