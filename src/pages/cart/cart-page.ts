import type { LineItem } from '@commercetools/platform-sdk';

import type CartModel from '../../model/cart/cart-model';
import { genElement } from '../../shared/utils/gen-element';

import './style.scss';

class CartPage {
  private static instance: CartPage;
  public model: CartModel;
  public cart: HTMLElement;
  public coupon: HTMLElement;
  public wrapperContent: HTMLElement;

  private constructor(model: CartModel) {
    this.model = model;
    this.wrapperContent = genElement('div', { className: 'wrapper-content-cart wrapper' });
    this.cart = genElement('div', { className: 'cart' });
    this.coupon = genElement('div', { className: 'coupon' });
  }

  private renderLineItems(): void {
    const clearAllButton = genElement('button', { className: 'cart-button button-remove-all', name: 'removeAll' }, [
      'removeAll',
    ]);
    const lineItems = genElement('ul', { className: 'line-items' }, this.model.cart?.lineItems?.map(genLineItem));

    this.cart.innerHTML = '';
    this.cart.append(clearAllButton, lineItems);
  }

  private renderCoupon(): void {
    const couponElement = genElement('div', { className: 'wrapper-coupon' }, [
      genElement('div', { className: 'wrapper-input' }, [
        genElement('input', { className: 'input-coupon', name: 'coupon' }),
        genElement('button', { className: 'cart-button', name: 'applyCoupon' }, ['Apply']),
      ]),
      genElement('div', { className: 'wrapper-prices' }, [
        genElement('div', {}, [
          genElement('span', {}, ['SubTotal: ']),
          genElement('span', {}, [
            String(this.model.cart?.lineItems.reduce((acc, cur) => acc + cur.price.value.centAmount * cur.quantity, 0)),
          ]),
        ]),
        genElement(
          'div',
          {},
          this.model.cart?.discountCodes.map((code) =>
            genElement('span', {}, [
              code.discountCode.id,
              genElement('button', { name: 'removeCode', dataset: { codeId: code.discountCode.id } }, ['X']),
            ]),
          ),
        ),
        genElement('div', { className: 'wrapper-total-price' }, [
          genElement('span', {}, ['TotalPrice: ']),
          genElement('span', {}, [String(this.model.cart?.totalPrice.centAmount)]),
        ]),
      ]),
    ]);

    this.coupon.innerHTML = '';
    this.coupon.append(couponElement);
  }

  public renderPage(): HTMLElement {
    this.wrapperContent.innerHTML = '';
    this.wrapperContent.append(this.cart, this.coupon);
    this.renderLineItems();
    this.renderCoupon();

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
    genElement('div', { className: 'line-item-attr' }, [
      genElement('div', { className: 'line-item-name' }, [item.name.en]),
      genElement(
        'div',
        {},
        // item.variant.attributes?.map((attr) => genElement('div', {}, [attr.value?.label ? attr.value?.label : ''])),
      ),
    ]),
    genElement('div', { className: 'wrapper-price' }, [
      genElement('div', {}, [...(item.price.discounted ? String(item.price.discounted?.value.centAmount) : '')]),
      genElement('div', { className: `${item.price.discounted ? 'discount-cart' : ''}` }, [
        String(item.price.value.centAmount),
      ]),
    ]),
    genElement('div', { className: 'wrapper-quantity' }, [
      genElement(
        'button',
        {
          className: 'cart-button button-quantity',
          name: 'minus',
          dataset: { lineItemId: item.id, quantity: String(item.quantity) },
        },
        ['-'],
      ),
      genElement('div', {}, [String(item.quantity)]),
      genElement(
        'button',
        {
          className: 'cart-button button-quantity',
          name: 'plus',
          dataset: { lineItemId: item.id, quantity: String(item.quantity) },
        },
        ['+'],
      ),
    ]),
    genElement('button', { className: 'cart-button', name: 'remove', dataset: { lineItemId: item.id } }, ['remove']),
  ]);
};

export default CartPage;
