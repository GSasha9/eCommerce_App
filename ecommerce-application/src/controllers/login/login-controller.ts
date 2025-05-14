import { LoginModel } from '../../model/user/login-model';
//import { LoginPage } from '../../pages/login/login';
import { authService } from '../../services/commercetools/auth-service';
import { findUserByEmailResponse } from '../../shared/models/typeguards.ts';

export class LoginPageController {
  //private loginPage: LoginPage;
  private loginModel: LoginModel;

  constructor() {
    //this.loginPage = new LoginPage({}, this.handleLoginSubmit);
    this.loginModel = new LoginModel();
    this.render();
  }

  public render(): void {
    const container: HTMLElement = document.body;

    if (container) {
      document.body.replaceChildren();

      //container.appendChild(this.loginPage.getHtmlElement());
    }
  }

  private handleLoginSubmit = async (email: string, password: string): Promise<void> => {
    try {
      //const response = await this.loginModel.sendLoginAuthData(email, password);

      //console.log('Login success:', response);
      window.location.href = '/main';
    } catch (error) {
      console.error('Login error:', error);

      try {
        const response = await authService.getCustomerByEmail(email);

        if (findUserByEmailResponse(response)) {
          if (response.body?.results.length === 0) {
            console.log('this email doesnt register');
          } else {
            console.log('incorrect password');
          }
        }
      } catch {
        console.error('error');
      }
    }
  };
}
