import type { ProductProjection } from '@commercetools/platform-sdk';

// import { CreateInput } from '../../components/input/create-input';
import { CatalogModel } from '../../model/catalog/catalog-model';
import { CatalogPage } from '../../pages/catalog/catalog';
import type { IParametersCard } from '../../pages/catalog/models/interfaces';
import { Layout } from '../../pages/layout/layout';
import { PRODUCTS_PER_PAGE } from '../../shared/constants';
import type { ProductPerPageResponse } from '../../shared/models/type';

export default class CatalogController {
  private readonly catalogPage: CatalogPage;
  private catalogModel: CatalogModel;
  public filteredProductsMap: Map<string, ProductProjection[]>;
  public filteredProducts: ProductProjection[];
  public isFiltered: boolean;
  public allProductsResponse: ProductPerPageResponse | undefined;

  constructor() {
    this.catalogPage = CatalogPage.getInstance({}, this);
    this.catalogModel = CatalogModel.getInstance(this);

    this.isFiltered = false;
    this.filteredProductsMap = new Map();
    this.filteredProducts = [];
    this.allProductsResponse = undefined;

    void this.showAllProductCards();

    this.initListeners();
  }

  public render(): void {
    const layout = Layout.getInstance();

    layout.setMainContent(this.catalogPage.getHtmlElement());
  }

  public initListeners(): void {
    this.catalogPage.priceInputs.forEach((el) => {
      el.addEventListener('blur', () => {
        // this.applyPriceFilter();
      });
    });

    const productContainer = this.catalogPage.productsContainer.getElement();

    productContainer.addEventListener('click', (event) => {
      if (event.target instanceof HTMLElement && event.target.classList.contains('card-like')) {
        this.onClickAddToFavourite(event);
      }
    });

    this.catalogPage.categoryList.getElement().addEventListener('click', (event) => {
      const category = event.target;

      if (category && category instanceof HTMLElement) {
        const li = category.closest('li');

        if (li && li.classList.contains('selected-category')) {
          li.classList.remove('selected-category');
        } else {
          li?.classList.add('selected-category');
        }
      }

      this.showFilteredProducts(event);
    });

    const productContainerFooter = this.catalogPage.catalogFooter.getElement();

    productContainerFooter.addEventListener('click', (event) => {
      const pageNumbers = document.querySelectorAll('.footer__page-number');

      const pageNumber = event.target;

      if (
        pageNumber &&
        pageNumber instanceof HTMLElement &&
        (pageNumber.closest('p')?.classList.contains('footer__page-number') ||
          pageNumber.classList.contains('footer__page-number'))
      ) {
        pageNumbers.forEach((el) => {
          el.classList.remove('selected');
        });

        pageNumber.classList.add('selected');

        console.log(this.isFiltered);

        if (this.isFiltered) {
          this.filteredProducts = [];

          this.catalogModel.filteredProducts.forEach((key) => {
            this.filteredProducts = this.filteredProducts.concat(key);
          });

          console.log(this.filteredProducts);
          this.renderPage(Number(pageNumber.textContent), this.filteredProducts);
        } else {
          if (this.allProductsResponse) {
            this.renderPage(Number(pageNumber.textContent), this.allProductsResponse.products);
          }
        }
      }
    });
  }

  public addCategory(name: string, amount: number): void {
    this.catalogPage.addCategory(name, amount);
  }

  public async showAllProductCards(): Promise<void> {
    await this.catalogModel.fetchCategories();
    this.allProductsResponse = await this.catalogModel.fetchAllProducts();

    if (!this.allProductsResponse || this.catalogModel.allProducts.size === 0) return;

    this.addPagination(this.allProductsResponse.totalPages);

    this.renderPage(1, this.allProductsResponse.products);
  }

  public addPagination(productsAmount: number): void {
    this.catalogPage.clearPagination();
    const totalPages = Math.ceil(productsAmount / PRODUCTS_PER_PAGE);

    for (let i = 1; i <= totalPages; i++) {
      const page = this.catalogPage.addPage(i);

      if (i === 1) {
        page.setCssClasses(['selected']);
      }
    }
  }

  public showFilteredProducts(event: Event): void {
    this.catalogModel.applyCategoryFilters(event);

    if (this.catalogModel.filteredProducts.size === 0) {
      this.isFiltered = false;

      if (this.allProductsResponse?.total) {
        this.addPagination(this.allProductsResponse.total);
        this.renderPage(1, this.allProductsResponse.products);
      }

      return;
    }

    this.isFiltered = true;

    let totalProductsAmount = 0;

    this.filteredProducts = [];

    this.catalogModel.filteredProducts.forEach((key) => {
      totalProductsAmount += key.length;
      this.filteredProducts = this.filteredProducts.concat(key);
    });

    console.log(this.isFiltered);

    // this.applyPriceFilter();

    this.addPagination(totalProductsAmount);
    this.renderPage(1, this.filteredProducts);
  }

  public renderPage(pageNumber: number, products: ProductProjection[]): void {
    const start = (pageNumber - 1) * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;

    const cards = products.slice(start, end);

    this.catalogPage.clearCards();

    cards.forEach((el) => {
      const parameters: IParametersCard = {
        name: el.name.en,
        description: el.description?.['en'] ?? el.description?.['en-US'] ?? 'No description available',
        img: el.masterVariant.images?.[0]?.url ?? '',
        price: `${el.masterVariant.prices?.[0].value.centAmount !== undefined ? el.masterVariant.prices?.[0].value.centAmount / 100 : 0}$`,
        discount: `${el.masterVariant.prices?.[0].discounted?.value.centAmount !== undefined ? el.masterVariant.prices?.[0].discounted?.value.centAmount / 100 : ''}$`,
      };

      this.catalogPage.addCard(parameters);
    });
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

    console.log(this.catalogModel.allProducts);
  }

  // private applyPriceFilter(): void {

  //   if (!(this.catalogPage.filterPriceFrom instanceof CreateInput) || !(this.catalogPage.filterPriceTo instanceof CreateInput)) return;

  //   const priceFrom = Number(this.catalogPage.filterPriceFrom.getValue()) || 0;
  //   const priceTo = Number(this.catalogPage.filterPriceTo.getValue()) || 0;

  //   const getPrice = (el: ProductProjection): number => (el.masterVariant?.prices?.[0]?.value?.centAmount ?? 0) / 100;

  //   const baseProducts = this.isFiltered ? this.filteredProducts : this.catalogModel.allProducts;

  //   this.filteredProducts = baseProducts.filter((el) => {
  //     const price = getPrice(el);

  //     return price >= priceFrom && (priceTo === 0 || price <= priceTo);
  //   });

  //   if (priceFrom === 0 && priceTo === 0) {
  //     this.isFiltered = false;
  //     this.addPagination(this.catalogModel.allProducts.length);
  //     this.renderPage(1, this.catalogModel.allProducts);

  //     return;
  //   }

  //   this.isFiltered = true;
  //   this.addPagination(this.filteredProducts.length);
  //   this.renderPage(1, this.filteredProducts);
  // }
}
