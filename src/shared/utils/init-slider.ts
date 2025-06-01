import Swiper from 'swiper/bundle';
import type { SwiperOptions } from 'swiper/types';

import { isHTMLElement } from '../models/typeguards.ts';

export interface IInitSliderProperties {
  images: string[];
  name: string;
}

export function initSlider(properties: IInitSliderProperties): void {
  const { images, name } = properties;
  const swiperEl = document.querySelector(`.swiper.${name}`);

  const imagesArray = images ?? [];
  const hasMultipleImages = imagesArray.length > 1;

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
  };

  if (isHTMLElement(swiperEl) && hasMultipleImages) {
    new Swiper(swiperEl, swiperParams);
  }
}

// public initSlider(): void {
//     const swiperEl = document.querySelector(`.swiper${name}`);

//     const images = this.response?.img ?? [];
//     const hasMultipleImages = images.length > 1;

//     const swiperParams: SwiperOptions = {
//       loop: true,
//       slidesPerView: 1,
//       centeredSlides: true,
//       direction: 'horizontal',
//       ...(hasMultipleImages && {
//         navigation: {
//           nextEl: '.swiper-button-next',
//           prevEl: '.swiper-button-prev',
//         },
//         pagination: {
//           el: '.swiper-pagination',
//           clickable: true,
//         },
//       }),

//     };

//     if (isHTMLElement(swiperEl) && hasMultipleImages) {
//       new Swiper(swiperEl, swiperParams);
//     }
//   }
