import { CreateButton } from '../../components/button/create-button';
import { CreateInput } from '../../components/input/create-input';
import type CatalogController from '../../controllers/catalog/catalog-controller';
import type { IParameters } from '../../shared/models/interfaces';
import { CreateElement } from '../../shared/utils/create-element';
import { View } from '../view';
import type { IParametersCard } from './models/interfaces';
import { updateSortAndFilter } from './models/utils/update-sort-select';

import './styles.scss';

export class CatalogPage extends View {
  private static instance: CatalogPage;
  private containerFilters: CreateElement;
  private containerProductsCatalog: CreateElement;
  public catalogController: CatalogController;
  public categoryList: CreateElement;
  public productsContainer: CreateElement;
  public catalogFooter: CreateElement;
  public priceInputs: HTMLElement[];
  public filterPriceFrom: CreateInput | null;
  public filterPriceTo: CreateInput | null;

  private constructor(parameters: Partial<IParameters> = {}, controller: CatalogController) {
    super({ tag: 'div', classNames: ['catalog-page'], ...parameters });
    this.catalogController = controller;
    this.categoryList = new CreateElement({
      tag: 'ul',
      classNames: ['category__list'],
      textContent: '',
      callback: (): void => {},
    });

    this.productsContainer = new CreateElement({
      tag: 'div',
      classNames: ['product-cards__container'],
      textContent: '',
      callback: (): void => {},
    });

    this.catalogFooter = new CreateElement({
      tag: 'div',
      classNames: ['catalog-footer'],
      textContent: '',
      callback: (): void => {},
    });

    this.priceInputs = [];

    this.filterPriceFrom = null;
    this.filterPriceTo = null;

    this.containerFilters = this.createContainerFilters();

    this.containerProductsCatalog = this.createcontainerProductsCatalog();

    this.viewElementCreator.addInnerElement(this.containerFilters);
    this.viewElementCreator.addInnerElement(this.containerProductsCatalog);
  }

  public static getInstance(parameters: Partial<IParameters> = {}, controller: CatalogController): CatalogPage {
    if (!CatalogPage.instance) {
      CatalogPage.instance = new CatalogPage(parameters, controller);
    }

    return CatalogPage.instance;
  }

  public addCategory(name: string, amount: number): void {
    const categoryName = new CreateElement({
      tag: 'p',
      classNames: ['category__list_item-name'],
      textContent: name,
      callback: (): void => {},
    });

    const amountOfProducts = new CreateElement({
      tag: 'p',
      classNames: ['category__list_item-amount'],
      textContent: `(${amount})`,
      callback: (): void => {},
    });

    const li = new CreateElement({
      tag: 'li',
      classNames: ['category__list-item'],
      textContent: '',
      callback: (): void => {},
      children: [categoryName, amountOfProducts],
    });

    this.categoryList.addInnerElement(li);
  }

  public addCard(parameters: IParametersCard): void {
    const img = new CreateElement({
      tag: 'div',
      classNames: ['card-img'],
      textContent: '',
      callback: (): void => {},
    });

    if (typeof parameters.img === 'string') img.getElement().style.backgroundImage = `url("${parameters.img}")`;

    const title = new CreateElement({
      tag: 'h4',
      classNames: ['card-name'],
      textContent: parameters.name,
      callback: (): void => {},
    });

    const description = new CreateElement({
      tag: 'p',
      classNames: ['card-description'],
      textContent: parameters.description,
      callback: (): void => {},
    });

    const price = new CreateElement({
      tag: 'p',
      classNames: ['card-price'],
      textContent: parameters.price,
      callback: (): void => {},
    });

    const prices = new CreateElement({
      tag: 'div',
      classNames: ['price-container'],
      textContent: '',
      callback: (): void => {},
      children: [price],
    });

    if (parameters.discount !== '$') {
      const discountPrice = new CreateElement({
        tag: 'p',
        classNames: ['card-discount-price'],
        textContent: parameters.discount,
        callback: (): void => {},
      });

      price.setCssClasses(['old-price']);

      if (price.getElement().classList.contains('card-price')) {
        price.getElement().classList.remove('card-price');
      }

      prices.addInnerElement(discountPrice);
    }

    const like = new CreateElement({
      tag: 'div',
      classNames: ['card-like'],
      textContent: '',
      callback: (): void => {},
    });

    const button = new CreateButton({
      type: 'button',
      disabled: false,
      textContent: 'Buy',
      classNames: ['card-button'],
    });

    const buttonsContainer = new CreateElement({
      tag: 'div',
      classNames: ['buttons-container'],
      textContent: '',
      callback: (): void => {},
      children: [like, button],
    });

    const cardsFooter = new CreateElement({
      tag: 'div',
      classNames: ['card-footer'],
      textContent: '',
      callback: (): void => {},
      children: [prices, buttonsContainer],
    });

    const card = new CreateElement({
      tag: 'div',
      classNames: ['card'],
      textContent: '',
      callback: (): void => {},
      children: [img, title, description, cardsFooter],
    });

    if (parameters.discount && parameters.discount !== '$') {
      const currentPrice = parseFloat(parameters.discount);
      const oldPrice = parseFloat(parameters.price);

      if (oldPrice > currentPrice) {
        const discountPercent = ((oldPrice - currentPrice) / oldPrice) * 100;

        const discountLabel = new CreateElement({
          tag: 'div',
          classNames: ['discount'],
          textContent: `${Math.round(discountPercent)}%`,
          callback: (): void => {},
        });

        card.addInnerElement(discountLabel);
      }
    }

    this.productsContainer.addInnerElement(card);
  }

  public addPage(number: number): CreateElement {
    const page = new CreateElement({
      tag: 'p',
      classNames: ['footer__page-number'],
      textContent: `${number}`,
      callback: (): void => {},
    });

    this.catalogFooter.addInnerElement(page);

    return page;
  }

  public clearCards(): void {
    this.productsContainer.getElement().replaceChildren();
  }

  public clearPagination(): void {
    this.catalogFooter.getElement().replaceChildren();
  }

  private createContainerFilters(): CreateElement {
    const title = new CreateElement({
      tag: 'h3',
      classNames: ['category__list-title'],
      textContent: 'Category',
      callback: (): void => {},
    });

    const categoryListContainer = new CreateElement({
      tag: 'div',
      classNames: ['category__list-container'],
      textContent: '',
      callback: (): void => {},
      children: [title, this.categoryList],
    });

    const priceTitle = new CreateElement({
      tag: 'h3',
      classNames: ['price-filter-title'],
      textContent: 'Price',
      callback: (): void => {},
    });

    const priceFilter = new CreateElement({
      tag: 'div',
      classNames: ['price-filter'],
      textContent: '',
      callback: (): void => {},
      children: [priceTitle],
    });

    const inputs = ['from', 'to'];

    inputs.forEach((el) => {
      const input = new CreateInput({
        type: 'text',
        placeholder: el,
        classNames: ['price-filter-input'],
      });

      if (el === 'from') {
        this.filterPriceFrom = input;
      } else {
        this.filterPriceTo = input;
      }

      this.priceInputs.push(input.getElement());

      priceFilter.addInnerElement(input);
    });

    const promotion = new CreateElement({
      tag: 'div',
      classNames: ['promotion'],
      textContent: 'promotion',
      callback: (): void => {},
    });

    const reset = new CreateButton({
      textContent: 'Reset filters',
      classNames: ['reset-filters'],
      callback: (): void => {
        this.catalogController.isFiltered = false;
        this.catalogController.filters = {};

        this.filterPriceFrom?.setValue('');

        this.filterPriceTo?.setValue('');
        document.querySelectorAll('.selected-category').forEach((el) => {
          el.classList.remove('selected-category');
        });

        document.querySelectorAll('.catalog-header__list-item').forEach((el) => {
          if (el.textContent !== 'All') {
            el.classList.remove('selected');
          } else {
            el.classList.add('selected');
          }
        });

        console.log(document.querySelectorAll('.catalog-header__select>option'));

        const select = document.querySelector('.catalog-header__select');

        if (select instanceof HTMLSelectElement) {
          select.value = 'default';
        }

        void this.catalogController.showAllProductCards();
      },
    });

    return new CreateElement({
      tag: 'div',
      classNames: ['container-filters'],
      textContent: '',
      callback: (): void => {},
      children: [categoryListContainer, priceFilter, promotion, reset],
    });
  }

  private createcontainerProductsCatalog(): CreateElement {
    const headerList = new CreateElement({
      tag: 'ul',
      classNames: ['catalog-header__list'],
      textContent: '',
      callback: (): void => {},
    });

    const headerListItems = ['All', 'Sale'];

    headerListItems.forEach((el) => {
      let item;

      if (el === 'All') {
        item = new CreateElement({
          tag: 'li',
          classNames: ['catalog-header__list-item', 'selected'],
          textContent: el,
          callback: (event: Event): void => {
            const item = event.target;

            if (!(item instanceof HTMLLIElement) || !item.textContent) return;

            delete this.catalogController.filters.discount;

            const allLi = document.querySelectorAll('.catalog-header__list-item');

            allLi.forEach((el) => {
              el.classList.remove('selected');
            });

            item.classList.add('selected');
            void this.catalogController.showFilteredProducts();
          },
        });
      } else {
        item = new CreateElement({
          tag: 'li',
          classNames: ['catalog-header__list-item'],
          textContent: el,
          callback: (event: Event): void => {
            const item = event.target;

            if (!(item instanceof HTMLLIElement) || !item.textContent) return;

            this.catalogController.isFiltered = true;

            const allLi = document.querySelectorAll('.catalog-header__list-item');

            allLi.forEach((el) => {
              el.classList.remove('selected');
            });

            item.classList.add('selected');
            this.catalogController.filters.discount = true;
            void this.catalogController.showFilteredProducts();
          },
        });
      }

      headerList.addInnerElement(item);
    });

    const headerSortLabel = new CreateElement({
      tag: 'label',
      classNames: ['catalog-header__sort-label'],
      textContent: 'Sort by:',
      callback: (): void => {},
    });

    headerSortLabel.getElement().setAttribute('for', 'catalog-header__sort-input');

    const sortSelect = new CreateElement({
      tag: 'select',
      classNames: ['catalog-header__select'],
      textContent: '',
      callback: (): void => updateSortAndFilter(this.catalogController),
    });

    const options = ['default', 'name', 'price'];

    options.forEach((el) => {
      const optionElement = document.createElement('option');

      optionElement.value = el === 'default' ? '' : el;
      optionElement.textContent = el;
      sortSelect.addInnerElement(optionElement);
    });

    const sortSelectArrow = new CreateElement({
      tag: 'select',
      classNames: ['catalog-header__select-arrow'],
      textContent: '',
      callback: (): void => updateSortAndFilter(this.catalogController),
    });

    const optionsArrow = ['asc', 'desc'];

    optionsArrow.forEach((el) => {
      const optionElement = document.createElement('option');

      optionElement.value = el;
      optionElement.textContent = el;
      sortSelectArrow.addInnerElement(optionElement);
    });

    const headerSortBy = new CreateElement({
      tag: 'div',
      classNames: ['catalog-header__sort'],
      textContent: '',
      callback: (): void => {},
      children: [headerSortLabel, sortSelect, sortSelectArrow],
    });

    const catalogHeader = new CreateElement({
      tag: 'div',
      classNames: ['catalog-header'],
      textContent: '',
      callback: (): void => {},
      children: [headerList, headerSortBy],
    });

    return new CreateElement({
      tag: 'div',
      classNames: ['container-products-catalog'],
      textContent: '',
      callback: (): void => {},
      children: [catalogHeader, this.productsContainer, this.catalogFooter],
    });
  }
}
