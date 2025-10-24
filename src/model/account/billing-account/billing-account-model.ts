import { isStringFormName } from '../../../shared/models/typeguards.ts';
import { Validator } from '../../../shared/utils/validator.ts';

// Define a simple interface for billing address fields.
export interface IBillingAddressFormValues {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export class BillingAddressModalModel {
  private static instance: BillingAddressModalModel;
  public currentFormValues: IBillingAddressFormValues;
  public errors: (keyof IBillingAddressFormValues)[];

  public isValidForm: boolean;

  public constructor() {
    this.currentFormValues = {
      street: '',
      city: '',
      postalCode: '',
      country: '',
    };
    this.errors = [];
    this.isValidForm = true;
  }

  public static getInstance(): BillingAddressModalModel {
    if (!BillingAddressModalModel.instance) {
      BillingAddressModalModel.instance = new BillingAddressModalModel();
    }

    return BillingAddressModalModel.instance;
  }

  public setStringValue(value: string, inputName: keyof IBillingAddressFormValues): void {
    if (isStringFormName(inputName)) {
      this.currentFormValues[inputName] = value;
    }
  }

  public validateForm(): void {
    this.errors.length = 0;

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
  }

  public determineValidForm(): void {
    const allFieldsFilled =
      this.currentFormValues.street !== '' &&
      this.currentFormValues.city !== '' &&
      this.currentFormValues.postalCode !== '' &&
      this.currentFormValues.country !== '';

    this.isValidForm = this.errors.length === 0 && allFieldsFilled;
  }
}
