import { LoginPage } from '../../pages/login/login';

export class LoginPageController {
  private loginPage: LoginPage;

  constructor() {
    this.loginPage = new LoginPage();
    this.render();
  }

  public render(): void {
    const container: HTMLElement = document.body;

    if (container) {
      document.body.replaceChildren();

      container.appendChild(this.loginPage.getHtmlElement());
    }
  }
}
