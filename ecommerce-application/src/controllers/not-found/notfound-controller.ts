import { NotFoundPage } from '../../pages/not-found/not-found.ts';

export class NotFoundController {
  private notFoundPage: NotFoundPage;

  constructor() {
    this.notFoundPage = new NotFoundPage();
    this.render();
  }

  public render(): void {
    const container: HTMLElement = document.body;

    if (container) {
      document.body.replaceChildren();

      container.appendChild(this.notFoundPage.getHtmlElement());
    }
  }
}
