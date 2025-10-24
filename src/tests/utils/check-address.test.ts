import type { Customer } from '@commercetools/platform-sdk';
import { describe, expect, it } from 'vitest';

import { CheckAddress } from '../../shared/utils/check-adress';

describe('CheckAddress.sortAddresses', () => {
  const mockCustomer: Customer = {
    id: 'test-id',
    version: 1,
    createdAt: '',
    lastModifiedAt: '',
    createdBy: {
      clientId: 'test-client-id',
      anonymousId: 'anon-1',
    },
    lastModifiedBy: {
      clientId: 'test-client-id',
      anonymousId: 'anon-2',
    },
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    dateOfBirth: '1990-01-01',
    password: '',
    addresses: [
      {
        id: 'addr-1',
        country: 'DE',
        streetName: 'Main St',
        city: 'Berlin',
        postalCode: '10115',
      },
      {
        id: 'addr-2',
        country: 'DE',
        streetName: 'Second St',
        city: 'Hamburg',
        postalCode: '20095',
      },
      {
        id: 'addr-3',
        country: 'DE',
        streetName: 'Third St',
        city: 'Munich',
        postalCode: '80331',
      },
    ],
    defaultShippingAddressId: 'addr-1',
    shippingAddressIds: ['addr-2'],
    billingAddressIds: ['addr-3'],
    isEmailVerified: false,
    customerGroupAssignments: [],
    stores: [],
    authenticationMode: 'Password',
  };

  it('correctly classifies all types of addresses', () => {
    const result = CheckAddress.sortAddresses(mockCustomer);

    expect(result.defaultShippingAddress?.id).toBe('addr-1');
    expect(result.shippingAddress?.id).toBe('addr-2');
    expect(result.billingAddress?.id).toBe('addr-3');
  });

  it('returns undefined if default shipping address is not found', () => {
    const customerNoDefault: Customer = {
      ...mockCustomer,
      defaultShippingAddressId: 'non-existent-id',
    };

    const result = CheckAddress.sortAddresses(customerNoDefault);

    expect(result.defaultShippingAddress).toBeUndefined();
  });

  it('supports an address being both billing and shipping', () => {
    const customerSameAddress: Customer = {
      ...mockCustomer,
      defaultShippingAddressId: 'addr-1',
      billingAddressIds: ['addr-1'],
      shippingAddressIds: ['addr-1'],
    };

    const result = CheckAddress.sortAddresses(customerSameAddress);

    expect(result.defaultShippingAddress?.id).toBe('addr-1');
    expect(result.billingAddress?.id).toBe('addr-1');
    expect(result.shippingAddress?.id).toBe('addr-1');
  });
});
