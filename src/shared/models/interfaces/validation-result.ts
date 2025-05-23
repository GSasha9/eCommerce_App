export interface IValidationResult {
  email: boolean;
  password: boolean;
  name: boolean;
  surname: boolean;
  birthday: boolean;
  street: boolean;
  city: boolean;
  'postal-code': boolean;
  country: boolean;
  'street-billing': boolean;
  'city-billing': boolean;
  'postal-code-billing': boolean;
  'country-billing': boolean;
}
