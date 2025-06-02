import type { Customer } from '@commercetools/platform-sdk';

type AddressType = Customer['addresses'][number];

interface SortedAddresses {
  defaultShippingAddress?: AddressType;
  billingAddress?: AddressType;
  shippingAddress?: AddressType;
}

export class CheckAddress {
  public static sortAddresses(data: Customer): SortedAddresses {
    const billingAddressIds = Array.isArray(data.billingAddressIds) ? data.billingAddressIds : [];
    const shippingAddressIds = Array.isArray(data.shippingAddressIds) ? data.shippingAddressIds : [];

    const res: SortedAddresses = {};

    for (const address of data.addresses) {
      if (address.id === data.defaultShippingAddressId) {
        res.defaultShippingAddress = address;
      }

      if (address.id && billingAddressIds.includes(address.id)) {
        res.billingAddress = address;
      }

      if (address.id && shippingAddressIds.includes(address.id)) {
        res.shippingAddress = address;
      }
    }

    return res;
  }
}
