import { authService } from '../../commerce-tools/auth-service.ts';
import CartModel from '../../model/cart/cart-model';
import CartPage from '../../pages/cart/cart-page';
import { Layout } from '../../pages/layout/layout';
import { isHTMLButtonElement, isHTMLElement } from '../../shared/models/typeguards.ts';

export class CartController {
  private readonly page: CartPage;
  private readonly model: CartModel;

  constructor() {
    this.model = CartModel.getInstance();
    this.page = CartPage.getInstance(this.model);
    this.initListeners();
  }

  public initListeners(): void {
    this.page.wrapperContent.addEventListener('click', (e) => void this.onClick(e));
  }

  public onClick = async (event: Event): Promise<void> => {
    const target = event.target;

    if (!isHTMLElement(target)) return;

    if (isHTMLButtonElement(target) && target.name === 'minus') {
      const { lineItemId, quantity } = target.dataset;

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
      }
    }

    if (isHTMLButtonElement(target) && target.name === 'plus') {
      const { lineItemId, quantity } = target.dataset;

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

    if (isHTMLButtonElement(target) && target.name === 'remove') {
      const { lineItemId } = target.dataset;

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
      }
    }

    if (isHTMLButtonElement(target) && target.name === 'removeAll') {
      if (this.model.cart?.id) {
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
      }
    }
  };

  public async render(): Promise<void> {
    const layout = Layout.getInstance();
    // const msg = document.createElement('h1');

    // msg.textContent = 'Loading..Please wait!';
    // msg.className = 'header__logo';
    // layout.setMainContent(msg);

    // this.model.clearQueryResults();
    // this.model.getProductKeyByUrl();
    await this.model.getCartInformation();
    layout.setMainContent(this.page.renderPage());
  }
}
