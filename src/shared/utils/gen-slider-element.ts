import { genElement } from './gen-element';

export interface ISliderElementProperties {
  images: string[];
  width: number;
  alt: string;
  name: string;
}

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

//  public genSlider(): HTMLDivElement {
//     const images = this.model.response?.img ?? [];

//     return genElement('div', { className: 'swiper' }, [
//       genElement(
//         'div',
//         { className: 'swiper-wrapper' },
//         images.map((img) => {
//           return genElement('div', { className: 'swiper-slide' }, [
//             genElement('img', {
//               className: 'modal-image',
//               id: 'modal-image',
//               src: img,
//               alt: `${this.model.response?.name}`,
//               width: 200,
//               height: 200,
//             }),
//           ]);
//         }),
//       ),
//       genElement('div', { className: 'swiper-pagination' }),
//       ...(images.length > 1
//         ? [
//             genElement('div', { className: 'swiper-button-next' }),
//             genElement('div', { className: 'swiper-button-prev' }),
//           ]
//         : []),
//     ]);
//   }
