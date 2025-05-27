import type { ProductProjection } from '@commercetools/platform-sdk';

import { authService } from '../../commerce-tools/auth-service';
//import { CatalogModel } from '../../model/catalog/catalog-model';
import { CatalogPage } from '../../pages/catalog/catalog';
import type { IParametersCard } from '../../pages/catalog/models/interfaces';
import { Layout } from '../../pages/layout/layout';
import { PRODUCTS_PER_PAGE } from '../../shared/constants';

export default class CatalogController {
  private readonly catalogPage: CatalogPage;
  //private catalogModel: CatalogModel;
  private likes: NodeListOf<Element> | [];
  public allProducts: ProductProjection[];

  constructor() {
    this.catalogPage = CatalogPage.getInstance({}, this);
    //this.catalogModel = CatalogModel.getInstance(this.catalogPage);
    this.allProducts = [];
    void this.fetchCategories();

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

  public async fetchCategories(): Promise<void> {
    try {
      const response = await authService.getPlantCategories();

      if (response) {
        for (const el of response) {
          const name = el.name?.['en'] ?? el.name?.['en-US'] ?? 'No description available';

          const products = await authService.fetchProductsByCategory(el.id);

          const amount = products?.length ?? 0;

          this.catalogPage.addCategory(name, amount);
        }
      }
    } catch (error) {
      console.warn(error);
    }
  }

  public async fetchAllProducts(): Promise<void> {
    try {
      const response = await authService.fetchProducts();

      if (!response) return;

      if (response) {
        this.allProducts = response.products;

        const totalPages = Math.ceil(response.totalPages / 12);

        for (let i = 1; i <= totalPages; i++) {
          const page = this.catalogPage.addPage(i);

          if (i === 1) {
            page.setCssClasses(['selected']);
          }

          page.getElement().addEventListener('click', (event) => {
            const pages = document.querySelectorAll('.footer__page-number');

            pages.forEach((page) => {
              if (page.classList.contains('selected')) {
                page.classList.remove('selected');
              }
            });

            if (event.target instanceof HTMLElement) {
              event.target.classList.add('selected');
            }

            this.renderPage(i);
          });
        }
        this.renderPage(1);
      }
    } catch (error) {
      console.warn(error);
    }
  }

  private renderPage(pageNumber: number): void {
    const start = (pageNumber - 1) * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;

    const products = this.allProducts.slice(start, end);

    this.catalogPage.clearCards();

    products.forEach((el) => {
      const parameters: IParametersCard = {
        name: el.name.en,
        description: el.description?.['en'] ?? el.description?.['en-US'] ?? 'No description available',
        img: el.masterVariant.images?.[0]?.url ?? '',
        price: `${el.masterVariant.prices?.[0].value.centAmount !== undefined ? el.masterVariant.prices?.[0].value.centAmount / 100 : 0}$`,
        discount: `${el.masterVariant.prices?.[0].discounted?.value.centAmount !== undefined ? el.masterVariant.prices?.[0].discounted?.value.centAmount / 100 : ''}$`,
      };

      this.catalogPage.addCard(parameters);
    });

    this.likes = document.querySelectorAll('.card-like');
    this.initListeners();
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
