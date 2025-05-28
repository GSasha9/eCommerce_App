import type DetailedProductModel from '../../model/detailed-product/detailed-product-model';
import { genElement } from '../../shared/utils/gen-element';

import './style.scss';

class DetailedProductPage {
  private static instance: DetailedProductPage;
  public model: DetailedProductModel;
  public content: HTMLElement;
  public error: HTMLElement;

  private constructor(model: DetailedProductModel) {
    this.model = model;
    this.content = genElement('div', { className: 'content' }, ['контент']);

    this.error = genElement('div', { className: 'error' }, ['Sorry, something went wrong.']);
  }

  public static getInstance(model: DetailedProductModel): DetailedProductPage {
    if (!DetailedProductPage.instance) {
      DetailedProductPage.instance = new DetailedProductPage(model);
    }

    return DetailedProductPage.instance;
  }

  public renderPage(): HTMLElement {
    this.content.innerHTML = '';

    if (this.model.key && this.model.isSuccess) {
      this.content.append(this.genSlider(), this.genDescription());

      return this.content;
    } else {
      this.content.append(this.error);

      return this.content;
    }
  }

  private genDescription(): HTMLDivElement {
    const name = genElement('div', { className: 'name' }, [`${this.model.response?.name}`]);
    const description = genElement('div', { className: 'description' }, [`${this.model.response?.description}`]);
    const wrapperDescription = genElement('div', { className: 'wrapper-description' }, [name, description]);

    return wrapperDescription;
  }

  public genSlider(): HTMLDivElement {
    const images = this.model.response?.img ?? [];

    return genElement('div', { className: 'swiper' }, [
      genElement(
        'div',
        { className: 'swiper-wrapper' },
        images.map((img) => {
          return genElement('div', { className: 'swiper-slide' }, [
            genElement('img', {
              className: 'image',
              src: img,
              alt: `${this.model.response?.name}`,
              width: 200,
              height: 200,
            }),
          ]);
        }),
      ),
      genElement('div', { className: 'swiper-pagination' }),
      ...(images.length > 1
        ? [
            genElement('div', { className: 'swiper-button-next' }),
            genElement('div', { className: 'swiper-button-prev' }),
          ]
        : []),
    ]);
  }
}

export default DetailedProductPage;
