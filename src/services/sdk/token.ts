import type { TokenCache, TokenStore } from '@commercetools/ts-client';
import { isTokenStore } from '../../shared/models/typeguards.ts/index.ts';

export const tokenCache = (key: string): TokenCache => ({
  get: (): TokenStore => {
    const token = localStorage.getItem(key);

    if (token) {
      const parsed: unknown = JSON.parse(token);

      if (isTokenStore(parsed)) {
        return parsed;
      }
    }

    return { expirationTime: 0, token: '' };
  },
  set: (token): void => {
    localStorage.setItem(key, JSON.stringify(token));
  },
});

export const getToken = (): string | null => {
  const userToken = tokenCache('ct_user_token').get().token;

  if (userToken) return `Bearer ${userToken}`;

  const anonymToken = tokenCache('ct_anon_token').get().token;

  if (userToken) return `Basic ${anonymToken}`;

  return null;
};
