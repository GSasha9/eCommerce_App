import CartModel from '../../model/cart/cart-model';
import CartPage from '../../pages/cart/cart-page';
import { Layout } from '../../pages/layout/layout';

export class CartController {
  private readonly page: CartPage;
  private readonly model: CartModel;

  constructor() {
    this.model = CartModel.getInstance();
    this.page = CartPage.getInstance(this.model);
  }

  // public initListeners(): void {
  //   this.page.wrapperContent.addEventListener('click', this.onClick);
  // }

  // public onClick = (event: Event): void => {
  //   if (!isHTMLElement(event.target)) return;

  //   const value = event.target.id;

  //   if (value === 'modal-image detailed') {
  //     if (this.model.response && this.model.response.img && this.model.response.name) {
  //       const props = {
  //         images: this.model.response.img,
  //         width: 150,
  //         alt: this.model.response.name,
  //         name: 'big',
  //       };

  //       void new ImageModal(props).open();
  //     }
  //   }
  // };

  public async render(): Promise<void> {
    console.log('render в CartController');
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
