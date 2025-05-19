import { AboutPage } from '../../pages/about/about.ts';
import { authService } from '../../services/commercetools/auth-service.ts';

export class AboutController {
  private homeView: AboutPage;

  constructor() {
    this.homeView = new AboutPage({
      tag: 'section',
      classNames: ['about-page'],
    });
  }

  public render(): void {
    const container: HTMLElement = document.body;

    if (container) {
      container.replaceChildren();
      container.appendChild(this.homeView.getHtmlElement());
    }

    void (async function (): Promise<void> {
      try {
        const api = authService.api;

        await api.me().carts().get().execute();
      } catch (error) {
        console.warn('Failed to get user carts', error);
      }
    })(); // заготовка для запросов товаров, сейчас нужна чтобы в ls увидеть token авторизованного пользователя
  }
}
