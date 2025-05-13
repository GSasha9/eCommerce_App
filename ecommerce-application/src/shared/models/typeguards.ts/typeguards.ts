import type { IFormValues } from '../interfaces';

export const isHTMLInputElement = (value: unknown): value is HTMLInputElement => value instanceof HTMLInputElement;
export const isHTMLSelectElement = (value: unknown): value is HTMLSelectElement => value instanceof HTMLSelectElement;
export const isHTMLCheckboxElement = (value: unknown): value is HTMLInputElement & { type: 'checkbox' } =>
  value instanceof HTMLInputElement && value.type === 'checkbox';

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
