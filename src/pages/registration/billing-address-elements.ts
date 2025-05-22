import Element from '../../components/element/element.ts';
import { CreateInput } from '../../components/input/create-input.ts';
import { Label } from '../../components/label/label.ts';
import { COUNTRIES } from '../../shared/constants/messages-for-validator.ts';
import type { IParameters } from '../../shared/models/interfaces/index.ts';
import { CreateElement } from '../../shared/utils/create-element.ts';

import './registration.scss';

export class BillingAddressElements extends CreateElement {
  public streetLabel: Label;
  public cityLabel: Label;
  public countryLabel: Label;
  public postalCodeLabel: Label;
  public defaultLabel: Label;

  public inputStreet: CreateInput;
  public inputCity: CreateInput;
  public inputPostalCode: CreateInput;
  public checkboxDefault: CreateInput;

  public street: CreateElement;
  public city: CreateElement;
  public country: CreateElement;
  public postalCode: CreateElement;
  public default: CreateElement;
  public countryList: Element<'select'>;

  constructor(parameters: Partial<IParameters> = {}) {
    super({ tag: 'div', classNames: ['group'], ...parameters });

    this.streetLabel = new Label({ classNames: ['label'], for: 'addressBilling', textContent: 'Street:' });
    this.inputStreet = new CreateInput({
      classNames: ['street'],
      placeholder: 'your street',
      id: 'street-billing',
      name: 'street-billing',
    });
    this.cityLabel = new Label({ classNames: ['label'], for: 'city-billing', textContent: 'City:' });
    this.inputCity = new CreateInput({
      classNames: ['city'],
      placeholder: 'your city',
      id: 'city-billing',
      name: 'city-billing',
    });
    this.postalCodeLabel = new Label({
      classNames: ['label'],
      for: 'postal-code-billing',
      textContent: 'Postal code:',
    });
    this.inputPostalCode = new CreateInput({
      classNames: ['postal-code-billing'],
      placeholder: 'your postal code',
      id: 'postal-code-billing',
      name: 'postal-code-billing',
    });
    this.countryLabel = new Label({ classNames: ['label'], for: 'country-billing', textContent: 'Country:' });
    this.countryList = new Element({
      tag: 'select',
      className: 'country-list',
      name: 'country-billing',
      id: 'country-billing',
      children: [
        new Element({
          tag: 'option',
          className: 'option',
          value: '',
          hidden: true,
        }).node,
        ...COUNTRIES.map(
          (country) =>
            new Element({
              tag: 'option',
              className: 'option',
              value: country[1],
              children: country[0],
            }).node,
        ),
      ],
    });

    this.defaultLabel = new Label({
      classNames: ['label'],
      for: 'is-default-billing',
      textContent: 'Set as default address',
    });
    this.checkboxDefault = new CreateInput({
      classNames: ['default-billing'],
      type: 'checkbox',
      id: 'is-default-billing',
      name: 'is-default-billing',
    });

    this.street = new CreateElement({
      tag: 'div',
      classNames: ['input', 'input-street-billing'],
      children: [this.streetLabel, this.inputStreet],
    });
    this.city = new CreateElement({
      tag: 'div',
      classNames: ['input', 'input-city-billing'],
      children: [this.cityLabel, this.inputCity],
    });
    this.postalCode = new CreateElement({
      tag: 'div',
      classNames: ['input', 'input-postal-code-billing'],
      children: [this.postalCodeLabel, this.inputPostalCode],
    });
    this.country = new CreateElement({
      tag: 'div',
      classNames: ['input', 'input-country-billing'],
      children: [this.countryLabel, this.countryList.node],
    });

    this.default = new CreateElement({
      tag: 'div',
      classNames: ['checkbox', 'checkbox-wrapper-billind'],
      children: [this.checkboxDefault, this.defaultLabel],
    });

    this.addInnerElement([this.street, this.city, this.postalCode, this.country, this.default]);
  }
}
