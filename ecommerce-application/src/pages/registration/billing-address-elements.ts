import type { IParameters } from '../../shared/models/interfaces/index.ts';
import { CreateElement } from '../../shared/utils/create-element.ts';
import './registration.scss';
import { CreateInput } from '../../components/input/create-input.ts';
import { Label } from '../../components/label/label.ts';

export class BillingAddressElements extends CreateElement {
  public addressLabel: Label;
  public cityLabel: Label;
  public countryLabel: Label;
  public postalCodeLabel: Label;
  public defaultLabel: Label;

  public inputAddress: CreateInput;
  public inputCity: CreateInput;
  public inputCountry: CreateInput;
  public inputPostalCode: CreateInput;
  public checkboxDefault: CreateInput;

  public address: CreateElement;
  public city: CreateElement;
  public country: CreateElement;
  public postalCode: CreateElement;
  public default: CreateElement;

  constructor(parameters: Partial<IParameters> = {}) {
    super({ tag: 'div', classNames: ['group'], ...parameters });

    this.addressLabel = new Label({ classNames: ['label'], for: 'addressBilling', textContent: 'Address:' });
    this.inputAddress = new CreateInput({
      classNames: ['input-address'],
      placeholder: 'your address',
      id: 'addressBilling',
      name: 'addressBilling',
    });
    this.cityLabel = new Label({ classNames: ['label'], for: 'city-billing', textContent: 'City:' });
    this.inputCity = new CreateInput({
      classNames: ['input-city'],
      placeholder: 'your city',
      id: 'city-billing',
      name: 'city-billing',
    });
    this.countryLabel = new Label({ classNames: ['label'], for: 'countryBilling', textContent: 'Country:' });
    this.inputCountry = new CreateInput({
      classNames: ['input-country'],
      placeholder: 'your country',
      id: 'country-billing',
      name: 'country-billing',
    });
    this.postalCodeLabel = new Label({
      classNames: ['label'],
      for: 'postal-code-billing',
      textContent: 'Postal code:',
    });
    this.inputPostalCode = new CreateInput({
      classNames: ['input-postal-code'],
      placeholder: 'your postal code',
      id: 'postal-code-billing',
      name: 'postal-code-billing',
    });
    this.defaultLabel = new Label({
      classNames: ['label'],
      for: 'default-billing',
      textContent: 'Set as default address',
    });
    this.checkboxDefault = new CreateInput({
      classNames: ['default-billing'],
      type: 'checkbox',
      id: 'default-billing',
      name: 'default-billing',
    });

    this.address = new CreateElement({
      tag: 'div',
      classNames: ['input'],
      children: [this.addressLabel, this.inputAddress],
    });
    this.city = new CreateElement({
      tag: 'div',
      classNames: ['input'],
      children: [this.cityLabel, this.inputCity],
    });
    this.country = new CreateElement({
      tag: 'div',
      classNames: ['input'],
      children: [this.countryLabel, this.inputCountry],
    });
    this.postalCode = new CreateElement({
      tag: 'div',
      classNames: ['input'],
      children: [this.postalCodeLabel, this.inputPostalCode],
    });
    this.default = new CreateElement({
      tag: 'div',
      classNames: ['checkbox'],
      children: [this.checkboxDefault, this.defaultLabel],
    });

    this.addInnerElement([this.address, this.city, this.country, this.postalCode, this.default]);
  }
}
