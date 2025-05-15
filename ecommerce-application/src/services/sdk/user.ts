import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ClientBuilder } from '@commercetools/ts-client';
import { tokenCache } from './token';

const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;
const authUrl = import.meta.env.VITE_CTP_AUTH_URL;
const clientId = import.meta.env.VITE_CTP_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CTP_CLIENT_SECRET;
const scopes = import.meta.env.VITE_CTP_SCOPES.split(' ').map((item) => `${item}:${projectKey}`);
const apiUrl = import.meta.env.VITE_CTP_API_URL;

export function createCustomerApi(email: string, password: string): ByProjectKeyRequestBuilder {
  const client = new ClientBuilder()
    .withPasswordFlow({
      host: authUrl,
      projectKey,
      credentials: { clientId, clientSecret, user: { username: email, password } },
      scopes,
      tokenCache: tokenCache('ct_user_token'),
      httpClient: fetch,
    })
    .withHttpMiddleware({ host: apiUrl, httpClient: fetch })
    .build();

  return createApiBuilderFromCtpClient(client).withProjectKey({ projectKey });
}
