import Swiper from 'swiper/bundle';
import type { SwiperOptions } from 'swiper/types';

import type { IInitSliderProperties } from '../models/interfaces/init-slider-properties.ts';
import { isHTMLElement } from '../models/typeguards.ts';

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
