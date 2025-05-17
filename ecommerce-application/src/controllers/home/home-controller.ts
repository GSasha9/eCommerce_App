import { HomePage } from '../../pages/home/home.ts';
import { getApi } from '../../services/sdk/auth.ts';

export class HomeController {
  private homeView: HomePage;

  constructor() {
    this.homeView = new HomePage({
      tag: 'section',
      classNames: ['home-page'],
    });

    this.render();
  }

  public render(): void {
    const container: HTMLElement = document.body;

    if (container) {
      container.replaceChildren();
      container.appendChild(this.homeView.getHtmlElement());
    }

    void this.temporarily(); // временно
  }

  private temporarily = async (): Promise<void> => {
    try {
      const api = getApi();
      const me = await api.me().carts().get().execute(); // запрос просто чтобы увидеть в LS token который сгенерил sdk

      console.log('ME=', me);
      console.log('заглушка', this.homeView);
    } catch (error) {
      console.log('1', error);
    }
  };
}
