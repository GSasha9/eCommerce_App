import { Router } from './router';
import { ROUTES_URL } from './routes.constant.ts';

const route: Router = new Router(ROUTES_URL.MAIN);

export { route, ROUTES_URL };
