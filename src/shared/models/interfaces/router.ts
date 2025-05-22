export interface IRouter {
  addRoute(path: string, handler: () => void): void;
  navigate(path: string): void;
  getCurrentPath(): string;
  getDefaultPath(): string;
}
