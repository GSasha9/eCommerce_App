import { ClientBuilder, type Client } from '@commercetools/ts-client';
import {
  createApiBuilderFromCtpClient,
  type ClientResponse,
  type CustomerPagedQueryResponse,
} from '@commercetools/platform-sdk';
import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';

const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;
const authUrl = import.meta.env.VITE_CTP_AUTH_URL;
const clientId = import.meta.env.VITE_CTP_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CTP_CLIENT_SECRET;
const apiUrl = import.meta.env.VITE_CTP_API_URL;

// session type
type AuthState = { type: 'anonymous' } | { type: 'authenticated'; email: string; password: string };

// get client by state
const getClient = (auth: AuthState): Client => {
  if (!projectKey || !authUrl || !apiUrl || !clientId || !clientSecret) {
    throw new Error('Missing required env variables for Commercetools client');
  }

  const builder = new ClientBuilder();

  if (auth.type === 'authenticated') {
    return builder
      .withPasswordFlow({
        host: authUrl,
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
      .withHttpMiddleware({ host: apiUrl })
      .build();
  } else {
    return builder
      .withAnonymousSessionFlow({
        host: authUrl,
        projectKey,
        credentials: {
          clientId,
          clientSecret,
        },
      })
      .withHttpMiddleware({ host: apiUrl })
      .build();
  }
};

export const apiDefinition = (auth: AuthState): ByProjectKeyRequestBuilder => {
  const client = getClient(auth);

  return createApiBuilderFromCtpClient(client).withProjectKey({ projectKey });
};

//Anonymous user
// const api = apiDefinition({ type: 'anonymous' });

// Authenticated user
const api2 = apiDefinition({
  type: 'authenticated',
  email: 'test@example.com',
  password: '123456',
});

export const returnCustomerByEmail = (customerEmail: string): Promise<ClientResponse<CustomerPagedQueryResponse>> => {
  return api2
    .customers()
    .get({
      queryArgs: {
        where: `email="${customerEmail}"`,
      },
    })
    .execute();
};

export const createCustomer = (email: string, password: string): Promise<ClientResponse> => {
  return api2
    .customers()
    .post({
      body: {
        email: email,
        password: password,
      },
    })
    .execute();
};
