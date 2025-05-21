import { AboutPage } from '../../pages/about/about.ts';
import { Layout } from '../../pages/layout.ts';

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
  }
}
