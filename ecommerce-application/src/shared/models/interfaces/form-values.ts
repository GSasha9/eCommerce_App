export interface IFormValues {
  email: string;
  password: string;
  name: string;
  surname: string;
  birthday: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  streetBilling: string;
  cityBilling: string;
  postalCodeBilling: string;
  countryBilling: string;
  isDefaultShipping?: boolean;
  isShippingAsBilling?: boolean;
  isDefaultBilling?: boolean;
}
