import type { ProductProjection } from '@commercetools/platform-sdk';

// import { CreateInput } from '../../components/input/create-input';
import { CatalogModel } from '../../model/catalog/catalog-model';
import { CatalogPage } from '../../pages/catalog/catalog';
import type { IParametersCard } from '../../pages/catalog/models/interfaces';
import { Layout } from '../../pages/layout/layout';
import { PRODUCTS_PER_PAGE } from '../../shared/constants';
import type { ProductPerPageResponse } from '../../shared/models/type';
import type { Filters } from './filters';
import { addSearchTextToFilters } from './utils/add-search-text-to-filters';
import { updateSortAndFilter } from './utils/update-sort-select';

export default class CatalogController {
  public readonly catalogPage: CatalogPage;
  public catalogModel: CatalogModel;
  public allProductsResponse: ProductPerPageResponse | undefined;
  public filters: Filters;
  public isFiltered: boolean;

  constructor() {
    this.catalogPage = CatalogPage.getInstance({}, this);
    this.catalogModel = CatalogModel.getInstance(this);
    this.filters = {};
    this.isFiltered = false;

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
        if (!this.catalogPage.filterPriceFrom || !this.catalogPage.filterPriceTo) return;

        let priceFrom = Number(this.catalogPage.filterPriceFrom.getValue()) || '*';

        const priceTo = Number(this.catalogPage.filterPriceTo.getValue()) || '*';

        if (priceFrom === '*' && priceTo === '*') {
          priceFrom = 0;
        }

        this.filters.range = {
          from: priceFrom,
          to: priceTo,
        };

        void this.showFilteredProducts();
      });
    });

    this.catalogPage.sortSelect.getElement().addEventListener('change', () => updateSortAndFilter(this));
    this.catalogPage.sortSelectArrow.getElement().addEventListener('change', () => updateSortAndFilter(this));

    this.catalogPage.searchInput.getElement().addEventListener('change', () => {
      addSearchTextToFilters(this);
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

        const name = li?.querySelector('.category__list_item-name')?.textContent;

        if (!name) return;

        const categoryIndex = this.catalogModel.categories.get(name);

        if (!categoryIndex) return;

        if (li && li.classList.contains('selected-category')) {
          li.classList.remove('selected-category');

          if (this.filters.categoriesId) {
            const index = this.filters.categoriesId.indexOf(categoryIndex);

            if (index !== -1) {
              this.filters.categoriesId.splice(index, 1);

              if (this.filters.categoriesId.length === 0) {
                delete this.filters.categoriesId;
              }
            }
          }
        } else {
          li?.classList.add('selected-category');

          if (!this.filters.categoriesId) {
            this.filters.categoriesId = [categoryIndex];
          } else {
            this.filters.categoriesId.push(categoryIndex);
          }
        }
      }

      void this.showFilteredProducts();
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

        if (!pageNumber.textContent) return;

        const page = Number(pageNumber.textContent);

        if (this.isFiltered) {
          this.renderPage(page, this.catalogModel.filteredProducts);
        } else {
          this.renderPage(page, this.catalogModel.allProducts);
        }
      }
    });
  }

  public addCategory(name: string, amount: number): void {
    this.catalogPage.addCategory(name, amount);
  }

  public async showAllProductCards(): Promise<void> {
    const response = await this.catalogModel.fetchAllProducts();

    if (!response) return;

    this.addPagination(response.totalPages);

    this.renderPage(1, response.products);
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

  public async showFilteredProducts(): Promise<void> {
    console.log(this.filters);

    if (Object.keys(this.filters).length === 0) {
      this.isFiltered = false;

      void this.showAllProductCards();

      return;
    }

    this.isFiltered = true;

    if (!this.filters.categoriesId) {
      this.filters.categoriesId = [];

      const categoryValues: string[] = Array.from(this.catalogModel.categories.values());

      if (categoryValues.length === 0) {
        console.warn('Categories are empty');
      } else {
        this.filters.categoriesId.push(...categoryValues);
      }
    }

    await this.catalogModel.applyFilters(this.filters);

    this.addPagination(this.catalogModel.filteredProducts.length);

    this.renderPage(1, this.catalogModel.filteredProducts);
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

    console.log(this.catalogModel);
  }
}
