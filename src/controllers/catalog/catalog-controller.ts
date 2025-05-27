import { authService } from '../../commerce-tools/auth-service';
//import { CatalogModel } from '../../model/catalog/catalog-model';
import { CatalogPage } from '../../pages/catalog/catalog';
import type { IParametersCard } from '../../pages/catalog/models/interfaces';
import { Layout } from '../../pages/layout/layout';

export default class CatalogController {
  private readonly catalogPage: CatalogPage;
  //private catalogModel: CatalogModel;
  private likes: NodeListOf<Element> | [];

  constructor() {
    this.catalogPage = CatalogPage.getInstance({}, this);
    //this.catalogModel = CatalogModel.getInstance(this.catalogPage);
    void this.fetchAllProducts();

    this.likes = [];
  }

  public render(): void {
    const layout = Layout.getInstance();

    layout.setMainContent(this.catalogPage.getHtmlElement());
  }

  public initListeners(): void {
    this.likes.forEach((like) => {
      like.addEventListener('click', (event) => {
        this.onClickAddToFavourite(event);
      });
    });
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

          const parameters: IParametersCard = {
            name: el.name.en,
            description: description,
            img: img,
            price: `${el.masterVariant.prices?.[0].value.centAmount !== undefined ? el.masterVariant.prices?.[0].value.centAmount / 100 : 0}$`,
          };

          this.catalogPage.addCard(parameters);
        });

        this.likes = document.querySelectorAll('.card-like');

        this.initListeners();
      }
    } catch (error) {
      console.warn(error);
    }
  }

  public onClickAddToFavourite(event: Event): void {
    const like = event.target;

    if (like instanceof HTMLElement) {
      if (like.classList.contains('card-like-filled')) {
        like.classList.remove('card-like-filled');
      } else {
        like.classList.add('card-like-filled');
      }
    }

    console.log(this.likes);
  }
}
