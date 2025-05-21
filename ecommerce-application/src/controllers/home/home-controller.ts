import { HomePage } from '../../pages/home/home.ts';
import { Layout } from '../../pages/layout.ts';

export class HomeController {
  private homeView: HomePage;

  constructor() {
    this.homeView = new HomePage({
      tag: 'section',
      classNames: ['home-page'],
    });
  }

  public render(): void {
    const layout = Layout.getInstance();

    layout.setMainContent(this.homeView.getHtmlElement());
  }
}
