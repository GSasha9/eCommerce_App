import { NotFoundPage } from '../../pages/not-found/not-found.ts';
import { Layout } from '../../pages/layout.ts';

export class NotFoundController {
  private notFoundPage: NotFoundPage;

  constructor() {
    this.notFoundPage = new NotFoundPage();
    this.render();
  }

  public render(): void {
    const layout = Layout.getInstance();

    layout.setMainContent(this.notFoundPage.getHtmlElement());
  }
}
