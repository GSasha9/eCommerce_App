import { CreateButton } from '../../components/button/create-button.ts';
import { route } from '../../router/index.ts';
import type { IParameters } from '../../shared/models/interfaces';
import { CreateElement } from '../../shared/utils/create-element.ts';
import { View } from '../view.ts';

import './styles.scss';

export class HomePage extends View {
  constructor(parameters: Partial<IParameters> = {}) {
    super({ tag: 'div', classNames: ['home-page'], ...parameters });
    this.createHome();
  }

  public static isAuth(): boolean {
    const token = localStorage.getItem('ct_user_token');

    return !!token;
  }

  private createHome(): void {
    const header: CreateElement = new CreateElement({
      tag: 'div',
      classNames: ['wrapper', 'home__wrapper'],
      textContent: '',
      callback: (): void => {},
    });

    const title: CreateElement = new CreateElement({
      tag: 'h1',
      classNames: ['home-title'],
      textContent: 'Take a new friend to your home',
      callback: (): void => {},
    });

    const text = new CreateElement({
      tag: 'p',
      classNames: ['home-text'],
      textContent:
        'Get houseplants — they don’t talk back, and they miss you in their own leafy way. Bring one home, and you’ll always have someone quietly rooting for you. Just don’t forget to water it — silent treatment from a fern can be brutal.',
      callback: (): void => {},
    });

    const buttonsContainer = new CreateElement({
      tag: 'div',
      classNames: ['text-content__buttons-container'],
      textContent: '',
      callback: (): void => {},
    });

    const buttons = ['About Us', 'Buy a plant'];

    buttons.forEach((el) => {
      const item = new CreateButton({
        classNames: ['root-button', 'home-button'],
        textContent: el,
      });

      let action;

      if (el === 'Buy a plant') {
        item.setCssClasses(['green']);
        action = (): void => {
          route.navigate(`/catalog`);
        };
      } else {
        action = (): void => {
          route.navigate(`/about`);
        };
      }

      item.setCallback(action);

      buttonsContainer.addInnerElement(item);
    });

    const textContent = new CreateElement({
      tag: 'div',
      classNames: ['home-text-content'],
      textContent: '',
      callback: (): void => {},
      children: [title, text, buttonsContainer],
    });

    const homeImg = new CreateElement({
      tag: 'div',
      classNames: ['home-image'],
      textContent: '',
      callback: (): void => {},
    });

    const codesContainer = new CreateElement({
      tag: 'div',
      classNames: ['codes-container'],
      textContent: '',
      callback: (): void => {},
    });

    const codes = ['leto', 'birthday'];

    codes.forEach((el) => {
      const item = new CreateElement({
        tag: 'div',
        classNames: ['promocode', el, 'shine-effect'],
        textContent: `code ${el} - 10% off`,
        callback: (): void => {},
      });

      const itemWindow = new CreateElement({
        tag: 'div',
        classNames: ['promocode-window', `promocode-window-${el}`],
        textContent: ``,
        callback: (): void => {},
      });

      const itemWrapper = new CreateElement({
        tag: 'div',
        classNames: ['promocode-wrapper'],
        textContent: ``,
        callback: (): void => {},
        children: [item, itemWindow],
      });

      codesContainer.addInnerElement(itemWrapper);
    });

    const mainContent = new CreateElement({
      tag: 'div',
      classNames: ['home-main-content'],
      textContent: '',
      callback: (): void => {},
      children: [textContent, homeImg, codesContainer],
    });

    header.addInnerElement([mainContent]);
    this.viewElementCreator.addInnerElement(header.getElement());
  }
}
