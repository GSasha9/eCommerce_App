import { genElement } from '../../../shared/utils/gen-element';
import { genSliderElement } from '../../../shared/utils/gen-slider-element';
import { initSlider } from '../../../shared/utils/init-slider';
import { Modal } from '../modal';

import '../styles.scss';
import './styles.scss';

export interface IImageModalProperties {
  images: string[];
  width: number;
  alt: string;
  name: string;
}

export class ImageModal extends Modal {
  private button: HTMLButtonElement;
  private properties: IImageModalProperties;

  constructor(properties: IImageModalProperties) {
    super();
    this.properties = properties;
    const { images, width, alt, name } = this.properties;

    const sliderElement = genSliderElement({ images, width, alt, name });

    this.button = genElement('button', { className: 'close-big-image-button' });
    this.button.addEventListener('click', this.close);

    sliderElement.append(this.button);

    this.wrapper.node.append(sliderElement);
    setTimeout(() => {
      initSlider({ images, name });
    });
  }
}
