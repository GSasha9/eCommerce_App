import { authService } from '../../commerce-tools/auth-service';
//import { CatalogModel } from '../../model/catalog/catalog-model';
import { CatalogPage } from '../../pages/catalog/catalog';
import type { IParametersCard } from '../../pages/catalog/models/interfaces';
import { Layout } from '../../pages/layout/layout';

export default class CatalogController {
  private readonly catalogPage: CatalogPage;
  //private catalogModel: CatalogModel;

  constructor() {
    this.catalogPage = CatalogPage.getInstance({}, this);
    //this.catalogModel = CatalogModel.getInstance(this.catalogPage);
    void this.fetchAllProducts();
  }

  public render(): void {
    const layout = Layout.getInstance();

    layout.setMainContent(this.catalogPage.getHtmlElement());
  }

  public async fetchAllProducts(): Promise<void> {
    try {
      const response = await authService.fetchProduct();

      if (response) {
        const results = response.body.results;

        results.forEach((el) => {
          const description =
            el.description?.['en'] ??
            el.description?.['en-US'] ??
            el.description?.['en-GB'] ??
            'No description available';

          const img = el.masterVariant.images?.[0]?.url ?? '';

          console.log(el);
          const parameters: IParametersCard = {
            name: el.name.en,
            description: description,
            img: img,
            price: `${el.masterVariant.prices?.[0].value.centAmount !== undefined ? el.masterVariant.prices?.[0].value.centAmount / 100 : 0}$`,
          };

          this.catalogPage.addCard(parameters);
        });
      }
    } catch (error) {
      console.warn(error);
    }
  }
}
