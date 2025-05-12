export interface IFormValues {
  email: string;
  password: string;
  name: string;
  surname: string;
  birthday: string;
  street: string;
  city: string;
  'postal-code': string;
  country: string;
  'street-billing': string;
  'city-billing': string;
  'postal-code-billing': string;
  'country-billing': string;
  ['is-default-shipping']?: boolean;
  ['is-shipping-as-billing']?: boolean;
  ['is-default-billing']?: boolean;
}
