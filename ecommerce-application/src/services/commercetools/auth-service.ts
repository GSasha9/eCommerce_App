import { ClientBuilder, type Client, type ClientResponse } from '@commercetools/ts-client';
import { createApiBuilderFromCtpClient, type CustomerPagedQueryResponse } from '@commercetools/platform-sdk';
import type { ByProjectKeyRequestBuilder, CustomerSignInResult } from '@commercetools/platform-sdk';
import type { AuthState } from './models/types';
import { tokenCache } from '../sdk/token';
import { TOKEN } from './models/constants';

class AuthorizationService {
  private static instance: AuthorizationService;

  private api: ByProjectKeyRequestBuilder;

  private projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;
  private authUrl = import.meta.env.VITE_CTP_AUTH_URL;
  private clientId = import.meta.env.VITE_CTP_CLIENT_ID;
  private clientSecret = import.meta.env.VITE_CTP_CLIENT_SECRET;
  private apiUrl = import.meta.env.VITE_CTP_API_URL;
  private scopes = import.meta.env.VITE_CTP_SCOPES;
  private isAuthenticated = false;

  private constructor() {
    this.api = this.initializeAnonymousSession();
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

  public registerCustomer = async (email: string, password: string, anonymousCartId?: string): Promise<void> => {
    if (!this.projectKey || !this.apiUrl) {
      throw new Error('Missing required config for Commercetools');
    }

    const bodySignUp = {
      email,
      password,
      ...(anonymousCartId && {
        anonymousCart: {
          id: anonymousCartId,
          typeId: 'cart',
        },
      }),
    };

    try {
      await this.api.me().signup().post({ body: bodySignUp }).execute();
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  public signInCustomer = async (
    email: string,
    password: string,
    _accessToken?: string,
    anonymousCartId?: string,
  ): Promise<CustomerSignInResult | undefined> => {
    if (!this.projectKey) {
      throw new Error('Missing required project key for Commercetools');
    }

    this.api = this.apiDefinition({ type: 'authenticated', email, password });
    this.isAuthenticated = true;

    try {
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

      return response.body;
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed');
    }
  };

  public logOutCustomer = (): void => {
    const cacheKey = TOKEN.USER;

    if (!localStorage.getItem(cacheKey)) return;

    localStorage.removeItem(cacheKey);

    this.isAuthenticated = false;
  };

  public getCustomerByEmail(email: string): Promise<ClientResponse<CustomerPagedQueryResponse>> {
    return this.api
      .customers()
      .get({
        queryArgs: {
          where: `email="${email}"`,
        },
      })
      .execute();
  }

  private initializeAnonymousSession(): ByProjectKeyRequestBuilder {
    return this.apiDefinition({ type: 'anonymous' });
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
      throw new Error('Missing required env variables for Commercetools client');
    }

    const builder = new ClientBuilder();

    if (auth.type === 'authenticated') {
      console.log('Scopes used for authenticated client:', this.scopes);

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
          scopes: ['view_published_products:plants', 'manage_my_profile:plants'],
          httpClient: fetch,
          tokenCache: tokenCache('ct_anon_token'), //чтобы сохранять токен между перезагрузками страницы, не делать авторизацию каждый раз. Позволяет SDK автоматически обновлять токен
        })
        .withHttpMiddleware({ host: this.apiUrl, httpClient: fetch })
        .build();
    }
  };
}

export const authService = AuthorizationService.getInstance();
