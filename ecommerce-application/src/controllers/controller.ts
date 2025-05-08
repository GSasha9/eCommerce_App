import type { Router } from '../router/router';
import { route, ROUTES } from '../router/';
import { HomeController } from './home/home-controller.ts';
import { NotFoundController } from './not-found/notfound-controller.ts';

export class Controller {
  private router: Router;
  private homeController: HomeController;
  private notFoundController: NotFoundController;

  constructor() {
    this.homeController = new HomeController();
    this.notFoundController = new NotFoundController();
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
      //this.controllerLogin();
      console.log('login');
    });

    this.router.addRoute(ROUTES.NOT_FOUND, () => {
      this.notFoundController.render();
    });
  }
}
