import { HomePage } from '../../pages/home/home.ts';
import { Header } from '../../pages/layout/header.ts';
import { Layout } from '../../pages/layout/layout.ts';

export class HomeController {
  private homeView: HomePage;

  constructor() {
    this.homeView = new HomePage({
      tag: 'section',
      classNames: ['home-page'],
    });

    Header.switchBtn();
  }

  public render(): void {
    const layout = Layout.getInstance();

    layout.setMainContent(this.homeView.getHtmlElement());
  }
}
