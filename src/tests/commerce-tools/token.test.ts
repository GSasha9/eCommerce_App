import type { TokenStore } from '@commercetools/ts-client';
import { beforeEach, describe, expect, it } from 'vitest';

import { getToken, tokenCache } from '../../commerce-tools/models/utils/token';

const validToken: TokenStore = {
  token: 'abc123',
  expirationTime: Date.now() + 1000,
};

describe('tokenCache', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return token if valid token is stored', () => {
    localStorage.setItem('my_token', JSON.stringify(validToken));

    const cache = tokenCache('my_token');
    const result = cache.get();

    expect(result.token).toBe('abc123');
  });

  it('should return empty token if token not found', () => {
    const cache = tokenCache('not_found_token');
    const result = cache.get();

    expect(result.token).toBe('');
    expect(result.expirationTime).toBe(0);
  });
});

describe('getToken', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return Bearer token if user token exists', () => {
    localStorage.setItem('ct_user_token', JSON.stringify(validToken));

    expect(getToken()).toBe('Bearer abc123');
  });

  it('should return Basic token if only anon token exists', () => {
    localStorage.setItem('ct_anon_token', JSON.stringify(validToken));

    expect(getToken()).toBe('Basic abc123');
  });

  it('should return null if no tokens exist', () => {
    expect(getToken()).toBeNull();
  });
});
