export const MIN_AGE = 13;
export const COUNTRIES = ['Belarus', 'Germany', 'USA', 'UK'];
export const FORM_INITIALIZATION = {
  email: '',
  password: '',
  name: '',
  surname: '',
  birthday: '',

  street: '',
  city: '',
  ['postal-code']: '',
  country: '',

  ['street-billing']: '',
  ['city-billing']: '',
  ['postal-code-billing']: '',
  ['country-billing']: '',
};
export const VALIDATION_RESULT = {
  email: false,
  password: false,
  name: false,
  surname: false,
  birthday: false,

  street: false,
  city: false,
  ['postal-code']: false,
  country: false,

  ['street-billing']: false,
  ['city-billing']: false,
  ['postal-code-billing']: false,
  ['country-billing']: false,
};

export const MESSAGE_CONTENT = {
  email: 'Invalid email (example example@email.com)',
  password: 'Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number',
  name: 'Must contain at least one character and no special characters or numbers',
  surname: 'Must contain at least one character and no special characters or numbers',
  birthday: 'You must be at least 13 years old.',

  street: 'Must contain at least one character',
  city: 'Must contain at least one character and no special characters or numbers',
  ['postal-code']: 'Must follow the format for the country(BY "211111", DE "11111", US "11111-1111", GB "AA1A 1AA")',
  country: 'Please select a country',

  ['street-billing']: 'Must contain at least one character',
  ['city-billing']: 'Must contain at least one character and no special characters or numbers',
  ['postal-code-billing']:
    'Must follow the format for the country(BY "211111", DE "11111", US "11111-1111", GB "AA1A 1AA")',
  ['country-billing']: 'Please select a country',
};
