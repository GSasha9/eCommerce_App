import type { Router } from '../router/router';
import { route, ROUTES } from '../router/';
import { HomeController } from './home/home-controller.ts';
import { NotFoundController } from './not-found/notfound-controller.ts';
import { LoginPageController } from './login/login-controller.ts';
import { RegistrationController } from './registration/registration-controller.ts';
import { authService } from '../services/commercetools/auth-service.ts';

export class Controller {
  private router: Router;
  private homeController: HomeController;
  private notFoundController: NotFoundController;
  private loginPageController: LoginPageController;
  private registrationController: RegistrationController;
  private authorizationService = authService;

  constructor() {
    this.authorizationService.initializeAnonymousSession().catch((err) => {
      console.error('Anonymous session init failed:', err);
    });
    this.homeController = new HomeController();
    this.notFoundController = new NotFoundController();
    this.loginPageController = new LoginPageController();
    this.registrationController = new RegistrationController();
    this.router = route;
    this.setupRoutes();
    this.router.init();
  }

  private setupRoutes(): void {
    this.router.addRoute(ROUTES.MAIN, () => {
      this.homeController.render();
    });

    this.router.addRoute(ROUTES.MAIN_ALT, () => {
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
