import type { Router } from '../router/router';
import { route, ROUTES } from '../router/';
import { HomeController } from './home/home-controller.ts';
import { NotFoundController } from './not-found/notfound-controller.ts';
import { LoginController } from './login/login-controller.ts';
import { RegistrationController } from './registration/registration-controller.ts';
import { ShopController } from './shop/shop-controller.ts';
import { AboutController } from './about/about-controller.ts';

export class Controller {
  private router: Router;
  private homeController: HomeController;
  private notFoundController: NotFoundController;
  private loginPageController: LoginController;
  private registrationController: RegistrationController;
  //private authorizationService = authService;
  private shopController: ShopController;
  private aboutController: AboutController;

  constructor() {
    this.homeController = new HomeController();
    this.notFoundController = new NotFoundController();
    this.loginPageController = new LoginController();
    this.registrationController = new RegistrationController();
    this.shopController = new ShopController();
    this.aboutController = new AboutController();
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

    this.router.addRoute(ROUTES.PRODUCTS, () => {
      this.shopController.render();
    });
    this.router.addRoute(ROUTES.ABOUT, () => {
      this.aboutController.render();
    });
  }
}
