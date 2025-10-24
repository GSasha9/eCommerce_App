import { beforeEach, describe, expect, it } from 'vitest';

import CartModel from '../model/cart/cart-model';
import CartPage from '../pages/cart/cart-page';

describe('CartPage', () => {
  let cartPage: CartPage;

  beforeEach(() => {
    const model = CartModel.getInstance();

    cartPage = CartPage.getInstance(model);
  });

  it('returns singleton', () => {
    const second = CartPage.getInstance(CartModel.getInstance());

    expect(cartPage).toBe(second);
  });

  it('renders an empty cart', () => {
    const result = cartPage.renderEmptyCart();

    expect(result.querySelector('.empty-cart-wrapper')).not.toBeNull();
    expect(result.textContent).toContain('There are no products in the cart');
  });

  it('renders the cart page', () => {
    const page = cartPage.renderPage();

    expect(page.querySelector('.cart')).not.toBeNull();
    expect(page.querySelector('.coupon')).not.toBeNull();
  });

  it('render erroneous coupon', () => {
    const error = cartPage.renderErrorMessage();

    expect(error.querySelector('.coupon-error-message')?.textContent).toContain('coupon with this name not found');
  });
});
