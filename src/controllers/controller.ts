import { route, ROUTES_URL } from '../router';
import type { Router } from '../router/router.ts';
import { AboutController } from './about/about-controller.ts';
import CatalogController from './catalog/catalog-controller.ts';
import { HomeController } from './home/home-controller.ts';
import { LoginController } from './login/login-controller.ts';
import { NotFoundController } from './not-found/notfound-controller.ts';
import { RegistrationController } from './registration/registration-controller.ts';
import { ShopController } from './shop/shop-controller.ts';

export class Controller {
  private router: Router;
  private homeController: HomeController;
  private notFoundController: NotFoundController;
  private loginPageController: LoginController;
  private registrationController: RegistrationController;
  private shopController: ShopController;
  private aboutController: AboutController;
  private catalogController: CatalogController;

  constructor() {
    this.homeController = new HomeController();
    this.notFoundController = new NotFoundController();
    this.loginPageController = new LoginController();
    this.registrationController = new RegistrationController();
    this.shopController = new ShopController();
    this.aboutController = new AboutController();
    this.catalogController = new CatalogController();
    this.router = route;
    this.setupRoutes();
    this.router.init();
  }

  private setupRoutes(): void {
    this.router.addRoute(ROUTES_URL.MAIN, () => {
      this.homeController.render();
    });

    this.router.addRoute(ROUTES_URL.MAIN_ALT, () => {
      this.homeController.render();
    });

    this.router.addRoute(ROUTES_URL.LOGIN, () => {
      this.loginPageController.render();
    });

    this.router.addRoute(ROUTES_URL.REGISTRATION, () => {
      this.registrationController.render();
    });

    this.router.addRoute(ROUTES_URL.NOT_FOUND, () => {
      this.notFoundController.render();
    });

    this.router.addRoute(ROUTES_URL.PRODUCTS, () => {
      this.shopController.render();
    });
    this.router.addRoute(ROUTES_URL.ABOUT, () => {
      this.aboutController.render();
    });

    this.router.addRoute(ROUTES_URL.CATALOG, () => {
      this.catalogController.render();
    });
  }
}
