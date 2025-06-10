import type { IShippingAddressFormValues } from '../../../model/account/new-adress/new-adress.ts';
import type { IFormValues } from '../interfaces/index.ts';
import { isStringFormName } from './typeguards.ts';

interface LastModifiedBy {
  clientId: string;
  isPlatformClient: boolean;
  anonymousId: string;
}

export function isValidErrorKey(key: string): key is keyof IShippingAddressFormValues {
  return key === 'street' || key === 'city' || key === 'postalCode' || key === 'country';
}

interface CustomerRef {
  typeId: string;
  id: string;
}

interface CreatedBy {
  clientId: string;
  isPlatformClient: boolean;
  customer: CustomerRef;
}

interface Address {
  id: string;
  streetName: string;
  postalCode: string;
  city: string;
  country: string;
}

interface Customer {
  id: string;
  version: number;
  versionModifiedAt: string;
  lastMessageSequenceNumber: number;
  createdAt: string;
  lastModifiedAt: string;
  lastModifiedBy: LastModifiedBy;
  createdBy: CreatedBy;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  password: string;
  addresses: Address[];
  shippingAddressIds: string[];
  billingAddressIds: string[];
  isEmailVerified: boolean;
  authenticationMode: string;
}

export const isFormNameAcc = (value: unknown): value is keyof Omit<IFormValues, 'email' | 'password'> =>
  isBooleanFormName(value) || isStringFormName(value);

export const isBooleanFormName = (
  value: unknown,
): value is Extract<keyof IFormValues, 'isDefaultShipping' | 'isShippingAsBilling' | 'isDefaultBilling'> =>
  value === 'isDefaultShipping' || value === 'isShippingAsBilling' || value === 'isDefaultBilling';

function isObject(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === 'object' && obj !== null;
}

function isLastModifiedBy(obj: unknown): obj is LastModifiedBy {
  if (!isObject(obj)) return false;

  const clientId = obj['clientId'];
  const isPlatformClient = obj['isPlatformClient'];
  const anonymousId = obj['anonymousId'];

  return typeof clientId === 'string' && typeof isPlatformClient === 'boolean' && typeof anonymousId === 'string';
}

function isCustomerRef(obj: unknown): obj is CustomerRef {
  if (!isObject(obj)) return false;

  const typeId = obj['typeId'];
  const id = obj['id'];

  return typeof typeId === 'string' && typeof id === 'string';
}

function isCreatedBy(obj: unknown): obj is CreatedBy {
  if (!isObject(obj)) return false;

  const clientId = obj['clientId'];
  const isPlatformClient = obj['isPlatformClient'];
  const customer = obj['customer'];

  return typeof clientId === 'string' && typeof isPlatformClient === 'boolean' && isCustomerRef(customer);
}

function isAddress(obj: unknown): obj is Address {
  if (!isObject(obj)) return false;

  const id = obj['id'];
  const streetName = obj['streetName'];
  const postalCode = obj['postalCode'];
  const city = obj['city'];
  const country = obj['country'];

  return (
    typeof id === 'string' &&
    (streetName === undefined || typeof streetName === 'string') &&
    (postalCode === undefined || typeof postalCode === 'string') &&
    (city === undefined || typeof city === 'string') &&
    (country === undefined || typeof country === 'string')
  );
}

export function isCustomer(obj: unknown): obj is Customer {
  if (!isObject(obj)) return false;

  const id = obj['id'];
  const version = obj['version'];
  const versionModifiedAt = obj['versionModifiedAt'];
  const lastMessageSequenceNumber = obj['lastMessageSequenceNumber'];
  const createdAt = obj['createdAt'];
  const lastModifiedAt = obj['lastModifiedAt'];
  const lastModifiedBy = obj['lastModifiedBy'];
  const createdBy = obj['createdBy'];
  const email = obj['email'];
  const firstName = obj['firstName'];
  const lastName = obj['lastName'];
  const dateOfBirth = obj['dateOfBirth'];
  const password = obj['password'];
  const addresses = obj['addresses'];
  const defaultShippingAddressId = obj['defaultShippingAddressId'];
  const shippingAddressIds = obj['shippingAddressIds'];
  const billingAddressIds = obj['billingAddressIds'];
  const isEmailVerified = obj['isEmailVerified'];
  const customerGroupAssignments = obj['customerGroupAssignments'];
  const stores = obj['stores'];
  const authenticationMode = obj['authenticationMode'];

  return (
    typeof id === 'string' &&
    typeof version === 'number' &&
    typeof versionModifiedAt === 'string' &&
    typeof lastMessageSequenceNumber === 'number' &&
    typeof createdAt === 'string' &&
    typeof lastModifiedAt === 'string' &&
    isLastModifiedBy(lastModifiedBy) &&
    isCreatedBy(createdBy) &&
    typeof email === 'string' &&
    typeof firstName === 'string' &&
    typeof lastName === 'string' &&
    typeof dateOfBirth === 'string' &&
    typeof password === 'string' &&
    Array.isArray(addresses) &&
    addresses.every(isAddress) &&
    typeof defaultShippingAddressId === 'string' &&
    Array.isArray(shippingAddressIds) &&
    shippingAddressIds.every((id: unknown) => typeof id === 'string') &&
    Array.isArray(billingAddressIds) &&
    billingAddressIds.every((id: unknown) => typeof id === 'string') &&
    typeof isEmailVerified === 'boolean' &&
    Array.isArray(customerGroupAssignments) &&
    Array.isArray(stores) &&
    typeof authenticationMode === 'string'
  );
}

export const isShippingAddressKey = (value: unknown): value is keyof Omit<IFormValues, 'email' | 'password'> => {
  return typeof value === 'string' && value !== 'email' && value !== 'password';
};

export function isShippingAddressFormKey(key: string): key is keyof IShippingAddressFormValues {
  return (
    key === 'street' ||
    key === 'city' ||
    key === 'postalCode' ||
    key === 'country' ||
    key === 'streetBilling' ||
    key === 'cityBilling' ||
    key === 'postalCodeBilling' ||
    key === 'countryBilling'
  );
}
