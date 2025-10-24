import type { Customer } from '@commercetools/platform-sdk';
import { describe, expect, it } from 'vitest';

import { CheckAddress } from '../../shared/utils/check-adress';

describe('CheckAddress.sortAddresses', () => {
  const customer: Customer = {
    id: '1',
    version: 1,
    createdAt: '',
    lastModifiedAt: '',
    email: 'test@test.com',
    addresses: [
      { id: 'a1', country: 'US' },
      { id: 'a2', country: 'DE' },
      { id: 'a3', country: 'FR' },
    ],
    defaultShippingAddressId: 'a1',
    billingAddressIds: ['a2'],
    shippingAddressIds: ['a3'],
    isEmailVerified: false,
    authenticationMode: 'Password',
    stores: [],
  };

  it('return defaultShippingAddress', () => {
    const result = CheckAddress.sortAddresses(customer);

    expect(result.defaultShippingAddress?.id).toBe('a1');
  });

  it('return billingAddress', () => {
    const result = CheckAddress.sortAddresses(customer);

    expect(result.billingAddress?.id).toBe('a2');
  });

  it('return shippingAddress', () => {
    const result = CheckAddress.sortAddresses(customer);

    expect(result.shippingAddress?.id).toBe('a3');
  });

  it('return empty object', () => {
    const emptyCustomer: Customer = {
      id: '2',
      version: 1,
      createdAt: '',
      lastModifiedAt: '',
      email: '',
      addresses: [],
      isEmailVerified: false,
      authenticationMode: 'Password',
      stores: [],
    };

    const result = CheckAddress.sortAddresses(emptyCustomer);

    expect(result).toEqual({});
  });
});
