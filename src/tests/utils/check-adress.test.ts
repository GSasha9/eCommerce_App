import type { Customer } from '@commercetools/platform-sdk';
import { describe, expect, it } from 'vitest';

import { CheckAddress } from '../../shared/utils/check-adress';

describe('CheckAddress.sortAddresses', () => {
  const mockCustomer: Customer = {
    id: 'cust-1',
    version: 1,
    createdAt: '',
    lastModifiedAt: '',
    email: 'test@example.com',
    addresses: [
      { id: 'addr-1', country: 'US' },
      { id: 'addr-2', country: 'DE' },
      { id: 'addr-3', country: 'FR' },
    ],
    defaultShippingAddressId: 'addr-1',
    shippingAddressIds: ['addr-3'],
    billingAddressIds: ['addr-2'],
    isEmailVerified: false,
    authenticationMode: 'Password',
    stores: [],
  };

  it('should return correct defaultShippingAddress', () => {
    const result = CheckAddress.sortAddresses(mockCustomer);

    expect(result.defaultShippingAddress?.id).toBe('addr-1');
  });

  it('should return correct billingAddress', () => {
    const result = CheckAddress.sortAddresses(mockCustomer);

    expect(result.billingAddress?.id).toBe('addr-2');
  });

  it('should return correct shippingAddress', () => {
    const result = CheckAddress.sortAddresses(mockCustomer);

    expect(result.shippingAddress?.id).toBe('addr-3');
  });

  it('should return empty object', () => {
    const emptyCustomer: Customer = {
      id: 'empty',
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
