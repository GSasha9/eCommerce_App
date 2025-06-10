import type { ISliderElementProperties } from '../models/interfaces';
import { genElement } from './gen-element';

export function genSliderElement(properties: ISliderElementProperties): HTMLDivElement {
  const { images, width, alt, name } = properties;
  const imagesArray = images ?? [];

  const slider = genElement('div', { className: `swiper ${name}` }, [
    genElement(
      'div',
      { className: 'swiper-wrapper' },
      imagesArray.map((img) => {
        return genElement('div', { className: 'swiper-slide' }, [
          genElement('img', {
            className: `modal-image ${name}`,
            id: `modal-image ${name}`,
            src: img,
            alt: alt,
            width: width,
            height: width,
          }),
        ]);
      }),
    ),
    genElement('div', { className: 'swiper-pagination' }),
    ...(imagesArray.length > 1
      ? [genElement('div', { className: 'swiper-button-next' }), genElement('div', { className: 'swiper-button-prev' })]
      : []),
  ]);

  return slider;
}
