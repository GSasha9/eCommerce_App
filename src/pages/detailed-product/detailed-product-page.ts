import type DetailedProductModel from '../../model/detailed-product/detailed-product-model';
import { genElement } from '../../shared/utils/gen-element';
import { genSliderElement } from '../../shared/utils/gen-slider-element';

import './style.scss';

class DetailedProductPage {
  private static instance: DetailedProductPage;
  public model: DetailedProductModel;
  public page: HTMLElement;
  public error: HTMLElement;
  public wrapperContent: HTMLElement;

  private constructor(model: DetailedProductModel) {
    this.model = model;
    this.wrapperContent = genElement('div', { className: 'wrapper-content' });
    this.page = genElement('div', { className: 'detailed-product-page wrapper' }, [this.wrapperContent]);

    this.error = genElement('div', { className: 'error' }, ['Sorry, something went wrong.']);
  }

  public static getInstance(model: DetailedProductModel): DetailedProductPage {
    if (!DetailedProductPage.instance) {
      DetailedProductPage.instance = new DetailedProductPage(model);
    }

    return DetailedProductPage.instance;
  }

  public renderPage(): HTMLElement {
    this.wrapperContent.innerHTML = '';

    if (
      this.model.response &&
      this.model.key &&
      this.model.isSuccess &&
      this.model.response.img &&
      this.model.response.name
    ) {
      const sliderElement = genSliderElement({
        images: this.model.response.img,
        width: 150,
        alt: this.model.response.name,
        name: 'detailed',
      });

      this.wrapperContent.append(sliderElement, this.genDescription());

      return this.page;
    } else {
      this.wrapperContent.append(this.error);

      return this.page;
    }
  }

  private genPrice(): HTMLDivElement {
    const discount = this.model.response?.discounted;
    const price = genElement('div', { className: `detailed-price${discount ? ' discount-detailed' : ''}` }, [
      this.model.formatPrice(),
    ]);
    let discountedPrice;
    const wrapperPrice = genElement('div', { className: 'detailed-wrapper-price' }, [price]);

    if (discount) {
      discountedPrice = genElement('div', { className: 'detailed-discounted-price' }, [
        this.model.formatDiscountedPrice(),
      ]);
      wrapperPrice.prepend(discountedPrice);
    }

    return wrapperPrice;
  }

  private genDescription(): HTMLDivElement {
    const name = genElement('div', { className: 'name-detailed-product' }, [`${this.model.response?.name}`]);
    const price = this.genPrice();

    const description = genElement('div', { className: 'value' }, ['Description: ']);
    const descriptionValue = genElement('div', { className: 'description-value' }, [
      `${this.model.response?.description}`,
    ]);
    const wrapperDescription = genElement('div', { className: 'wrapper-item' }, [description, descriptionValue]);
    const wrapperInformation = genElement('div', { className: 'wrapper-information' }, [
      name,
      price,
      wrapperDescription,
    ]);

    return wrapperInformation;
  }

  // public genSlider(): HTMLDivElement {
  //   const images = this.model.response?.img ?? [];

  //   return genElement('div', { className: 'swiper' }, [
  //     genElement(
  //       'div',
  //       { className: 'swiper-wrapper' },
  //       images.map((img) => {
  //         return genElement('div', { className: 'swiper-slide' }, [
  //           genElement('img', {
  //             className: 'modal-image',
  //             id: 'modal-image',
  //             src: img,
  //             alt: `${this.model.response?.name}`,
  //             width: 200,
  //             height: 200,
  //           }),
  //         ]);
  //       }),
  //     ),
  //     genElement('div', { className: 'swiper-pagination' }),
  //     ...(images.length > 1
  //       ? [
  //           genElement('div', { className: 'swiper-button-next' }),
  //           genElement('div', { className: 'swiper-button-prev' }),
  //         ]
  //       : []),
  //   ]);
  // }
}

export default DetailedProductPage;
