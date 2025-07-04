import type { IFormValues } from '../models/interfaces';

export const MIN_AGE = 13;

export const COUNTRIES = [
  ['Belarus', 'BY'],
  ['Germany', 'DE'],
  ['USA', 'US'],
  ['UK', 'UK'],
];

export const MESSAGE_CONTENT: Partial<Record<keyof IFormValues, string>> = {
  email: 'Invalid email (example@email.com)',
  password:
    'Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 special character(!@#$%^&*) and 1 number, must not contain whitespace',
  name: 'Must contain at least one character and no special characters or numbers',
  surname: 'Must contain at least one character and no special characters or numbers',
  birthday: 'You must be at least 13 years old.',
  street: 'Must contain at least one character',
  city: 'Must contain at least one character and no special characters or numbers',
  postalCode:
    'You need to select a country and must follow the format for the country(BY "211111", DE "11111", US "11111-1111", GB "AA1A 1AA")',
  country: 'Please select a country',
  streetBilling: 'Must contain at least one character',
  cityBilling: 'Must contain at least one character and no special characters or numbers',
  postalCodeBilling: 'Must follow the format for the country(BY "211111", DE "11111", US "11111-1111", GB "AA1A 1AA")',
  countryBilling: 'Please select a country',
};
