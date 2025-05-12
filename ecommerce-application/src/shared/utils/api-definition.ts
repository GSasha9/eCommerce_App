import { ClientBuilder, type Client } from '@commercetools/ts-client';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
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
      .withClientCredentialsFlow({
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

export const getAccessToken = async (auth: AuthState): Promise<string | undefined> => {
  const basicAuth = btoa(`${clientId}:${clientSecret}`);

  const body =
    auth.type === 'authenticated'
      ? `grant_type=password&username=${encodeURIComponent(auth.email)}&password=${encodeURIComponent(auth.password)}&scope=manage_my_profile manage_my_orders view_published_products`
      : `grant_type=client_credentials&scope=manage_my_profile:${projectKey}`;

  const response = await fetch(`${authUrl}/oauth/token`, {
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

  if (data && typeof data === 'object' && 'access_token' in data && typeof data.access_token === 'string')
    return data.access_token;
};
