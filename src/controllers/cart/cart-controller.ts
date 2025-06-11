import { authService } from '../../commerce-tools/auth-service.ts';
import CartModel from '../../model/cart/cart-model';
import CartPage from '../../pages/cart/cart-page';
import { Layout } from '../../pages/layout/layout';
import { isHTMLElement } from '../../shared/models/typeguards.ts';

export class CartController {
  private readonly page: CartPage;
  private readonly model: CartModel;

  constructor() {
    this.model = CartModel.getInstance();
    this.page = CartPage.getInstance(this.model);
    this.initListeners();
  }

  public initListeners(): void {
    this.page.wrapperContent.addEventListener('click', this.onClick);
  }

  public onClick = (event: Event): void => {
    if (!isHTMLElement(event.target)) return;

    if (event.target.dataset.count === 'minus') {
      const value = event.target.dataset.count;
      const lineItemId = event.target.dataset.lineItemId;

      if (this.model.cart?.id) {
        void authService.api
          .carts()
          .withId({ ID: this.model.cart.id })
          .post({
            body: {
              version: this.model.cart.version,
              actions: [
                {
                  action: 'changeLineItemQuantity',
                  lineItemId: lineItemId,
                  quantity: 3,
                },
              ],
            },
          })
          .execute()
          .then((res) => console.log(res));

        console.log(value);
      }
    }

    if (event.target.dataset.count === 'plus') {
      const value = event.target.dataset.count;

      console.log(value);
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
