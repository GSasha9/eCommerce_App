import { authService } from '../../commerce-tools/auth-service.ts';
import { CreateButton } from '../../components/button/create-button.ts';
import { route } from '../../router';
import { CreateElement } from '../../shared/utils/create-element.ts';
import { genElement } from '../../shared/utils/gen-element.ts';

export class Header {
  private headerElement: HTMLElement;
  private static instance: Header;

  constructor() {
    this.headerElement = Header.createHeader();
    this.addResizeListener();
  }

  private addResizeListener(): void {
    let resizeTimeout: number | null = null;
    let lastViewportIsMobile = window.innerWidth < 600;

    window.addEventListener('resize', () => {
      if (resizeTimeout) window.clearTimeout(resizeTimeout);

      resizeTimeout = window.setTimeout(() => {
        const isMobileNow = window.innerWidth < 600;

        if (isMobileNow !== lastViewportIsMobile) {
          lastViewportIsMobile = isMobileNow;

          const oldHeader = this.headerElement;
          const newHeader = Header.createHeader();

          oldHeader.replaceWith(newHeader);
          this.headerElement = newHeader;
        }
      }, 200);
    });
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

    const burgerBtnContainer: CreateElement = new CreateElement({
      tag: 'div',
      classNames: ['burger-backet__container'],
      textContent: '',
      callback: (): void => {},
    });

    const burgerBtn: CreateElement = new CreateElement({
      tag: 'div',
      classNames: ['burger__btn'],
      textContent: 'Menu',
      callback: (el): void => {
        el.preventDefault();
        const dialogEl: HTMLElement = burgerContainer.getElement();

        if (dialogEl instanceof HTMLDialogElement) {
          if (dialogEl.hasAttribute('open')) {
            dialogEl.close();
          } else {
            dialogEl.showModal();
          }
        }
      },
    });

    const burgerContainer: CreateElement = new CreateElement({
      tag: 'dialog',
      classNames: ['burger__container', 'hidden'],
      textContent: '',
      callback: (): void => {},
    });

    const dialogInner: CreateElement = new CreateElement({
      tag: 'div',
      textContent: '',
      classNames: ['burger__content'],
    });

    const btnCloseBurger: CreateElement = new CreateElement({
      tag: 'div',
      textContent: '',
      classNames: ['burger__close-btn'],
    });

    const navList: CreateElement = new CreateElement({
      tag: 'ul',
      classNames: ['header__menu'],
      textContent: '',
      callback: (): void => {},
    });

    const menuItems: string[] = ['Home', 'Catalog', 'About'];
    const currentPath = window.location.pathname.toLowerCase();

    menuItems.forEach((item: string): void => {
      const itemPath = `/${item.toLowerCase()}`;
      const isActive = currentPath === itemPath;
      const li: CreateElement = new CreateElement({
        tag: 'li',
        classNames: ['header__menu-item', ...(isActive ? ['header__menu-item-active'] : [])],
        textContent: '',
        callback: (event): void => {
          const target = event.target;

          if (!(target instanceof HTMLElement)) return;

          const li = target.closest('li');

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

          document.querySelectorAll('.header__menu-item.header__menu-item-active').forEach((el) => {
            el.classList.remove('header__menu-item-active');
          });
          const target = event.target;

          if (target instanceof HTMLElement) {
            const li = target.closest('li');

            if (li) {
              li.classList.add('header__menu-item-active');
            }
          }

          route.navigate(itemPath);
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

    const authContainerBurger: CreateElement = new CreateElement({
      tag: 'div',
      classNames: ['header__auth-burger'],
      textContent: '',
      callback: (): void => {},
    });

    const isAuthenticated: boolean = !!localStorage.getItem('ct_user_credentials');

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

      if (currentAuth) {
        if (event.target instanceof HTMLButtonElement) {
          event.target.classList.remove('logout');
          event.target.classList.add('login');
          event.target.textContent = 'Login';
          void authService.logOutCustomer();
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

    burgerContainer.getElement().addEventListener('click', (event) => {
      const target = event.target;

      if (target instanceof HTMLElement) {
        if (
          target.classList.contains('burger__close-btn') ||
          target.classList.contains('burger__container') ||
          target.classList.contains('header__button') ||
          target.classList.contains('header__menu-link') ||
          target.classList.contains('header__menu-item')
        ) {
          const burgerContainerEl = burgerContainer.getElement();

          if (burgerContainerEl instanceof HTMLDialogElement) {
            burgerContainerEl.close();
          }
        }
      }
    });

    if (window.innerWidth >= 600) {
      authContainer.addInnerElement(regButton.getElement());
      authContainer.addInnerElement(loginButton.getElement());

      header.addInnerElement(headerWrapper.getElement());
      headerWrapper.addInnerElement(logo.getElement());
      headerWrapper.addInnerElement(navContainer.getElement());
      headerWrapper.addInnerElement(cartIconWrapper);
      headerWrapper.addInnerElement(authContainer.getElement());
    } else {
      header.addInnerElement(headerWrapper.getElement());
      headerWrapper.addInnerElement(logo.getElement());
      headerWrapper.addInnerElement(burgerBtnContainer.getElement());
      burgerBtnContainer.addInnerElement(cartIconWrapper);
      burgerBtnContainer.addInnerElement(burgerBtn.getElement());
      headerWrapper.addInnerElement(burgerContainer.getElement());
      dialogInner.addInnerElement(btnCloseBurger.getElement());
      dialogInner.addInnerElement(authContainerBurger.getElement());
      authContainerBurger.addInnerElement(regButton.getElement());
      authContainerBurger.addInnerElement(loginButton.getElement());
      dialogInner.addInnerElement(navList.getElement());
      navList.getElement().classList.add('header__menu-burger');
      burgerContainer.addInnerElement(dialogInner.getElement());
    }

    return header.getElement();
  }

  public static switchBtn(callAccount?: boolean): void {
    const headerReg = document.querySelector('.header__button--acc');

    if (!headerReg) return;

    if (callAccount) {
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
