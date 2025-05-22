import { Header } from './header.ts';
import { Footer } from './footer.ts';

export class Layout {
  private static instance: Layout;
  private headerComponent: Header;
  private readonly mainContainer: HTMLElement;
  private footerComponent: Footer;
  private readonly appContainer: HTMLElement;

  private constructor() {
    this.headerComponent = new Header();
    this.footerComponent = new Footer();

    this.appContainer = document.createElement('section');
    this.appContainer.classList.add('app');
    this.mainContainer = document.createElement('main');
    this.mainContainer.classList.add('main-content');

    const appContainer: HTMLElement = this.appContainer;

    appContainer.replaceChildren();
    appContainer.appendChild(this.headerComponent.getElement());
    appContainer.appendChild(this.mainContainer);
    appContainer.appendChild(this.footerComponent.getElement());
    document.body.appendChild(appContainer);
  }

  public static getInstance(): Layout {
    if (!Layout.instance) {
      Layout.instance = new Layout();
    }

    return Layout.instance;
  }

  public setMainContent(content: HTMLElement): void {
    this.mainContainer.replaceChildren();
    this.mainContainer.appendChild(content);
  }
}
