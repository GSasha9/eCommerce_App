import { CreateButton } from '../../components/button/create-button.ts';
import { route } from '../../router/index.ts';
import type { IParameters } from '../../shared/models/interfaces';
import { CreateElement } from '../../shared/utils/create-element.ts';
import { View } from '../view.ts';

import './styles.scss';

export class HomePage extends View {
  public detailedProduct: CreateButton;
  public temporarily: string;

  constructor(parameters: Partial<IParameters> = {}) {
    super({ tag: 'div', classNames: ['home-page'], ...parameters });
    // temporarily ⬇
    this.detailedProduct = new CreateButton({ classNames: ['detailed-product'], textContent: 'detailed' });
    this.detailedProduct.getElement().addEventListener('click', this.openDetailedProduct);
    this.temporarily = '';
    // temporarily ⬆
    this.createHome();
  }

  // temporarily ⬇
  public openDetailedProduct = (): void => {
    // const key = 'orchid-product';
    // const key = 'lavender-product';
    // const key = 'lily-product';
    const key = 'orchid-product';

    this.temporarily = '';

    if (key) {
      route.navigate(`/detailed-product/${key}`);
    }
  };

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
      textContent: 'Home',
      callback: (): void => {},
    });

    header.addInnerElement([title, this.detailedProduct]);
    this.viewElementCreator.addInnerElement(header.getElement());
  }
}
