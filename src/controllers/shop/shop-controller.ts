import { Layout } from '../../pages/layout/layout.ts';
import { ShopPage } from '../../pages/shop/shop.ts';

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
