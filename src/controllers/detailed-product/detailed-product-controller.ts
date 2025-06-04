import { ImageModal } from '../../components/modals/image-modal/image-modal.ts';
import DetailedProductModel from '../../model/detailed-product/detailed-product-model.ts';
import DetailedProductPage from '../../pages/detailed-product/detailed-product-page.ts';
import { Layout } from '../../pages/layout/layout.ts';
import { isHTMLElement } from '../../shared/models/typeguards.ts/typeguards.ts';
import { initSlider } from '../../shared/utils/init-slider.ts';

export class DetailedProductController {
  private readonly page: DetailedProductPage;
  private readonly model: DetailedProductModel;

  constructor() {
    this.model = DetailedProductModel.getInstance();
    this.page = DetailedProductPage.getInstance(this.model);
    this.initListeners();
  }

  public initListeners(): void {
    this.page.wrapperContent.addEventListener('click', this.onClick);
  }

  public onClick = (event: Event): void => {
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
