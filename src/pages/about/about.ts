import type { IParameters } from '../../shared/models/interfaces';
import { CreateElement } from '../../shared/utils/create-element.ts';
import { View } from '../view.ts';

export class AboutPage extends View {
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
      tag: 'h3',
      classNames: ['header__logo'],
      textContent: 'About',
      callback: (): void => {},
    });

    header.addInnerElement(title.getElement());
    this.viewElementCreator.addInnerElement(header.getElement());
  }
}
