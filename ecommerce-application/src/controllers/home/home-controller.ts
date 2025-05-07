import { HomePage } from '../../pages/home/home.ts';

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
  }
}
