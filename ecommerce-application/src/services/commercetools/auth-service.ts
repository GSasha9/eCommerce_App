import { ClientBuilder, type Client } from '@commercetools/ts-client';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';
import type { AuthState } from './models/types';

type LoginResponse = object;

class AuthorizationService {
  private static instance: AuthorizationService;

  private projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;
  private authUrl = import.meta.env.VITE_CTP_AUTH_URL;
  private clientId = import.meta.env.VITE_CTP_CLIENT_ID;
  private clientSecret = import.meta.env.VITE_CTP_CLIENT_SECRET;
  private apiUrl = import.meta.env.VITE_CTP_API_URL;

  //private clientCache: Map<string, Client> = new Map();

  private constructor() {}

  public static getInstance(): AuthorizationService {
    if (!AuthorizationService.instance) {
      AuthorizationService.instance = new AuthorizationService();
    }

    return AuthorizationService.instance;
  }

  public apiDefinition = (auth: AuthState, projectKey = this.projectKey): ByProjectKeyRequestBuilder => {
    const client = this.getClient(auth);

    return createApiBuilderFromCtpClient(client).withProjectKey({ projectKey });
  };

  public getAccessToken = async (auth: AuthState): Promise<string | undefined> => {
    const basicAuth = btoa(`${this.clientId}:${this.clientSecret}`);

    const scope = encodeURIComponent(
      `manage_my_profile:${this.projectKey} manage_my_orders:${this.projectKey} view_published_products:${this.projectKey} manage_customers:${this.projectKey}`,
    );

    const body =
      auth.type === 'authenticated'
        ? `grant_type=password&username=${encodeURIComponent(auth.email)}&password=${encodeURIComponent(auth.password)}&scope=${scope}`
        : `grant_type=client_credentials&scope=manage_my_profile:${this.projectKey}`;

    const url =
      auth.type === 'authenticated'
        ? `${this.authUrl}/oauth/${this.projectKey}/customers/token` // Правильный URL для Password Flow
        : `${this.authUrl}/oauth/token`; // URL для Client Credentials Flow

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    if (!response.ok) {
      const error = await response.text();

      throw new Error(`Failed to fetch token: ${error}`);
    }

    const data: unknown = await response.json();

    if (data && typeof data === 'object' && 'access_token' in data && typeof data.access_token === 'string') {
      console.log('Access token:', data);

      return data.access_token;
    } else {
      console.error('Invalid token response:', data);
    }
  };

  public registerCustomer = async (
    email: string,
    password: string,
    //accessToken?: string,
    anonymousCartId?: string,
  ): Promise<void> => {
    if (!this.projectKey || !this.apiUrl) {
      throw new Error('Missing required config for Commercetools');
    }

    const body: Record<string, string | object> = {
      email,
      password,
    };

    if (anonymousCartId) {
      body.anonymousCart = {
        id: anonymousCartId,
        typeId: 'cart',
      };
    }

    try {
      const anonymusToken = await this.getAccessToken({ type: 'anonymous' });

      console.log(anonymusToken);

      const api = this.apiDefinition({ type: 'anonymous' });

      const response = await api
        .customers()
        .post({
          body: {
            email: email,
            password: password,
          },
        })
        .execute();

      console.log('Customer created:', response.body);

      // optionally: login and get token
      const token = await this.getAccessToken({ type: 'authenticated', email: email, password: password });

      if (token) {
        const response = await this.signInCustomer(email, password, token);

        console.log(response);
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  public signInCustomer = async (
    email: string,
    password: string,
    accessToken: string,
    anonymousCartId?: string,
  ): Promise<LoginResponse | undefined> => {
    if (!this.projectKey || !this.apiUrl) {
      throw new Error('Missing required config for Commercetools');
    }

    const url = `${this.apiUrl}/${this.projectKey}/login`;

    const body: Record<string, string | object> = {
      email,
      password,
    };

    if (anonymousCartId) {
      body.anonymousCart = {
        id: anonymousCartId,
        typeId: 'cart',
      };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();

      throw new Error(`Login failed: ${error}`);
    }

    const data: unknown = await response.json();

    if (data && typeof data === 'object') {
      return data;
    }
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
        })
        .withHttpMiddleware({ host: this.apiUrl })
        .build();
    } else {
      return builder
        .withClientCredentialsFlow({
          host: this.authUrl,
          projectKey,
          credentials: {
            clientId,
            clientSecret,
          },
        })
        .withHttpMiddleware({ host: this.apiUrl })
        .build();
    }
  };
}

export const authService = AuthorizationService.getInstance();
