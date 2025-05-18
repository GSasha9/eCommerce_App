import { HomePage } from '../../pages/home/home.ts';
import { authService } from '../../services/commercetools/auth-service.ts';

export class HomeController {
  private homeView: HomePage;

  constructor() {
    this.homeView = new HomePage({
      tag: 'section',
      classNames: ['home-page'],
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
        console.log('Failed to get user carts', error);
      }
    })(); // заготовка для запросов товаров, сейчас нужна чтобы в ls увидеть token авторизованного пользователя
  }
}
