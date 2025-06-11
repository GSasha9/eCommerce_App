import type { LineItem } from '@commercetools/platform-sdk';

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
    this.page = genElement('div', { className: 'cart' }, ['xD']);
  }

  private renderLineItems(): void {
    const lineItems = genElement('ul', { className: 'line-items' }, this.model.lineItems?.map(genLineItem));

    this.page.innerHTML = '';
    this.page.append(lineItems);
  }

  public renderPage(): HTMLElement {
    this.wrapperContent.innerHTML = '';
    this.wrapperContent.append(this.page);
    this.renderLineItems();

    return this.wrapperContent;
  }

  public static getInstance(model: CartModel): CartPage {
    if (!CartPage.instance) {
      CartPage.instance = new CartPage(model);
    }

    return CartPage.instance;
  }
}

const genLineItem = (item: LineItem): HTMLElement => {
  return genElement('li', { className: 'line-item' }, [
    genElement('img', { src: item.variant.images?.[0]?.url, className: 'line-item-img' }),
    genElement('div', {}, [
      genElement('div', {}, [item.name.en]),
      genElement(
        'div',
        {},
        // item.variant.attributes?.map((attr) => genElement('div', {}, [attr.value?.label ? attr.value?.label : ''])),
      ),
    ]),
    genElement('div', {}, [String(item.price.value.centAmount)]),
    genElement('div', {}, [
      genElement(
        'button',
        {
          dataset: {
            count: 'plus',
            lineItemId: item.id,
          },
        },
        [' - '],
      ),
      genElement('div', {}, [String(item.quantity)]),
      genElement(
        'button',
        {
          dataset: {
            count: 'minus',
            lineItemId: item.id,
          },
        },
        [' + '],
      ),
    ]),
  ]);
};

export default CartPage;
