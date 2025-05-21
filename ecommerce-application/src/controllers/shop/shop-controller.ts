import { ShopPage } from '../../pages/shop/shop.ts';
import { Layout } from '../../pages/layout.ts';

export class ShopController {
  private shopView: ShopPage;

  constructor() {
    this.shopView = new ShopPage({
      tag: 'section',
      classNames: ['shop-page'],
    });
  }

  public render(): void {
    const layout = Layout.getInstance();

    layout.setMainContent(this.shopView.getHtmlElement());
  }
}
