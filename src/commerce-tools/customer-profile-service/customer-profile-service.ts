import type { Customer, MyCustomerUpdate, MyCustomerUpdateAction } from '@commercetools/platform-sdk';
import type { ClientResponse } from '@commercetools/ts-client';

import { route } from '../../router';
import { isCustomer } from '../../shared/models/typeguards.ts/account-type-guards.ts';
import { UserState } from '../../state/customer-state.ts';
import { authService } from '../auth-service';

export class CustomerProfileService {
  public static async updateCustomerData(updatedData: {
    version: number;
    dateOfBirth?: string;
    firstName?: string;
    lastName?: string;
    newAddresses?: Array<{ country: string; streetName: string; postalCode: string; city: string }>;
    defaultShippingAddress?: string;
    defaultBillingAddress?: string;
    addShippingAddressId?: string;
    addBillingAddressId?: string;
    email?: string;
  }): Promise<Customer> {
    const actions: MyCustomerUpdateAction[] = [];

    if (updatedData.firstName) {
      actions.push({ action: 'setFirstName', firstName: updatedData.firstName });
    }

    if (updatedData.lastName) {
      actions.push({ action: 'setLastName', lastName: updatedData.lastName });
    }

    if (updatedData.dateOfBirth) {
      actions.push({ action: 'setDateOfBirth', dateOfBirth: updatedData.dateOfBirth });
    }

    const currentCustomer = UserState.getInstance().customer;

    if (updatedData.newAddresses && currentCustomer?.addresses) {
      updatedData.newAddresses.forEach((newAddress, index) => {
        const currentAddress = currentCustomer.addresses[index];

        if (currentAddress && currentAddress.id) {
          actions.push({
            action: 'changeAddress',
            addressId: currentAddress.id,
            address: newAddress,
          });
        }
      });
    }

    if (typeof updatedData.defaultShippingAddress === 'string') {
      actions.push({
        action: 'setDefaultShippingAddress',
        addressId: updatedData.defaultShippingAddress,
      });
    }

    if (typeof updatedData.defaultBillingAddress === 'string') {
      actions.push({
        action: 'setDefaultBillingAddress',
        addressId: updatedData.defaultBillingAddress,
      });
    }

    if (typeof updatedData.addShippingAddressId === 'string') {
      actions.push({
        action: 'addShippingAddressId',
        addressId: updatedData.addShippingAddressId,
      });
    }

    if (typeof updatedData.addBillingAddressId === 'string') {
      actions.push({
        action: 'addBillingAddressId',
        addressId: updatedData.addBillingAddressId,
      });
    }

    const payload: MyCustomerUpdate = {
      version: updatedData.version,
      actions,
    };

    const response = await authService.api
      .me()
      .post({
        body: payload,
        headers: { 'Content-Type': 'application/json' },
      })
      .execute();

    return response.body;
  }

  public static async updateBillingAddressData(updatedData: {
    version: number;
    addressId: string;
    address: {
      streetName: string;
      city: string;
      postalCode: string;
      country: string;
    };
  }): Promise<Customer | undefined> {
    interface BillingAddressAction {
      action: 'changeAddress';
      addressId: string;
      address: {
        streetName: string;
        city: string;
        postalCode: string;
        country: string;
      };
    }

    const actions: BillingAddressAction[] = [
      {
        action: 'changeAddress',
        addressId: updatedData.addressId,
        address: updatedData.address,
      },
    ];

    interface BillingAddressUpdate {
      version: number;
      actions: BillingAddressAction[];
    }

    const payload: BillingAddressUpdate = {
      version: updatedData.version,
      actions,
    };

    try {
      const response: ClientResponse<Customer> = await authService.api
        .me()
        .post({
          body: payload,
          headers: { 'Content-Type': 'application/json' },
        })
        .execute();

      return response.body;
    } catch (error) {
      console.warn(error);

      return undefined;
    }
  }

  public static async fetchCustomerData(): Promise<Customer | undefined> {
    if (!authService.getAuthenticatedStatus()) {
      authService.logOutCustomer();
      localStorage.clear();
      route.navigate('/home');

      return undefined;
    }

    try {
      const response: ClientResponse<Customer> = await authService.api
        .me()
        .get({
          headers: { 'Content-Type': 'application/json' },
        })
        .execute();

      if (isCustomer(response.body)) {
        return response.body;
      } else {
        throw new Error('Invalid customer data');
      }
    } catch (error) {
      console.warn(error);
      route.navigate('/home');
      localStorage.clear();
      throw error;
    }
  }

  public static async setDefaultShippingAddress(addressId: string, version: number): Promise<Customer | undefined> {
    const payload: MyCustomerUpdate = {
      version,
      actions: [
        {
          action: 'setDefaultShippingAddress',
          addressId,
        },
      ],
    };

    try {
      const response: ClientResponse<Customer> = await authService.api
        .me()
        .post({
          body: payload,
          headers: { 'Content-Type': 'application/json' },
        })
        .execute();

      return response.body;
    } catch (error) {
      console.warn(error);

      return undefined;
    }
  }

  public static async setDefaultBillingAddress(addressId: string, version: number): Promise<Customer | undefined> {
    const payload: MyCustomerUpdate = {
      version,
      actions: [
        {
          action: 'setDefaultBillingAddress',
          addressId,
        },
      ],
    };

    try {
      const response: ClientResponse<Customer> = await authService.api
        .me()
        .post({
          body: payload,
          headers: { 'Content-Type': 'application/json' },
        })
        .execute();

      return response.body;
    } catch (error) {
      console.warn(error);

      return undefined;
    }
  }

  public static async addCustomerAdressData(updatedData: {
    version: number;
    newAddresses?: Array<{
      country: string;
      streetName: string;
      postalCode: string;
      city: string;
    }>;
    newBillingAddresses?: Array<{
      country: string;
      streetName: string;
      postalCode: string;
      city: string;
    }>;
    defaultShippingAddress?: string;
    defaultBillingAddress?: string;
    email?: string;
  }): Promise<Customer | undefined> {
    const actions: MyCustomerUpdateAction[] = [];

    if (updatedData.newAddresses && updatedData.newAddresses.length > 0) {
      updatedData.newAddresses.forEach(
        (newAddress: { country: string; streetName: string; postalCode: string; city: string }): void => {
          actions.push({
            action: 'addAddress',
            address: newAddress,
          });
        },
      );
    }

    if (updatedData.newBillingAddresses && updatedData.newBillingAddresses.length > 0) {
      updatedData.newBillingAddresses.forEach(
        (newBillingAddress: { country: string; streetName: string; postalCode: string; city: string }): void => {
          actions.push({
            action: 'addAddress',
            address: newBillingAddress,
          });
        },
      );
    }

    if (typeof updatedData.defaultShippingAddress === 'string') {
      actions.push({
        action: 'setDefaultShippingAddress',
        addressId: updatedData.defaultShippingAddress,
      });
    }

    if (typeof updatedData.defaultBillingAddress === 'string') {
      actions.push({
        action: 'setDefaultBillingAddress',
        addressId: updatedData.defaultBillingAddress,
      });
    }

    const payload: MyCustomerUpdate = {
      version: updatedData.version,
      actions,
    };

    try {
      const response: ClientResponse<Customer> = await authService.api
        .me()
        .post({
          body: payload,
          headers: { 'Content-Type': 'application/json' },
        })
        .execute();

      UserState.getInstance().customer = response.body;

      return response.body;
    } catch (error) {
      console.warn(error);
      throw error;
    }
  }

  public static async deleteBillingAddressData(updatedData: {
    version: number;
    addressId: string;
  }): Promise<Customer | undefined> {
    interface RemoveAddressAction {
      action: 'removeAddress';
      addressId: string;
    }
    const actions: RemoveAddressAction[] = [];

    actions.push({
      action: 'removeAddress',
      addressId: updatedData.addressId,
    });
    const payload = {
      version: updatedData.version,
      actions,
    };

    const response: ClientResponse<Customer> = await authService.api
      .me()
      .post({
        body: payload,
        headers: { 'Content-Type': 'application/json' },
      })
      .execute();

    return response.body;
  }

  public static async removeBillingAddressId(updatedData: {
    version: number;
    addressId: string;
  }): Promise<Customer | undefined> {
    interface RemoveBillingAddressAction {
      action: 'removeBillingAddressId';
      addressId: string;
    }
    const actions: RemoveBillingAddressAction[] = [];

    actions.push({
      action: 'removeBillingAddressId',
      addressId: updatedData.addressId,
    });
    const payload = {
      version: updatedData.version,
      actions,
    };

    try {
      const response: ClientResponse<Customer> = await authService.api
        .me()
        .post({
          body: payload,
          headers: { 'Content-Type': 'application/json' },
        })
        .execute();

      return response.body;
    } catch (error) {
      console.warn(error);

      return undefined;
    }
  }

  public static async removeShippingAddressId(updatedData: {
    version: number;
    addressId: string;
  }): Promise<Customer | undefined> {
    interface RemoveShippingAddressAction {
      action: 'removeShippingAddressId';
      addressId: string;
    }
    const actions: RemoveShippingAddressAction[] = [];

    actions.push({
      action: 'removeShippingAddressId',
      addressId: updatedData.addressId,
    });
    const payload = {
      version: updatedData.version,
      actions,
    };

    try {
      const response: ClientResponse<Customer> = await authService.api
        .me()
        .post({
          body: payload,
          headers: { 'Content-Type': 'application/json' },
        })
        .execute();

      return response.body;
    } catch (error) {
      console.warn(error);

      return undefined;
    }
  }

  private static async sendAddressAction(
    version: number,
    actionPayload: MyCustomerUpdateAction,
  ): Promise<Customer | undefined> {
    const actions: MyCustomerUpdateAction[] = [actionPayload];
    const payload: MyCustomerUpdate = {
      version,
      actions,
    };
    const response: ClientResponse<Customer> = await authService.api
      .me()
      .post({
        body: payload,
        headers: { 'Content-Type': 'application/json' },
      })
      .execute();

    UserState.getInstance().customer = response.body;

    return response.body;
  }

  public static async updateCustomerAddress(
    addressId: string,
    options: { billing?: boolean; shipping?: boolean },
  ): Promise<Customer | undefined> {
    if (!addressId) {
      throw new Error('Missing addressId');
    }

    const currentCustomer: Customer | undefined = UserState.getInstance().customer;

    if (!currentCustomer) {
      return undefined;
    }

    let updatedCustomer: Customer | undefined = currentCustomer;

    if (options.billing && !options.shipping) {
      updatedCustomer = await CustomerProfileService.sendAddressAction(updatedCustomer.version, {
        action: 'addBillingAddressId',
        addressId: addressId,
      });
    } else if (options.shipping && !options.billing) {
      updatedCustomer = await CustomerProfileService.sendAddressAction(updatedCustomer.version, {
        action: 'addShippingAddressId',
        addressId: addressId,
      });
    } else if (options.billing && options.shipping) {
      updatedCustomer = await CustomerProfileService.sendAddressAction(updatedCustomer.version, {
        action: 'addBillingAddressId',
        addressId: addressId,
      });

      if (updatedCustomer && 'version' in updatedCustomer) {
        updatedCustomer = await CustomerProfileService.sendAddressAction(updatedCustomer.version, {
          action: 'addShippingAddressId',
          addressId: addressId,
        });
      }
    } else {
      return undefined;
    }

    return updatedCustomer;
  }
}

export const customerProfileService = new CustomerProfileService();
