import type { Router } from '../router/router';
import { route, ROUTES } from '../router/';
import { HomeController } from './home/home-controller.ts';
import { NotFoundController } from './not-found/notfound-controller.ts';
import { LoginPageController } from './login/login-controller.ts';
import { RegistrationController } from './registration/registration-controller.ts';

export class Controller {
  private router: Router;
  private homeController: HomeController;
  private notFoundController: NotFoundController;
  private loginPageController: LoginPageController;
  private registrationController: RegistrationController;

  constructor() {
    this.homeController = new HomeController();
    this.notFoundController = new NotFoundController();
    this.loginPageController = new LoginPageController();
    this.registrationController = new RegistrationController();
    this.router = route;
    this.setupRoutes();
    this.router.init();
  }

  private setupRoutes(): void {
    this.router.addRoute(ROUTES.HOME, () => {
      this.homeController.render();
    });

    this.router.addRoute(ROUTES.HOME_ALT, () => {
      this.homeController.render();
    });

    this.router.addRoute(ROUTES.LOGIN, () => {
      this.loginPageController.render();
    });

    this.router.addRoute(ROUTES.REGISTRATION, () => {
      this.registrationController.render();
    });

    this.router.addRoute(ROUTES.NOT_FOUND, () => {
      this.notFoundController.render();
    });
  }
}
