import type { IParameters } from '../../shared/models/interfaces/index.ts';
import { CreateElement } from '../../shared/utils/create-element.ts';
import './registration.scss';
import { CreateInput } from '../../components/input/create-input.ts';
import { Label } from '../../components/label/label.ts';

export class ShippingAddressElements extends CreateElement {
  public addressLabel: Label;
  public cityLabel: Label;
  public countryLabel: Label;
  public postalCodeLabel: Label;
  public defaultLabel: Label;
  public asBillingLabel: Label;

  public inputAddress: CreateInput;
  public inputCity: CreateInput;
  public inputCountry: CreateInput;
  public inputPostalCode: CreateInput;
  public checkboxDefault: CreateInput;
  public checkboxAsBilling: CreateInput;

  public address: CreateElement;
  public city: CreateElement;
  public country: CreateElement;
  public postalCode: CreateElement;
  public default: CreateElement;
  public asBilling: CreateElement;
  public checkboxWrapper: CreateElement;

  constructor(parameters: Partial<IParameters> = {}) {
    super({ tag: 'div', classNames: ['group'], ...parameters });

    this.addressLabel = new Label({ classNames: ['label'], for: 'address', textContent: 'Address:' });
    this.inputAddress = new CreateInput({
      classNames: ['input-address'],
      placeholder: 'your address',
      id: 'address',
      name: 'address',
    });
    this.cityLabel = new Label({ classNames: ['label'], for: 'city', textContent: 'City:' });
    this.inputCity = new CreateInput({
      classNames: ['input-city'],
      placeholder: 'your city',
      id: 'city',
      name: 'city',
    });
    this.countryLabel = new Label({ classNames: ['label'], for: 'country', textContent: 'Country:' });
    this.inputCountry = new CreateInput({
      classNames: ['input-country'],
      placeholder: 'your country',
      id: 'country',
      name: 'country',
    });
    this.postalCodeLabel = new Label({ classNames: ['label'], for: 'postal-code', textContent: 'Postal code:' });
    this.inputPostalCode = new CreateInput({
      classNames: ['input-postal-code'],
      placeholder: 'your postal code',
      id: 'postal-code',
      name: 'postal-code',
    });
    this.defaultLabel = new Label({
      classNames: ['label'],
      for: 'default-shipping',
      textContent: 'Set as default address',
    });
    this.checkboxDefault = new CreateInput({
      classNames: ['default-shipping'],
      type: 'checkbox',
      id: 'default-shipping',
      name: 'default-shipping',
    });
    this.asBillingLabel = new Label({
      classNames: ['label'],
      for: 'as-billing',
      textContent: 'Make shipping address as billing address',
    });
    this.checkboxAsBilling = new CreateInput({
      classNames: ['as-billing'],
      type: 'checkbox',
      id: 'as-billing',
      name: 'as-billing',
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
    this.asBilling = new CreateElement({
      tag: 'div',
      classNames: ['checkbox'],
      children: [this.checkboxAsBilling, this.asBillingLabel],
    });
    this.checkboxWrapper = new CreateElement({
      tag: 'div',
      classNames: ['checkbox-wrapper'],
      children: [this.default, this.asBilling],
    });

    this.addInnerElement([this.address, this.city, this.country, this.postalCode, this.checkboxWrapper]);
  }
}
