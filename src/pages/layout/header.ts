import { authService } from '../../commerce-tools/auth-service.ts';
import { CreateButton } from '../../components/button/create-button.ts';
import { route } from '../../router';
import { CreateElement } from '../../shared/utils/create-element.ts';
import { genElement } from '../../shared/utils/gen-element.ts';

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
        callback: (event): void => {
          const item = event.target;

          if (!item || !(item instanceof HTMLElement)) return;

          const li = item.closest('li');

          if (!li) return;

          const link = li.querySelector('a');

          if (!link) return;

          link.dispatchEvent(new Event('click', { bubbles: false }));
        },
      });

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

    const isAuthenticated: boolean = !!localStorage.getItem('ct_user_credentials');

    console.log(isAuthenticated);

    const regButton: CreateElement = new CreateElement({
      tag: 'div',
      classNames: [
        'header__button',
        'header__button--acc',
        'root-button',
        isAuthenticated ? 'header__button--cabinet' : 'header__button--reg',
      ],
      textContent: isAuthenticated ? 'Account' : 'Register',
      callback: (event): void => {
        event.preventDefault();

        if (regButton.getElement().classList.contains('header__button--cabinet')) {
          route.navigate('/account');
        } else {
          route.navigate('/registration');
        }
      },
    });

    const loginButton: CreateButton = new CreateButton({
      classNames: ['header__button', 'header__button--login', isAuthenticated ? 'logout' : 'login'],
      textContent: isAuthenticated ? 'Logout' : 'Login',
      disabled: false,
      type: 'button',
      callback: (): void => {},
    });

    loginButton.getElement().addEventListener('click', (event): void => {
      event.preventDefault();

      const currentAuth = !!localStorage.getItem('ct_user_credentials');

      console.log(currentAuth);

      if (currentAuth) {
        if (event.target instanceof HTMLButtonElement) {
          event.target.classList.remove('logout');
          event.target.classList.add('login');
          event.target.textContent = 'Login';
          authService.logOutCustomer();
          //Header.switchBtn(false);
          route.navigate('/login');
        }
      } else {
        route.navigate('/login');
      }
    });

    const cartIconWrapper = genElement('div', { className: 'cart-icon-wrapper' }, [
      new CreateElement({
        tag: 'button',
        classNames: ['cart-logo'],
        callback: (): void => {
          route.navigate('/basket');
        },
      }).getElement(),
      genElement('div', { className: 'count-item-icon', id: 'cart-count-icon' }, ['']),
    ]);

    authContainer.addInnerElement(regButton.getElement());
    authContainer.addInnerElement(loginButton.getElement());

    header.addInnerElement(headerWrapper.getElement());
    headerWrapper.addInnerElement(logo.getElement());
    headerWrapper.addInnerElement(navContainer.getElement());
    headerWrapper.addInnerElement(cartIconWrapper);
    headerWrapper.addInnerElement(authContainer.getElement());

    return header.getElement();
  }

  public static switchBtn(callAccount?: boolean): void {
    const headerReg = document.querySelector('.header__button--acc');

    if (!headerReg) return;

    if (callAccount) {
      console.log('Switching to Account');
      headerReg.textContent = 'Account';
      headerReg.classList.add('header__button--cabinet');
      headerReg.classList.remove('header__button--reg');
    } else {
      console.log('Switching to Register');
      headerReg.textContent = 'Register';
      headerReg.classList.remove('header__button--cabinet');
      headerReg.classList.add('header__button--reg');
    }
  }

  public getElement(): HTMLElement {
    return this.headerElement;
  }
}
