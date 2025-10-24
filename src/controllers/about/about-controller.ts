import { AboutPage } from '../../pages/about/about.ts';
import { sliderProperties } from '../../pages/about/slider-props.ts';
import { Layout } from '../../pages/layout/layout.ts';
import { initSliderAbout } from '../../shared/utils/init-slider-about.ts';

export class AboutController {
  private aboutView: AboutPage;

  constructor() {
    this.aboutView = new AboutPage({
      tag: 'section',
      classNames: ['about-page'],
    });
  }

  public render(): void {
    const layout = Layout.getInstance();

    layout.setMainContent(this.aboutView.getHtmlElement());

    initSliderAbout({ images: sliderProperties.images, name: sliderProperties.name });
  }
}
