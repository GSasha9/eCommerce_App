import type CartModel from '../../model/cart/cart-model';
import { genElement } from '../../shared/utils/gen-element';

import './style.scss';

class CartPage {
  private static instance: CartPage;
  public model: CartModel;
  public page: HTMLElement;
  public wrapperContent: HTMLElement;

  private constructor(model: CartModel) {
    this.model = model;
    this.wrapperContent = genElement('div', { className: 'wrapper-content' });
    this.page = genElement('div', { className: 'cart' }, ['xd']);
  }

  public static getInstance(model: CartModel): CartPage {
    if (!CartPage.instance) {
      CartPage.instance = new CartPage(model);
    }

    return CartPage.instance;
  }

  public renderPage(): HTMLElement {
    console.log('render cart page');

    this.wrapperContent.innerHTML = '';
    this.wrapperContent.append(this.page);

    return this.page;
  }
}

export default CartPage;
