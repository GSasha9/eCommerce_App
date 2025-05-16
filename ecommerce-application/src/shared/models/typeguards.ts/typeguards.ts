import type { TokenStore } from '@commercetools/ts-client';
import type { IFormValues, IResponce } from '../interfaces';
import type { CommercetoolsApiError } from '../type/commercetools-api-errors';

export const isHTMLElement = (value: unknown): value is HTMLElement => value instanceof HTMLElement;
export const isHTMLInputElement = (value: unknown): value is HTMLInputElement => value instanceof HTMLInputElement;
export const isHTMLSelectElement = (value: unknown): value is HTMLSelectElement => value instanceof HTMLSelectElement;
export const isHTMLCheckboxElement = (value: unknown): value is HTMLInputElement & { type: 'checkbox' } =>
  value instanceof HTMLInputElement && value.type === 'checkbox';

export const isResponce = (value: unknown): value is IResponce =>
  Boolean(
    value &&
      typeof value === 'object' &&
      'access_token' in value &&
      typeof value['access_token'] === 'number' &&
      'expires_in' in value &&
      typeof value['expires_in'] === 'string' &&
      'token_type' in value &&
      typeof value['token_type'] === 'string' &&
      'scope' in value &&
      typeof value.scope === 'string' &&
      'refresh_token' in value &&
      typeof value['refresh_token'] === 'string',
  );

export const isTokenStore = (obj: unknown): obj is TokenStore => {
  return Boolean(
    obj &&
      typeof obj === 'object' &&
      'token' in obj &&
      typeof obj.token === 'string' &&
      'expirationTime' in obj &&
      typeof obj.expirationTime === 'number',
  );
};
export const isCommercetoolsApiError = (value: unknown): value is CommercetoolsApiError =>
  typeof value === 'object' &&
  value !== null &&
  'body' in value &&
  typeof value.body === 'object' &&
  value.body !== null &&
  'statusCode' in value &&
  typeof value.statusCode === 'number' &&
  'errors' in value.body &&
  Array.isArray(value.body.errors) &&
  value.body.errors.length >= 1;

export const isFormName = (value: unknown): value is keyof IFormValues =>
  isBooleanFormName(value) || isStringFormName(value);
export const isBooleanFormName = (
  value: unknown,
): value is Extract<keyof IFormValues, 'is-default-shipping' | 'is-shipping-as-billing' | 'is-default-billing'> =>
  value === 'is-default-shipping' || value === 'is-shipping-as-billing' || value === 'is-default-billing';
export const isStringFormName = (
  value: unknown,
): value is Exclude<keyof IFormValues, 'is-default-shipping' | 'is-shipping-as-billing' | 'is-default-billing'> =>
  value === 'email' ||
  value === 'password' ||
  value === 'name' ||
  value === 'surname' ||
  value === 'birthday' ||
  value === 'street' ||
  value === 'city' ||
  value === 'postal-code' ||
  value === 'country' ||
  value === 'street-billing' ||
  value === 'city-billing' ||
  value === 'postal-code-billing' ||
  value === 'country-billing';
