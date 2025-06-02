import type { IRouter } from '../shared/models/interfaces';

export class Router implements IRouter {
  private routes: Map<string, () => void>;
  private currentPath: string;
  private readonly defaultPath: string;

  constructor(defaultPath: string = '/') {
    this.routes = new Map();
    this.currentPath = defaultPath;
    this.defaultPath = defaultPath;
  }

  public getCurrentPath(): string {
    return this.currentPath;
  }

  public getDefaultPath(): string {
    return this.defaultPath;
  }

  public addRoute(path: string, controller: () => void): void {
    const normalizedPath: string = path !== '/' && path.endsWith('/') ? path.slice(0, -1) : path;

    this.routes.set(normalizedPath, controller);
  }

  public navigate(path: string, pushState: boolean = true): void {
    let normalizedPath: string = path !== '/' && path.endsWith('/') ? path.slice(0, -1) : path;
    let dynamicPath;

    if (normalizedPath.split('/').length > 2) {
      dynamicPath = `/${normalizedPath.split('/')[1]}`;
    }

    const token = localStorage.getItem('isLoggedPlants');

    if (token && (normalizedPath === '/login' || normalizedPath === '/registration')) {
      normalizedPath = '/home';
      window.history.replaceState({}, '', normalizedPath);
    } else if (pushState) {
      window.history.pushState({}, '', normalizedPath);
    } else if (!token) {
      normalizedPath = '/home';
      window.history.replaceState({}, '', normalizedPath);
    }

    const controller = dynamicPath ? this.routes.get(dynamicPath) : this.routes.get(normalizedPath);

    if (controller) {
      this.currentPath = dynamicPath ? dynamicPath : normalizedPath;
      controller();
    } else {
      this.currentPath = '/404';
      const notFoundController = this.routes.get('/404');

      if (notFoundController) {
        if (pushState) {
          window.history.pushState({}, '', '/404');
        }

        notFoundController();
      }
    }
  }

  public init(): void {
    window.addEventListener('popstate', () => {
      this.handleRoute();
    });
    this.handleRoute();
  }

  private handleRoute(): void {
    const path: string = this.getPathFromUrl();

    this.navigate(path, false);
  }

  private getPathFromUrl(): string {
    let path: string = window.location.pathname;

    if (path !== '/' && path.endsWith('/')) {
      path = path.slice(0, -1);
    }

    return path || this.defaultPath;
  }
}
