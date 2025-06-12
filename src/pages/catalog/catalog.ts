import { authService } from '../../commerce-tools/auth-service';
import { CreateButton } from '../../components/button/create-button';
import { CreateInput } from '../../components/input/create-input';
import type CatalogController from '../../controllers/catalog/catalog-controller';
import { updateSortAndFilter } from '../../controllers/catalog/utils/update-sort-select';
import { route } from '../../router';
import type { IParameters } from '../../shared/models/interfaces';
import { CreateElement } from '../../shared/utils/create-element';
import { View } from '../view';
import type { IParametersCard } from './models/interfaces';
import type { ProductParameters } from './models/interfaces/product-paameters';
import { resetCallback } from './models/utils/reset-callback';

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
  public sortSelectArrow: CreateElement;
  public sortSelect: CreateElement;
  public searchInput: CreateInput;
  public breadCrumbPath: CreateElement;
  public imageWrappers: HTMLElement[] = [];

  private constructor(parameters: Partial<IParameters> = {}, controller: CatalogController) {
    super({ tag: 'div', classNames: ['catalog-page'], ...parameters });
    this.catalogController = controller;
    this.categoryList = new CreateElement({
      tag: 'ul',
      classNames: ['category__list'],
      textContent: '',
      callback: (): void => {},
    });

    this.sortSelectArrow = new CreateElement({
      tag: 'select',
      classNames: ['catalog-header__select-arrow'],
      textContent: '',
      callback: (): void => updateSortAndFilter(this.catalogController),
    });

    this.sortSelect = new CreateElement({
      tag: 'select',
      classNames: ['catalog-header__select'],
      textContent: '',
      callback: (): void => updateSortAndFilter(this.catalogController),
    });

    this.breadCrumbPath = new CreateElement({
      tag: 'div',
      classNames: ['catalog-breadcrumb'],
      textContent: '',
      callback: (): void => {},
    });

    this.searchInput = new CreateInput({
      type: 'text',
      classNames: ['catalog-search-input'],
      placeholder: 'What do you like to find?',
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

  public addCategory(title: string): void {
    const li = new CreateElement({
      tag: 'li',
      classNames: ['category__list-item', 'main-category'],
      textContent: title,
      callback: (event: MouseEvent): void => {
        const element = event.target;

        if (!(element instanceof HTMLElement)) return;

        const li = element.closest('li');

        if (!(li instanceof HTMLLIElement)) return;

        this.itemsNotFound();
        this.breadCrumbPath.getElement().replaceChildren();

        resetCallback(this.catalogController);

        const nameOfSubCategories = this.catalogController.catalogModel.categories.keys();

        for (const el of nameOfSubCategories) {
          this.removeBreadCrumb(el);
        }

        void this.catalogController.showFilteredProducts();
      },
    });

    this.categoryList.addInnerElement(li);
  }

  public addSubCategory(name: string, amount: number): void {
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

    li.getElement().setAttribute('data-key', `${name}`);

    this.categoryList.addInnerElement(li);
  }

  public addBreadCrumb(string: string): void {
    const children = this.breadCrumbPath.getElement().childNodes;

    let className = 'catalog-breadcrumb-path';

    if (children.length !== 0) {
      const crumbs = this.breadCrumbPath.getElement().querySelectorAll('.catalog-breadcrumb-path');

      className = 'catalog-breadcrumb-path-plus';

      const categories = this.categoryList.getElement().querySelectorAll<HTMLElement>('.category__list-item');

      crumbs.forEach((el) => {
        if (el.textContent === string) {
          categories.forEach((cat) => {
            if (cat.getAttribute('data-key') === el.textContent) {
              cat.classList.remove('selected-category');
            }
          });
          this.removeBreadCrumb(el.textContent);
        }
      });
    }

    const link = new CreateElement({
      tag: 'p',
      textContent: string,
      classNames: [className],
      callback: (event: MouseEvent): void => {
        if (!(event.target instanceof HTMLParagraphElement)) return;

        const name = event.target.textContent;

        if (name === 'Plants' || name === 'Plant') {
          this.catalogController.filters.categoriesId = [];
          this.breadCrumbPath.getElement().replaceChildren();

          this.categoryList
            .getElement()
            .querySelectorAll('.selected-category')
            .forEach((el) => el.classList.remove('selected-category'));

          this.clearCards();
          this.itemsNotFound();

          resetCallback(this.catalogController);

          return;
        }

        const categories = this.categoryList.getElement().querySelectorAll<HTMLElement>('.category__list-item');
        const category = Array.from(categories).find((el) => el.getAttribute('data-key') === name);

        if (category) category.click();
      },
    });

    this.breadCrumbPath.addInnerElement(link);
  }

  public removeBreadCrumb(string: string): void {
    const children = this.breadCrumbPath.getElement().childNodes;

    if (children.length !== 0) {
      const crumbs = this.breadCrumbPath.getElement().querySelectorAll('.catalog-breadcrumb-path-plus');

      Array.from(crumbs).forEach((el) => {
        if (el.textContent === string) el.remove();
      });
    }
  }

  public itemsNotFound(): void {
    this.clearCards();
    const img = new CreateElement({
      tag: 'div',
      classNames: ['items-not-found'],
      textContent: '',
    });

    this.productsContainer.getElement().append(img.getElement());
  }

  public addCard(parameters: IParametersCard): void {
    const img = new CreateElement({
      tag: 'img',
      classNames: ['spinner'],
      textContent: '',
      callback: (): void => {},
    });

    const imgContainer = new CreateElement({
      tag: 'div',
      classNames: ['card-img-container'],
      textContent: '',
      callback: (): void => {},
      children: [img],
    });

    if (typeof parameters.img === 'string') imgContainer.getElement().setAttribute('data-src', parameters.img);

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

    const attr = new CreateElement({
      tag: 'div',
      classNames: [`card-attribute-height-${parameters.attr}`],
      textContent: '',
      callback: (): void => {},
    });

    const like = new CreateElement({
      tag: 'div',
      classNames: ['card-like'],
      textContent: '',
      callback: (event): void => {
        this.catalogController.onClickAddToFavourite(event);
      },
    });

    const button = new CreateButton({
      type: 'button',
      disabled: false,
      textContent: 'Add to cart',
      classNames: ['card-button'],
      callback: (event): void => {
        const button = event.target;

        if (!(button instanceof HTMLButtonElement)) return;

        const card = button.closest('.card');

        const productId = card?.getAttribute('data-id');

        const prodVariantId = card?.getAttribute('data-varId');

        if (!productId || !prodVariantId) return;

        const product: ProductParameters = {
          productId: productId,
          varId: Number(prodVariantId),
          quantity: 1,
        };

        button.setAttribute('disabled', 'true');

        void (async function (): Promise<void> {
          try {
            button.textContent = 'Processing...';
            await authService.addProductToCart(product);
            button.textContent = 'In cart';
          } catch (error) {
            console.warn(error);
          }
        })();
      },
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
      children: [prices, attr, buttonsContainer],
    });

    const card = new CreateElement({
      tag: 'div',
      classNames: ['card'],
      textContent: '',
      callback: (event: MouseEvent): void => {
        const card = event.target;

        if (!(card instanceof HTMLElement) || card.closest('.buttons-container')) return;

        const key = parameters.key;

        if (key) {
          route.navigate(`/detailed-product/${key}`);
        }
      },
      children: [imgContainer, title, description, cardsFooter],
    });

    card.getElement().setAttribute('data-id', parameters.id);
    card.getElement().setAttribute('data-varId', String(parameters.variantId));

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

    this.imageWrappers.push(imgContainer.getElement());
  }

  public async handleCardsButton(): Promise<void> {
    const cart = await authService.getCart();

    if (!cart) return;

    const products = cart.body.lineItems;

    if (!products || products.length === 0) return;

    const productsId = Array.from(products).map((el) => {
      return el.productId;
    });

    const allCards = Array.from(this.productsContainer.getElement().querySelectorAll<HTMLElement>('.card'));

    allCards.forEach((el) => {
      const id = el.getAttribute('data-id');

      if (!id) return;

      if (productsId.indexOf(id) !== -1) {
        const button = el.querySelector<HTMLButtonElement>('.card-button');

        if (!(button instanceof HTMLButtonElement)) return;

        button.textContent = 'In cart';

        button.setAttribute('disabled', 'true');
      }
    });
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
    const filters = new CreateElement({
      tag: 'div',
      classNames: ['filters'],
      textContent: '',
      callback: (): void => {
        const container = this.containerFilters.getElement();

        if (!container.classList.contains('open')) {
          container.classList.add('open');
          filters.getElement().classList.add('filters-open');
        } else {
          container.classList.remove('open');
          filters.getElement().classList.remove('filters-open');
        }
      },
    });

    this.viewElementCreator.addInnerElement(filters);

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
      tag: 'h4',
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

    const attrHeightTitle = new CreateElement({
      tag: 'h4',
      classNames: ['attribute-height-title'],
      textContent: 'Height',
      callback: (): void => {},
    });

    const attrHeightList = new CreateElement({
      tag: 'ul',
      classNames: ['attribute-height-list'],
      textContent: '',
      callback: (): void => {},
    });

    const attrHeight = ['low (under 30sm)', 'medium (30-70sm)', 'tall (above 70sm)'];

    attrHeight.forEach((item) => {
      const attr = new CreateElement({
        tag: 'li',
        classNames: ['attribute-height--list-item'],
        textContent: item,
        callback: (event: MouseEvent): void => {
          const li = event.target;

          if (li instanceof HTMLLIElement) {
            const key = li.getAttribute('data-name');

            if (!key) return;

            const isSelected = li.classList.contains('selected-category');

            const allAttr = li
              .closest('.attribute-height-list')
              ?.querySelectorAll<HTMLElement>('.attribute-height--list-item');

            allAttr?.forEach((el) => el.classList.remove('selected-category'));

            if (isSelected) {
              delete this.catalogController.filters.height;
            } else {
              li.classList.add('selected-category');
              this.catalogController.filters.height = [key];
            }

            void this.catalogController.showFilteredProducts();
          }
        },
        children: [attrHeightTitle],
      });

      attr.setDataAttrsClasses({ name: item.split(' ')[0] });

      attrHeightList.addInnerElement(attr);
    });

    const attributeContainer = new CreateElement({
      tag: 'div',
      classNames: ['attribute-height'],
      textContent: '',
      callback: (): void => {},
      children: [attrHeightTitle, attrHeightList],
    });

    const promotion = new CreateElement({
      tag: 'div',
      classNames: ['promotion'],
      textContent: '',
      callback: (): void => {},
    });

    const reset = new CreateButton({
      textContent: 'Reset filters',
      classNames: ['reset-filters'],
      callback: (): void => {
        resetCallback(this.catalogController);
      },
    });

    return new CreateElement({
      tag: 'div',
      classNames: ['container-filters'],
      textContent: '',
      callback: (): void => {},
      children: [categoryListContainer, priceFilter, attributeContainer, promotion, reset],
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

    const options = ['default', 'name', 'price'];

    options.forEach((el) => {
      const optionElement = document.createElement('option');

      optionElement.value = el === 'default' ? '' : el;
      optionElement.textContent = el;
      this.sortSelect.addInnerElement(optionElement);
    });

    const optionsArrow = ['asc', 'desc'];

    optionsArrow.forEach((el) => {
      const optionElement = document.createElement('option');

      optionElement.value = el;
      optionElement.textContent = el;
      this.sortSelectArrow.addInnerElement(optionElement);
    });

    const headerSortBy = new CreateElement({
      tag: 'div',
      classNames: ['catalog-header__sort'],
      textContent: '',
      callback: (): void => {},
      children: [headerSortLabel, this.sortSelect, this.sortSelectArrow],
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
      children: [catalogHeader, this.breadCrumbPath, this.searchInput, this.productsContainer, this.catalogFooter],
    });
  }
}
