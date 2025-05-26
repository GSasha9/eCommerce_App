import DetailedProductModel from '../../model/detailed-product/detailed-product-model.ts';
import DetailedProductPage from '../../pages/detailed-product/detailed-product-page.ts';
import { Layout } from '../../pages/layout/layout.ts';

export class DetailedProductController {
  private readonly page: DetailedProductPage;
  private readonly model: DetailedProductModel;

  constructor() {
    this.model = DetailedProductModel.getInstance();
    this.page = DetailedProductPage.getInstance(this.model);
    // this.initListeners();
  }

  // public initListeners(): void {
  // }

  public async render(): Promise<void> {
    console.log('key', this.model.key);
    console.log('response', this.model.response);
    console.log('isSuccess', this.model.isSuccess);

    this.model.clearQueryResults();
    this.model.getProductKeyByUrl();
    await this.model.getDetailedInformation();
    const layout = Layout.getInstance();

    layout.setMainContent(this.page.renderPage());

    console.log('key2', this.model.key);
    console.log('response2', this.model.response);
    console.log('isSuccess2', this.model.isSuccess);
  }
}
