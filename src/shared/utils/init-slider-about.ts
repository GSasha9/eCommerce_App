// slider-init-about.ts
import Swiper from 'swiper/bundle';
import type { SwiperOptions } from 'swiper/types';

import type { IInitSliderProperties } from '../models/interfaces/init-slider-properties.ts';
import { isHTMLElement } from '../models/typeguards.ts';

let swiperInstance: Swiper | null = null;

export function initSliderAbout(properties: IInitSliderProperties): void {
  const { images } = properties;
  const swiperEl = document.querySelector(`.swiper.about-slider`);
  const imagesArray = images ?? [];
  const hasMultipleImages = imagesArray.length > 1;

  const swiperParams: SwiperOptions = {
    loop: true,
    slidesPerView: 1,
    centeredSlides: true,
    direction: 'horizontal',
    observer: true,
    observeParents: true,
    observeSlideChildren: true,
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

  if (swiperInstance && typeof swiperInstance.destroy === 'function') {
    swiperInstance.destroy(true, true);
  }

  if (isHTMLElement(swiperEl) && hasMultipleImages) {
    swiperInstance = new Swiper(swiperEl, swiperParams);

    window.addEventListener('pageshow', () => {
      if (swiperInstance) {
        swiperInstance.update();
      }
    });

    setTimeout(() => {
      if (swiperInstance) {
        swiperInstance.update();
      }
    }, 100);
  }
}
