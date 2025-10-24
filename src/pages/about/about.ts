import type { IParameters } from '../../shared/models/interfaces';
import { CreateElement } from '../../shared/utils/create-element.ts';
import { genSliderElementAbout } from '../../shared/utils/gen-slider-element-about.ts';
import { View } from '../view.ts';
import { sliderProperties } from './slider-props.ts';

import './style.scss';

export class AboutPage extends View {
  constructor(parameters: Partial<IParameters> = {}) {
    super({ tag: 'div', classNames: ['about-page'], ...parameters });
    this.createAbout();
  }

  private createAbout(): void {
    const header: CreateElement = new CreateElement({
      tag: 'div',
      classNames: ['wrapper', 'about__wrapper'],
      textContent: '',
      callback: (): void => {},
    });

    const title: CreateElement = new CreateElement({
      tag: 'h4',
      classNames: ['header__logo'],
      textContent: 'Our team:',
      callback: (): void => {},
    });

    const titleDescription: CreateElement = new CreateElement({
      tag: 'h4',
      classNames: ['header__logo'],
      textContent: 'Collaboration:',
      callback: (): void => {},
    });

    const textCollaboration: CreateElement = new CreateElement({
      tag: 'p',
      classNames: ['text-description'],
      textContent:
        "Our team's effective collaboration was the cornerstone of our project's success 🎉. We met every week on Google Meets, where we discussed progress, set goals, and exchanged ideas face-to-face. In between meetings, we relied on Discord chat to keep the conversation flowing and quickly address any challenges that arose. To keep track of our tasks and deadlines, we used a Trello board, ensuring that every detail was accounted for. Finally, by harnessing the power of GitHub for collective development, we seamlessly merged our individual contributions into one cohesive final product. This structured yet dynamic approach allowed us to combine our strengths and achieve a successful project completion.",
      callback: (): void => {},
    });

    const sliderElement = genSliderElementAbout(sliderProperties);

    header.addInnerElement(title.getElement());
    header.addInnerElement(sliderElement);
    header.addInnerElement(titleDescription);
    header.addInnerElement(textCollaboration);
    this.viewElementCreator.addInnerElement(header.getElement());
  }
}
