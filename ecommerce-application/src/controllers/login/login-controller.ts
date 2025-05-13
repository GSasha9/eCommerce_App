import { LoginModel } from '../../model/user/login-model';
import { LoginPage } from '../../pages/login/login';

export class LoginPageController {
  private loginPage: LoginPage;
  private userModel: LoginModel;

  constructor() {
    this.loginPage = new LoginPage({}, this.handleLoginSubmit);
    this.userModel = new LoginModel();
    this.render();
  }

  public render(): void {
    const container: HTMLElement = document.body;

    if (container) {
      document.body.replaceChildren();

      container.appendChild(this.loginPage.getHtmlElement());
    }
  }

  private handleLoginSubmit = async (email: string, password: string): Promise<void> => {
    try {
      const response = await this.userModel.sendLoginAuthData(email, password);

      console.log('Login success:', response);
      window.location.href = '/main';
    } catch (error) {
      console.error('Login error:', error);
    }
  };
}
