import { route, ROUTES_URL } from '../router';
import type { Router } from '../router/router.ts';
import { AboutController } from './about/about-controller.ts';
import { AccountController } from './account/account-controller.ts';
import { CartController } from './cart/cart-controller.ts';
import CatalogController from './catalog/catalog-controller.ts';
import { DetailedProductController } from './detailed-product/detailed-product-controller.ts';
import { HomeController } from './home/home-controller.ts';
import { LoginController } from './login/login-controller.ts';
import { NotFoundController } from './not-found/notfound-controller.ts';
import { RegistrationController } from './registration/registration-controller.ts';

export class Controller {
  private router: Router;
  private homeController: HomeController;
  private notFoundController: NotFoundController;
  private loginPageController: LoginController;
  private registrationController: RegistrationController;
  private aboutController: AboutController;
  private catalogController: CatalogController;
  private detailedProductController: DetailedProductController;
  private accountController: AccountController;
  private cartController: CartController;

  constructor() {
    this.homeController = new HomeController();
    this.notFoundController = new NotFoundController();
    this.loginPageController = new LoginController();
    this.registrationController = new RegistrationController();
    this.aboutController = new AboutController();
    this.catalogController = new CatalogController();
    this.detailedProductController = new DetailedProductController();
    this.accountController = new AccountController();
    this.cartController = new CartController();
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

    this.router.addRoute(ROUTES_URL.PRODUCT, () => {
      void this.detailedProductController.render();
    });

    this.router.addRoute(ROUTES_URL.BASKET, () => {
      void this.cartController.render();
    });

    this.router.addRoute(ROUTES_URL.ABOUT, () => {
      this.aboutController.render();
    });

    this.router.addRoute(ROUTES_URL.CATALOG, () => {
      void this.catalogController.render();
    });

    this.router.addRoute(ROUTES_URL.ACCOUNT, () => {
      this.accountController.render();
    });
  }
}
