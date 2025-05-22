import type { CustomerSignInResult } from '@commercetools/platform-sdk';
import { describe, expect, test, vi } from 'vitest';

import { AuthorizationService, authService } from '../commerce-tools/auth-service';

describe('Check for singleton', () => {
  test('should return instance if this instance doesn`t exist', () => {
    // @ts-expect-error: overriding private property for testing
    authService.instance = undefined;
    const instance1: AuthorizationService = AuthorizationService.getInstance();

    expect(instance1).toBeInstanceOf(AuthorizationService);
    const instance2 = AuthorizationService.getInstance();

    expect(instance1).toBe(instance2);
  });
});

describe('Return authenticated status', () => {
  test('shoud return an authenticated status of user', () => {
    // @ts-expect-error: overriding private property for testing
    authService.isAuthenticated = false;
    expect(authService.getAuthenticatedStatus()).toBe(false);
  });
});

describe('Login error because of absents of project key', () => {
  test('shoud return an error if project key = undefined', async () => {
    // @ts-expect-error: overriding private property for testing
    authService.projectKey = '';

    await expect(authService.signInCustomer('email@test.com', 'password')).rejects.toThrow(
      'Missing required project key for Commercetools',
    );
  });
});

describe('Login response type test', () => {
  test('should match CustomerSignInResult structure', async () => {
    const mockResponse: CustomerSignInResult = {
      customer: {
        id: '123456',
        version: 1,
        createdAt: '2024-01-01T00:00:00.000Z',
        lastModifiedAt: '2024-01-01T00:00:00.000Z',
        email: 'test@example.com',
        isEmailVerified: true,
        addresses: [],
        shippingAddressIds: [],
        billingAddressIds: [],
        stores: [],
        authenticationMode: 'ExternalAuth',
      },
      cart: undefined,
    };

    vi.spyOn(authService, 'signInCustomer').mockResolvedValueOnce(mockResponse);

    const result = await authService.signInCustomer('test@example.com', 'password');

    expect(result?.customer.email).toBe('test@example.com');
  });
});
