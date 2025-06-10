import { isStringFormName } from '../../../shared/models/typeguards.ts';
import { Validator } from '../../../shared/utils/validator.ts';

export interface IShippingAddressFormValues {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  streetBilling: string;
  cityBilling: string;
  postalCodeBilling: string;
  countryBilling: string;
}

export class ShippingAddressModalModel {
  private static instance: ShippingAddressModalModel;
  public currentFormValues: IShippingAddressFormValues;
  public errors: (keyof IShippingAddressFormValues)[];
  public isValidForm: boolean;

  private constructor() {
    // Initialize all fields as empty strings.
    this.currentFormValues = {
      street: '',
      city: '',
      postalCode: '',
      country: '',
      streetBilling: '',
      cityBilling: '',
      postalCodeBilling: '',
      countryBilling: '',
    };
    this.errors = [];
    this.isValidForm = true;
  }

  public static getInstance(): ShippingAddressModalModel {
    if (!ShippingAddressModalModel.instance) {
      ShippingAddressModalModel.instance = new ShippingAddressModalModel();
    }

    return ShippingAddressModalModel.instance;
  }

  public setStringValue(value: string, inputName: keyof IShippingAddressFormValues): void {
    if (isStringFormName(inputName)) {
      this.currentFormValues[inputName] = value;
    }
  }

  public validateForm(): void {
    this.errors.length = 0;

    // --- Validate Shipping Fields ---
    if (!this.currentFormValues.street) {
      this.errors.push('street');
    } else if (!Validator.isStreet(this.currentFormValues.street)) {
      this.errors.push('street');
    }

    if (!this.currentFormValues.city) {
      this.errors.push('city');
    } else if (!Validator.isCity(this.currentFormValues.city)) {
      this.errors.push('city');
    }

    if (!this.currentFormValues.postalCode) {
      this.errors.push('postalCode');
    } else if (!Validator.isPostalCode(this.currentFormValues.postalCode, this.currentFormValues.country)) {
      this.errors.push('postalCode');
    }

    if (!this.currentFormValues.country) {
      this.errors.push('country');
    }

    // --- Validate Billing Fields, only if any billing field is provided ---
    if (
      this.currentFormValues.streetBilling ||
      this.currentFormValues.cityBilling ||
      this.currentFormValues.postalCodeBilling ||
      this.currentFormValues.countryBilling
    ) {
      if (!this.currentFormValues.streetBilling) {
        this.errors.push('streetBilling');
      } else if (!Validator.isStreet(this.currentFormValues.streetBilling)) {
        this.errors.push('streetBilling');
      }

      if (!this.currentFormValues.cityBilling) {
        this.errors.push('cityBilling');
      } else if (!Validator.isCity(this.currentFormValues.cityBilling)) {
        this.errors.push('cityBilling');
      }

      if (!this.currentFormValues.postalCodeBilling) {
        this.errors.push('postalCodeBilling');
      } else if (
        !Validator.isPostalCode(this.currentFormValues.postalCodeBilling, this.currentFormValues.countryBilling)
      ) {
        this.errors.push('postalCodeBilling');
      }

      if (!this.currentFormValues.countryBilling) {
        this.errors.push('countryBilling');
      }
    }
  }

  public determineValidForm(): void {
    // Check that required shipping fields are not empty:
    const shippingValid =
      this.currentFormValues.street !== '' &&
      this.currentFormValues.city !== '' &&
      this.currentFormValues.postalCode !== '' &&
      this.currentFormValues.country !== '';

    // For billing fields, if any field is provided then all need to be non-empty.
    const billingAny =
      this.currentFormValues.streetBilling ||
      this.currentFormValues.cityBilling ||
      this.currentFormValues.postalCodeBilling ||
      this.currentFormValues.countryBilling;
    let billingValid = true;

    if (billingAny) {
      billingValid =
        this.currentFormValues.streetBilling !== '' &&
        this.currentFormValues.cityBilling !== '' &&
        this.currentFormValues.postalCodeBilling !== '' &&
        this.currentFormValues.countryBilling !== '';
    }

    this.isValidForm = this.errors.length === 0 && shippingValid && billingValid;
  }
}

export default ShippingAddressModalModel;
