import { Router } from './router';
import { ROUTES } from './routes';

const route: Router = new Router(ROUTES.HOME);

export { route, ROUTES };
