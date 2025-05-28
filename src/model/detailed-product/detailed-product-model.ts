import Swiper from 'swiper/bundle';
import type { SwiperOptions } from 'swiper/types';

import { authService } from '../../commerce-tools/auth-service';
import { isCommercetoolsApiError, isHTMLElement } from '../../shared/models/typeguards.ts';

import 'swiper/css/bundle';

export interface IResponseDetailedProduct {
  name: string;
  img: string[];
  description: string;
}

class DetailedProductModel {
  private static instance: DetailedProductModel;
  public key?: string;
  public response?: IResponseDetailedProduct | null;
  public isSuccess?: boolean;

  private constructor() {}

  public static getInstance(): DetailedProductModel {
    if (!DetailedProductModel.instance) {
      DetailedProductModel.instance = new DetailedProductModel();
    }

    return DetailedProductModel.instance;
  }

  public getProductKeyByUrl(): boolean {
    const path = window.location.pathname;

    this.key = path
      .split('/')
      .filter((i) => i)
      .pop();

    return Boolean(this.key);
  }

  public getDetailedInformation = async (): Promise<void> => {
    try {
      if (this.key) {
        const response = await authService.getProductByKey(this.key);

        const name = response.body.name.en;
        const img = response.body.masterVariant.images?.map((img) => img.url);
        const description = response.body.description?.en;

        this.isSuccess = true;

        if (name && img && description) {
          this.response = { name, img, description };

          console.log('response', response.body);
          console.log('this.response', this.response);
        }
      }
    } catch (error) {
      if (isCommercetoolsApiError(error)) {
        // const statusCode = error.body.statusCode;
        // const code = error.body.errors[0].code;

        this.isSuccess = false;
      } else {
        console.error('Unknown error', error);
      }
    }
  };

  public clearQueryResults(): void {
    this.key = '';
    this.response = null;
    this.isSuccess = undefined;
  }

  public initSlider(): void {
    const swiperEl = document.querySelector('.swiper');

    const images = this.response?.img ?? [];
    const hasMultipleImages = images.length > 1;

    const swiperParams: SwiperOptions = {
      loop: true,
      slidesPerView: 1,
      centeredSlides: true,
      direction: 'horizontal',
      ...(hasMultipleImages && {
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      }),
      // breakpoints: {
      //   640: {
      //     slidesPerView: 2,
      //   },
      //   1024: {
      //     slidesPerView: 3,
      //   },
      // },
    };

    if (isHTMLElement(swiperEl) && hasMultipleImages) {
      new Swiper(swiperEl, swiperParams);
    }
  }
}

export default DetailedProductModel;
