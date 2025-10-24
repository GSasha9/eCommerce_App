import { authService } from '../../commerce-tools/auth-service.ts';
import { CartService } from '../../commerce-tools/cart/cart-service.ts';
import { ModalConfirm } from '../../components/modals/modal-confirm.ts';
import CartModel from '../../model/cart/cart-model';
import CartPage from '../../pages/cart/cart-page';
import { Layout } from '../../pages/layout/layout';
import { isHTMLButtonElement, isHTMLElement, isHTMLInputElement } from '../../shared/models/typeguards.ts';
import { updateCountItemsCart } from '../../shared/utils/update-countItems-cart.ts';

export class CartController {
  public readonly page: CartPage;
  public readonly model: CartModel;

  constructor() {
    this.model = CartModel.getInstance();
    this.page = CartPage.getInstance(this.model);
    this.initListeners();
  }

  public initListeners(): void {
    this.page.wrapperContent.addEventListener('click', (e) => void this.onClick(e));
  }

  public onClick = (event: Event): void => {
    const target = event.target;

    if (!isHTMLElement(target)) return;

    if (isHTMLButtonElement(target) && target.name === 'minus') {
      const { lineItemId, quantity } = target.dataset;

      if (lineItemId && quantity) {
        void this.decreaseQuantityProduct(lineItemId, quantity);
      }
    }

    if (isHTMLButtonElement(target) && target.name === 'plus') {
      const { lineItemId, quantity } = target.dataset;

      if (lineItemId && quantity) {
        void this.increaseQuantityProduct(lineItemId, quantity);
      }
    }

    if (isHTMLButtonElement(target) && target.name === 'remove') {
      const { lineItemId } = target.dataset;

      if (lineItemId) {
        void this.removeProductFromCart(lineItemId);
      }
    }

    if (isHTMLButtonElement(target) && target.name === 'remove-all') {
      void this.removeAll();
    }

    if (isHTMLButtonElement(target) && target.name === 'apply-coupon') {
      const couponInput = this.page.coupon.querySelector('input[name="coupon"]');

      if (couponInput) {
        void this.applyCoupon(couponInput);
      }
    }

    if (isHTMLButtonElement(target) && target.name === 'remove-code') {
      const { codeId } = target.dataset;

      if (codeId) {
        void this.removeCode(codeId);
      }
    }

    if (isHTMLButtonElement(target) && target.name === 'coupon-error-button') {
      const message = document.querySelector('.coupon-error-wrapper');

      message?.remove();
    }
  };

  public async decreaseQuantityProduct(lineItemId: string, quantity: string): Promise<void> {
    if (this.model.cart?.id) {
      const updatedCart = await authService.api
        .carts()
        .withId({ ID: this.model.cart.id })
        .post({
          body: {
            version: this.model.cart.version,
            actions: [
              {
                action: 'changeLineItemQuantity',
                lineItemId: lineItemId,
                quantity: (Number(quantity) || 1) - 1,
              },
            ],
          },
        })
        .execute();

      this.model.cart = updatedCart.body;
      this.page.renderPage();
      void updateCountItemsCart();
      this.checkForEmptyBasket();
    }
  }

  public async increaseQuantityProduct(lineItemId: string, quantity: string): Promise<void> {
    if (this.model.cart?.id) {
      const updatedCart = await authService.api
        .carts()
        .withId({ ID: this.model.cart.id })
        .post({
          body: {
            version: this.model.cart.version,
            actions: [
              {
                action: 'changeLineItemQuantity',
                lineItemId: lineItemId,
                quantity: (Number(quantity) || 1) + 1,
              },
            ],
          },
        })
        .execute();

      this.model.cart = updatedCart.body;
      this.page.renderPage();
    }
  }

  public async removeProductFromCart(lineItemId: string): Promise<void> {
    if (this.model.cart?.id) {
      const updatedCart = await authService.api
        .carts()
        .withId({ ID: this.model.cart.id })
        .post({
          body: {
            version: this.model.cart.version,
            actions: [
              {
                action: 'changeLineItemQuantity',
                lineItemId: lineItemId,
                quantity: 0,
              },
            ],
          },
        })
        .execute();

      this.model.cart = updatedCart.body;
      this.page.renderPage();
      this.checkForEmptyBasket();
      void updateCountItemsCart();
    }
  }

  public async removeAll(): Promise<void> {
    if (this.model.cart?.id) {
      const modal = new ModalConfirm();

      const confirmed = await modal.open();

      if (!confirmed) return;

      const updatedCart = await authService.api
        .carts()
        .withId({ ID: this.model.cart.id })
        .post({
          body: {
            version: this.model.cart.version,
            actions: this.model.cart.lineItems.map((lineItem) => ({
              action: 'changeLineItemQuantity',
              lineItemId: lineItem.id,
              quantity: 0,
            })),
          },
        })
        .execute();

      this.model.cart = updatedCart.body;
      this.page.renderPage();
      void updateCountItemsCart();
      this.checkForEmptyBasket();
    }
  }

  public async applyCoupon(couponInput: Element): Promise<void> {
    if (isHTMLInputElement(couponInput) && this.model.cart?.id) {
      try {
        const param = {
          ID: this.model.cart.id,
          version: this.model.cart.version,
          code: couponInput.value,
        };
        const updatedCart = await CartService.getDiscount(param);

        this.model.cart = updatedCart.body;
        this.page.renderPage();
      } catch (e) {
        console.warn('Discount code not found:', e);
        this.page.renderErrorMessage();
        couponInput.value = '';
      }
    }
  }

  public async removeCode(codeId: string): Promise<void> {
    if (codeId && this.model.cart?.id) {
      const updatedCart = await authService.api
        .carts()
        .withId({ ID: this.model.cart.id })
        .post({
          body: {
            version: this.model.cart.version,
            actions: [{ action: 'removeDiscountCode', discountCode: { id: codeId, typeId: 'discount-code' } }],
          },
        })
        .execute();

      this.model.cart = updatedCart.body;
      this.page.renderPage();
    }
  }

  public async render(): Promise<void> {
    const layout = Layout.getInstance();

    await this.model.getCartInformation();

    if (this.model.cart && this.model.cart.lineItems.length) {
      layout.setMainContent(this.page.renderPage());
    } else {
      layout.setMainContent(this.page.renderEmptyCart());
    }
  }

  public checkForEmptyBasket(): void {
    if (this.model.cart && this.model.cart.lineItems.length) {
      this.page.renderPage();
    } else {
      this.page.renderEmptyCart();
    }
  }
}
