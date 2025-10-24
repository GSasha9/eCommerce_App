import { HomePage } from '../../pages/home/home.ts';
import { Layout } from '../../pages/layout/layout.ts';
import { updateCountItemsCart } from '../../shared/utils/update-countItems-cart.ts';

export class HomeController {
  private homeView: HomePage;

  constructor() {
    this.homeView = new HomePage({
      tag: 'section',
      classNames: ['home-page'],
    });
    void updateCountItemsCart();
  }

  public render(): void {
    const layout = Layout.getInstance();

    layout.setMainContent(this.homeView.getHtmlElement());
  }
}
