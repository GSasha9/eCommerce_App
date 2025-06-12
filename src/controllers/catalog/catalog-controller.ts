import type { ProductProjection } from '@commercetools/platform-sdk';

import { authService } from '../../commerce-tools/auth-service';
import { CatalogModel } from '../../model/catalog/catalog-model';
import { CatalogPage } from '../../pages/catalog/catalog';
import type { IParametersCard } from '../../pages/catalog/models/interfaces';
import { isAttrHeightValue } from '../../pages/catalog/models/utils/is-attr-height-value';
import { observer } from '../../pages/catalog/models/utils/observer';
import { Layout } from '../../pages/layout/layout';
import { PRODUCTS_PER_PAGE } from '../../shared/constants';
import type { ProductPerPageResponse } from '../../shared/models/type';
import type { Filters } from './models/interfaces/filters';
import { addSearchTextToFilters } from './utils/add-search-text-to-filters';
import { findKeyByValue } from './utils/find-key-by-value';
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

    this.initListeners();
  }

  public async render(): Promise<void> {
    const layout = Layout.getInstance();
    const msg = document.createElement('h1');

    msg.textContent = 'Loading..Please wait!';
    msg.className = 'header__logo';
    layout.setMainContent(msg);
    layout.setMainContent(msg);
    await this.showAllProductCards();
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

    this.catalogPage.searchInput.getElement().addEventListener('blur', () => {
      addSearchTextToFilters(this);
    });

    this.catalogPage.categoryList.getElement().addEventListener('click', (event) => {
      const target = event.target;

      if (!(target instanceof HTMLElement)) return;

      const li = target.closest('li');

      if (!li) return;

      const name = li.querySelector('.category__list_item-name')?.textContent;

      if (!name) return;

      const categoryIndex = this.catalogModel.categories.get(name);

      if (categoryIndex === undefined) return;

      const isSelected = li.classList.contains('selected-category');
      const saleFilterActive = Boolean(this.filters.discount);

      if (isSelected) {
        li.classList.remove('selected-category');
        this.catalogPage.removeBreadCrumb(name);

        if (this.filters.categoriesId) {
          const index = this.filters.categoriesId.indexOf(categoryIndex);

          if (index !== -1) this.filters.categoriesId.splice(index, 1);

          if (this.filters.categoriesId.length === 0) delete this.filters.categoriesId;
        }
      } else {
        if (saleFilterActive) {
          const allItems = this.catalogPage.categoryList
            .getElement()
            .querySelectorAll<HTMLElement>('.category__list-item');

          allItems.forEach((item) => {
            item.classList.remove('selected-category');
            const key = item.getAttribute('data-key');

            if (key) this.catalogPage.removeBreadCrumb(key);
          });

          li.classList.add('selected-category');

          const key = li.getAttribute('data-key');

          if (key) this.catalogPage.removeBreadCrumb(key);

          const crumbs = Array.from(this.catalogPage.breadCrumbPath.getElement().childNodes).map((node) =>
            (node.textContent || '').trim(),
          );

          if (!crumbs.includes('Plant')) {
            this.catalogPage.addBreadCrumb('Plant');
          }

          this.catalogPage.addBreadCrumb(name);

          this.filters.categoriesId = [categoryIndex];
        } else {
          li.classList.add('selected-category');

          const existingCrumbs = Array.from(this.catalogPage.breadCrumbPath.getElement().childNodes).map((node) =>
            (node.textContent || '').trim(),
          );

          if (!existingCrumbs.includes('Plant')) {
            this.catalogPage.addBreadCrumb('Plant');
          }

          if (!existingCrumbs.includes(name)) {
            this.catalogPage.addBreadCrumb(name);
          }

          if (!this.filters.categoriesId) {
            this.filters.categoriesId = [];
          }

          if (!this.filters.categoriesId.includes(categoryIndex)) {
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

  public addCategory(title: string): void {
    this.catalogPage.addCategory(title);
  }

  public addSubCategory(name: string, amount: number): void {
    this.catalogPage.addSubCategory(name, amount);
  }

  public async showAllProductCards(): Promise<void> {
    const response = await this.catalogModel.fetchAllProducts();

    if (!response) return;

    this.addPagination(response.totalPages);

    this.renderPage(1, response.products);

    const cartId = localStorage.getItem('plant-cart-id');

    if (cartId) {
      authService.cartId = cartId;

      await this.catalogPage.handleCardsButton();
    }
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
    const productsByCategory: Record<string, ProductProjection[]> = {};

    products.forEach((product) => {
      const categoryId = product.categories[0]?.id;

      const categoryName = findKeyByValue(this.catalogModel.categories, categoryId);

      if (!categoryName) return;

      if (!productsByCategory[categoryName]) {
        productsByCategory[categoryName] = [product];
      } else {
        productsByCategory[categoryName].push(product);
      }

      void this.catalogPage.handleCardsButton();
    });

    const categoryElements = this.catalogPage.categoryList.getElement().querySelectorAll('.category__list-item');

    categoryElements.forEach((el) => {
      const key = el.getAttribute('data-key');

      if (!key) return;

      const count = productsByCategory[key]?.length ?? 0;

      const amountEl = el.querySelector('.category__list_item-amount');

      if (amountEl) {
        amountEl.textContent = `(${String(count)})`;
      }
    });
    const start = (pageNumber - 1) * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;
    const cards = products.slice(start, end);

    this.catalogPage.clearCards();

    if (products.length === 0) {
      this.catalogPage.itemsNotFound();
    }

    cards.forEach((el) => {
      const attributeHeight = el.masterVariant.attributes?.find((el) => el.name === 'height');

      let attrValue: string = '';

      if (attributeHeight && isAttrHeightValue(attributeHeight)) {
        attrValue = attributeHeight.value.key;
      }

      const parameters: IParametersCard = {
        name: el.name.en,
        description: el.description?.['en'] ?? el.description?.['en-US'] ?? 'No description available',
        img: el.masterVariant.images?.[0]?.url ?? '',
        price: `${el.masterVariant.prices?.[0].value.centAmount !== undefined ? el.masterVariant.prices?.[0].value.centAmount / 100 : 0}$`,
        discount: `${el.masterVariant.prices?.[0].discounted?.value.centAmount !== undefined ? el.masterVariant.prices?.[0].discounted?.value.centAmount / 100 : ''}$`,
        key: el.key ?? '',
        id: el.id,
        variantId: el.masterVariant.id,
        attr: attrValue,
      };

      this.catalogPage.addCard(parameters);
    });

    this.catalogPage.imageWrappers.forEach((wrapper) => {
      observer.observe(wrapper);
    });
  }
}
