import type {
  ByProjectKeyRequestBuilder,
  Category,
  ClientResponse,
  CustomerSignInResult,
  MyCustomerDraft,
  ProductProjection,
  ProductProjectionPagedSearchResponse,
} from '@commercetools/platform-sdk';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import type { ExistingTokenMiddlewareOptions } from '@commercetools/ts-client';
import { type Client, ClientBuilder } from '@commercetools/ts-client';

import { ErrorMessage, PRODUCTS_PER_PAGE } from '../shared/constants';
import type { ProductPerPageResponse } from '../shared/models/type';
//import { TOKEN } from './models/constants';
import type { AuthState } from './models/types';
import { isCredentials } from './models/utils/isCredentials';
import { getToken, tokenCache } from './models/utils/token';

export class AuthorizationService {
  private static instance: AuthorizationService;

  public api!: ByProjectKeyRequestBuilder;

  public projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;
  private authUrl = import.meta.env.VITE_CTP_AUTH_URL;
  private clientId = import.meta.env.VITE_CTP_CLIENT_ID;
  private clientSecret = import.meta.env.VITE_CTP_CLIENT_SECRET;
  private apiUrl = import.meta.env.VITE_CTP_API_URL;
  private scopes = import.meta.env.VITE_CTP_SCOPES;
  public isAuthenticated = false;
  private token: string | null;

  private options: ExistingTokenMiddlewareOptions = { force: true };

  private constructor() {
    this.token = getToken();

    if (!this.tryRestoreUserSession()) {
      this.api = this.initializeAnonymousSession();
    }
  }

  public static getInstance(): AuthorizationService {
    if (!AuthorizationService.instance) {
      AuthorizationService.instance = new AuthorizationService();
    }

    return AuthorizationService.instance;
  }

  public getAuthenticatedStatus(): boolean {
    return this.isAuthenticated;
  }

  public registerCustomer = async (body: MyCustomerDraft, anonymousCartId?: string): Promise<void> => {
    if (!this.projectKey || !this.apiUrl) {
      throw new Error(ErrorMessage.MISSING_CONFIG);
    }

    const bodySignUp = {
      ...body,
      ...(anonymousCartId && {
        anonymousCart: {
          id: anonymousCartId,
          typeId: 'cart',
        },
      }),
    };

    await this.api.me().signup().post({ body: bodySignUp }).execute();
    const { email, password } = body;

    this.api = this.apiDefinition({ type: 'authenticated', email, password });
    this.isAuthenticated = true;
    localStorage.removeItem('ct_anon_token');
  };

  public signInCustomer = async (
    email: string,
    password: string,
    _accessToken?: string,
    anonymousCartId?: string,
  ): Promise<CustomerSignInResult | undefined> => {
    if (!this.projectKey) {
      throw new Error(ErrorMessage.MISSING_PROJECT_KEY);
    }

    this.api = this.apiDefinition({ type: 'authenticated', email, password });

    const response = await this.api
      .me()
      .login()
      .post({
        body: {
          email,
          password,
          ...(anonymousCartId && {
            anonymousCart: {
              id: anonymousCartId,
              typeId: 'cart',
            },
          }),
        },
      })
      .execute();

    this.isAuthenticated = true;

    if (localStorage.getItem('ct_anon_token')) localStorage.removeItem('ct_anon_token');

    localStorage.setItem('ct_user_credentials', JSON.stringify({ email, password }));

    return response.body;
  };

  public getProductByKey = async (productKey: string): Promise<ClientResponse<ProductProjection>> => {
    try {
      const res = await this.api.productProjections().withKey({ key: productKey }).get().execute();

      return res;
    } catch (error) {
      console.error(ErrorMessage.UNABLE_TO_GET_INFO_PRODUCT, error);
      throw error;
    }
  };

  public logOutCustomer = (): void => {
    //const cacheKey = TOKEN.USER;

    //if (!localStorage.getItem(cacheKey)) return;

    this.api = this.initializeAnonymousSession();

    localStorage.removeItem('ct_user_token');
    localStorage.removeItem('ct_user_credentials');
    this.isAuthenticated = false;
  };

  // public getCustomerByEmail(email: string): Promise<ClientResponse<CustomerPagedQueryResponse>> {
  //   return this.api
  //     .customers()
  //     .get({
  //       queryArgs: {
  //         where: `email="${email}"`,
  //       },
  //     })
  //     .execute();
  // }

  public getPlantSubCategories = async (): Promise<Record<string, Category[]>> => {
    const response = await this.api
      .categories()
      .get({
        queryArgs: {
          limit: 50,
        },
      })
      .execute();

    const allCategories = response.body.results;

    const plantCategory = allCategories.filter((result) => result.key === 'plants-main');

    const mainCategoryName = plantCategory[0].name['en-US'];

    const subcategories = allCategories.filter((cat) => cat.parent?.id === plantCategory[0].id);

    const result: Record<string, Category[]> = {
      [mainCategoryName]: subcategories,
    };

    return result;
  };

  public fetchProducts = async (
    page: number = 1,
    limit: number = PRODUCTS_PER_PAGE,
  ): Promise<ProductPerPageResponse | undefined> => {
    try {
      const category = await this.getPlantSubCategories();
      const offset = (page - 1) * limit;
      const response = await this.api
        .productProjections()
        .get({
          queryArgs: {
            where: `(categories(id="${Object.values(category)[0][0].id}") or categories(id="${Object.values(category)[0][1].id}")) and published= true`,
            limit: 100,
            offset,
          },
        })
        .execute();

      return {
        products: response.body.results,
        total: response.body.total,
        currentPage: page,
        totalPages: Math.ceil(response.body.total ?? 0 / limit) | 1,
      };
    } catch (error) {
      console.error(ErrorMessage.UNABLE_TO_GET_INFO_PRODUCT, error);
      throw error;
    }
  };

  public fetchProductsByCategory = async (key: string): Promise<ProductProjection[] | undefined> => {
    try {
      const category = await this.api.categories().withKey({ key }).get().execute();

      const response = await this.api
        .productProjections()
        .get({
          queryArgs: {
            where: `(categories(id="${category.body.id}") and published= true)`,
            limit: 100,
          },
        })
        .execute();

      return response.body.results;
    } catch (error) {
      console.error(ErrorMessage.UNABLE_TO_GET_PRODUCT_BY_CATEGORY, error);
      throw error;
    }
  };

  public searchProducts = async (
    filterQuery: string[],
    sort?: string,
    text?: string,
  ): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> => {
    try {
      const queryArgs: Record<string, string | string[] | number> = {
        'filter.query': filterQuery,
        priceCountry: 'US',
        priceCurrency: 'USD',
        limit: 100,
      };

      if (sort) {
        queryArgs['sort'] = sort;
      }

      if (text) {
        queryArgs['text.en-US'] = text.trim();
      }

      const response = await this.api
        .productProjections()
        .search()
        .get({
          queryArgs,
        })
        .execute();

      return response;
    } catch (error) {
      console.error('Unable to get products by category and price', error);
      throw error;
    }
  };

  public initializeAnonymousSession(): ByProjectKeyRequestBuilder {
    return this.apiDefinition({ type: 'anonymous' });
  }

  public async refreshAnonymousToken(): Promise<void> {
    const client = new ClientBuilder()
      .withAnonymousSessionFlow({
        host: this.authUrl,
        projectKey: this.projectKey,
        credentials: { clientId: this.clientId, clientSecret: this.clientSecret },
        scopes: [
          'manage_my_profile:plants',
          'view_published_products:plants',
          'view_categories:plants',
          'create_anonymous_token:plants',
        ],
        httpClient: fetch,
        tokenCache: tokenCache('ct_anon_token'),
      })
      .withHttpMiddleware({ host: this.apiUrl, httpClient: fetch })
      .build();

    await createApiBuilderFromCtpClient(client)
      .withProjectKey({ projectKey: this.projectKey })
      .categories()
      .get({ queryArgs: { limit: 1 } })
      .execute();

    this.api = createApiBuilderFromCtpClient(client).withProjectKey({ projectKey: this.projectKey });
  }

  private tryRestoreUserSession(): boolean {
    const userTokenStore = tokenCache('ct_user_token').get();
    const credentialsRaw = localStorage.getItem('ct_user_credentials');

    console.log('Try restore:', userTokenStore);

    if (userTokenStore?.token && userTokenStore?.expirationTime > Date.now() && credentialsRaw) {
      try {
        const parsed: unknown = JSON.parse(credentialsRaw);

        if (!isCredentials(parsed)) {
          return false;
        }

        this.token = `Bearer ${userTokenStore.token}`;
        console.log(this.token, 'token');
        this.api = this.apiDefinition({
          type: 'authenticated',
          email: parsed.email,
          password: parsed.password,
        });
        this.isAuthenticated = true;

        return true;
      } catch (e) {
        console.error('Failed to parse stored credentials:', e);

        return false;
      }
    }

    return false;
  }

  private apiDefinition = (auth: AuthState, projectKey = this.projectKey): ByProjectKeyRequestBuilder => {
    const client = this.getClient(auth);

    return createApiBuilderFromCtpClient(client).withProjectKey({ projectKey });
  };

  private getClient = (
    auth: AuthState,
    projectKey = this.projectKey,
    clientId = this.clientId,
    clientSecret = this.clientSecret,
  ): Client => {
    if (!this.projectKey || !this.authUrl || !this.apiUrl || !this.clientId || !this.clientSecret) {
      throw new Error(ErrorMessage.MISSING_ENV_VARS);
    }

    const builder = new ClientBuilder();

    if (this.token) {
      return builder
        .withExistingTokenFlow(this.token, this.options)
        .withHttpMiddleware({ host: this.apiUrl, httpClient: fetch })
        .build();
    }

    if (auth.type === 'authenticated') {
      return builder
        .withPasswordFlow({
          host: this.authUrl,
          projectKey,
          credentials: {
            clientId,
            clientSecret,
            user: {
              username: auth.email,
              password: auth.password,
            },
          },
          scopes: this.scopes.split(' '),
          tokenCache: tokenCache('ct_user_token'),
          httpClient: fetch,
        })
        .withHttpMiddleware({ host: this.apiUrl, httpClient: fetch })
        .build();
    } else {
      return builder
        .withAnonymousSessionFlow({
          host: this.authUrl,
          projectKey,
          credentials: { clientId, clientSecret },
          scopes: [
            'manage_my_profile:plants',
            'view_published_products:plants',
            'view_categories:plants',
            'create_anonymous_token:plants',
          ],
          httpClient: fetch,
          tokenCache: tokenCache('ct_anon_token'),
        })
        .withHttpMiddleware({ host: this.apiUrl, httpClient: fetch })
        .build();
    }
  };
}

export const authService = AuthorizationService.getInstance();
