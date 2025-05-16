import type { TokenCache, TokenStore } from '@commercetools/ts-client';
import { isTokenStore } from '../../shared/models/typeguards.ts';

export const tokenCache = (key: string): TokenCache => ({
  get: (): TokenStore => {
    const token = localStorage.getItem(key);

    console.log('get', key, token);

    if (token) {
      const parsed: unknown = JSON.parse(token);

      if (isTokenStore(parsed)) {
        return parsed;
      }
    }

    return { expirationTime: 0, token: '' };
  },
  set: (token): void => {
    console.log('set', key, token);

    localStorage.setItem(key, JSON.stringify(token));
  },
});
