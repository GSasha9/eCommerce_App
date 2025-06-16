import type { LineItem } from '@commercetools/platform-sdk';

import type CartModel from '../../model/cart/cart-model';
import { formatPrice } from '../../model/cart/cart-model';
import { route } from '../../router';
import { genElement } from '../../shared/utils/gen-element';

import './style.scss';

class CartPage {
  private static instance: CartPage;
  public model: CartModel;
  public cart: HTMLElement;
  public coupon: HTMLElement;
  public wrapperContent: HTMLElement;
  public errorWrapper: HTMLElement;
  public emptyCart: HTMLElement;

  private constructor(model: CartModel) {
    this.model = model;
    this.wrapperContent = genElement('div', { className: 'wrapper-content-cart wrapper' });
    this.cart = genElement('div', { className: 'cart' });
    this.coupon = genElement('div', { className: 'coupon' });
    this.errorWrapper = genElement('div', { className: 'coupon-error-wrapper' }, [
      genElement('div', { className: 'coupon-error-message' }, ['coupon with this name not found']),
      genElement('button', { className: 'coupon-error-button cross-button', name: 'coupon-error-button' }),
    ]);

    this.emptyCart = genElement('div', { className: 'empty-cart-wrapper' }, [
      genElement('div', { className: 'empty-cart-message' }, [
        'There are no products in the cart. You can continue shopping:',
      ]),
      genElement(
        'a',
        { className: 'link-empty-cart', name: 'link-empty-cart', onClick: () => route.navigate('/catalog') },
        ['continue shopping'],
      ),
    ]);
  }

  private genCoupon(): HTMLElement {
    const couponElement = genElement('div', { className: 'wrapper-coupon' }, [
      genElement('div', { className: 'wrapper-input' }, [
        genElement('input', { className: 'input-coupon', name: 'coupon' }),
        genElement('button', { className: 'quantity-button', name: 'apply-coupon' }, ['Apply']),
      ]),
      genElement('div', { className: 'wrapper-prices' }, [
        genElement('div', {}, [
          genElement('span', {}, ['Original price: ']),
          genElement('span', {}, [
            formatPrice(
              this.model.cart?.lineItems.reduce((acc, cur) => acc + cur.price.value.centAmount * cur.quantity, 0) || 0,
            ),
          ]),
        ]),
        genElement(
          'div',
          { className: 'applied-coupons' },
          this.model.cart?.discountCodes.map((code) =>
            genElement('span', { className: 'coupon-name' }, [
              ...(this.model.codes?.find((item) => item.id === code.discountCode.id)?.key || 'EMPTY_CODE'),
              genElement('button', {
                className: 'cross-button',
                name: 'remove-code',
                dataset: { codeId: code.discountCode.id },
              }),
            ]),
          ),
        ),
        genElement('div', { className: 'wrapper-total-price' }, [
          genElement('span', {}, ['Discounted price: ']),
          genElement('span', { className: 'total-price' }, [formatPrice(this.model.cart?.totalPrice.centAmount || 0)]),
        ]),
      ]),
    ]);

    return couponElement;
  }

  public static getInstance(model: CartModel): CartPage {
    if (!CartPage.instance) {
      CartPage.instance = new CartPage(model);
    }

    return CartPage.instance;
  }

  private renderLineItems(): void {
    const clearAllButton = genElement(
      'button',
      { className: 'quantity-button button-remove-all', name: 'remove-all' },
      ['remove-all'],
    );
    const lineItems = genElement('ul', { className: 'line-items' }, this.model.cart?.lineItems?.map(genLineItem));

    this.cart.innerHTML = '';
    this.cart.append(clearAllButton, lineItems);
  }

  private renderCoupon(): void {
    this.coupon.innerHTML = '';
    this.coupon.append(this.genCoupon());
  }

  public renderEmptyCart(): HTMLElement {
    this.wrapperContent.innerHTML = '';
    this.wrapperContent.append(this.emptyCart);

    return this.wrapperContent;
  }

  public renderPage(): HTMLElement {
    this.wrapperContent.innerHTML = '';
    this.wrapperContent.append(this.cart, this.coupon);
    this.renderLineItems();
    this.renderCoupon();

    return this.wrapperContent;
  }

  public renderErrorMessage(): HTMLElement {
    this.wrapperContent.append(this.errorWrapper);

    return this.wrapperContent;
  }
}

const genLineItem = (item: LineItem): HTMLElement => {
  return genElement('li', { className: 'line-item' }, [
    genElement('img', { src: item.variant.images?.[0]?.url, className: 'line-item-img' }),
    genElement('div', { className: 'line-item-attr' }, [
      genElement('div', { className: 'line-item-name' }, [item.name.en]),
      genElement('div', {}),
    ]),
    genElement('div', { className: 'wrapper-price' }, [
      genElement('div', {}, [...(item.price.discounted ? formatPrice(item.price.discounted?.value.centAmount) : '')]),
      genElement('div', { className: `${item.price.discounted ? 'discount-cart' : ''}` }, [
        formatPrice(item.price.value.centAmount),
      ]),
    ]),
    genElement('div', { className: 'button-basket-items' }, [
      genElement('div', { className: 'wrapper-quantity' }, [
        genElement(
          'button',
          {
            className: 'quantity-button button-quantity',
            name: 'minus',
            dataset: { lineItemId: item.id, quantity: String(item.quantity) },
          },
          ['-'],
        ),
        genElement('div', {}, [String(item.quantity)]),
        genElement(
          'button',
          {
            className: 'quantity-button button-quantity',
            name: 'plus',
            dataset: { lineItemId: item.id, quantity: String(item.quantity) },
          },
          ['+'],
        ),
      ]),
      genElement('button', { className: 'delete-cart-item', name: 'remove', dataset: { lineItemId: item.id } }),
    ]),
  ]);
};

export default CartPage;
