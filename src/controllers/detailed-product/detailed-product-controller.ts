import { authService } from '../../commerce-tools/auth-service.ts';
import { ImageModal } from '../../components/modals/image-modal/image-modal.ts';
import DetailedProductModel from '../../model/detailed-product/detailed-product-model.ts';
import DetailedProductPage, {
  renderAddProductMessage,
  renderRemoveProductMessage,
} from '../../pages/detailed-product/detailed-product-page.ts';
import { Layout } from '../../pages/layout/layout.ts';
import { isHTMLButtonElement, isHTMLElement } from '../../shared/models/typeguards.ts/typeguards.ts';
import { initSlider } from '../../shared/utils/init-slider.ts';
import { updateCountItemsCart } from '../../shared/utils/update-countItems-cart.ts';

export class DetailedProductController {
  private readonly page: DetailedProductPage;
  private readonly model: DetailedProductModel;

  constructor() {
    this.model = DetailedProductModel.getInstance();
    this.page = DetailedProductPage.getInstance(this.model);
    this.initListeners();
  }

  public initListeners(): void {
    this.page.wrapperContent.addEventListener('click', (e) => void this.onClick(e));
  }

  public onClick = async (event: Event): Promise<void> => {
    if (!isHTMLElement(event.target)) return;

    const value = event.target.id;

    if (value === 'modal-image detailed') {
      if (this.model.response && this.model.response.img && this.model.response.name) {
        const props = {
          images: this.model.response.img,
          width: 150,
          alt: this.model.response.name,
          name: 'big',
        };

        void new ImageModal(props).open();
      }
    }

    if (this.model.response && isHTMLButtonElement(event.target) && event.target.name === 'cart') {
      if (this.model.isInCart && this.model.lineItemId) {
        await authService.removeProductFromCart(this.model.lineItemId);
        this.model.isInCart = false;
        this.page.renderPage();
        void updateCountItemsCart();
        renderRemoveProductMessage();
      } else {
        const cartResponse = await authService.addProductToCart({ id: this.model.response.id });

        this.model.isInCart = true;
        this.model.lineItemId = cartResponse?.body.lineItems.find(
          (item) => this.model.response?.id === item.productId,
        )?.id;
        this.page.renderPage();
        void updateCountItemsCart();
        renderAddProductMessage();
      }
    }
  };

  public async render(): Promise<void> {
    const layout = Layout.getInstance();
    const msg = document.createElement('h1');

    msg.textContent = 'Loading..Please wait!';
    msg.className = 'header__logo';
    layout.setMainContent(msg);

    this.model.clearQueryResults();
    this.model.getProductKeyByUrl();
    await this.model.getDetailedInformation();
    layout.setMainContent(this.page.renderPage());

    if (this.model.response && this.model.response.img) {
      initSlider({ images: this.model.response.img, name: 'detailed' });
    }
  }
}
