// import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
// import { ClientBuilder } from '@commercetools/ts-client';
// import { tokenCache } from './token';

// const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;
// const authUrl = import.meta.env.VITE_CTP_AUTH_URL;
// const clientId = import.meta.env.VITE_CTP_CLIENT_ID;
// const clientSecret = import.meta.env.VITE_CTP_CLIENT_SECRET;
// const scopes = import.meta.env.VITE_CTP_SCOPES.split(' ').map((item) => `${item}:${projectKey}`);
// const apiUrl = import.meta.env.VITE_CTP_API_URL;

// const client = new ClientBuilder()
//   .withAnonymousSessionFlow({
//     host: authUrl,
//     projectKey,
//     credentials: { clientId, clientSecret },
//     scopes,
//     httpClient: fetch,
//     tokenCache: tokenCache('ct_anon_token'), //чтобы сохранять токен между перезагрузками страницы, не делать авторизацию каждый раз. Позволяет SDK автоматически обновлять токен
//   })
//   .withHttpMiddleware({ host: apiUrl, httpClient: fetch })
//   .build();

// export const anonymousApi = createApiBuilderFromCtpClient(client).withProjectKey({ projectKey });
