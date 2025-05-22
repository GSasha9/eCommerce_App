import type { IParameters } from '../../shared/models/interfaces/index.ts';
import { CreateElement } from '../../shared/utils/create-element.ts';
import './registration.scss';
import { CreateInput } from '../../components/input/create-input.ts';
import { Label } from '../../components/label/label.ts';
import { COUNTRIES } from '../../shared/constants/messages-for-validator.ts';
import Element from '../../components/element/index.ts';

export class ShippingAddressElements extends CreateElement {
  public streetLabel: Label;
  public cityLabel: Label;
  public countryLabel: Label;
  public postalCodeLabel: Label;
  public defaultLabel: Label;
  public asBillingLabel: Label;

  public inputStreet: CreateInput;
  public inputCity: CreateInput;
  public inputPostalCode: CreateInput;
  public checkboxDefault: CreateInput;
  public checkboxAsBilling: CreateInput;

  public street: CreateElement;
  public city: CreateElement;
  public country: CreateElement;
  public postalCode: CreateElement;
  public default: CreateElement;
  public asBilling: CreateElement;
  public checkboxWrapper: CreateElement;
  public countryList: Element<'select'>;

  constructor(parameters: Partial<IParameters> = {}) {
    super({ tag: 'div', classNames: ['group'], ...parameters });

    this.streetLabel = new Label({ classNames: ['label'], for: 'street', textContent: 'Street:' });
    this.inputStreet = new CreateInput({
      classNames: ['street'],
      placeholder: 'your street',
      id: 'street',
      name: 'street',
    });
    this.cityLabel = new Label({ classNames: ['label'], for: 'city', textContent: 'City:' });
    this.inputCity = new CreateInput({
      classNames: ['city'],
      placeholder: 'your city',
      id: 'city',
      name: 'city',
    });
    this.postalCodeLabel = new Label({ classNames: ['label'], for: 'postal-code', textContent: 'Postal code:' });
    this.inputPostalCode = new CreateInput({
      classNames: ['postal-code'],
      placeholder: 'your postal code',
      id: 'postal-code',
      name: 'postal-code',
      value: '',
    });
    this.countryLabel = new Label({ classNames: ['label'], for: 'country', textContent: 'Country:' });
    this.countryList = new Element({
      tag: 'select',
      className: 'country-list',
      name: 'country',
      id: 'country',
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
      for: 'is-default-shipping',
      textContent: 'Set as default address',
    });
    this.checkboxDefault = new CreateInput({
      classNames: ['default-shipping'],
      type: 'checkbox',
      id: 'is-default-shipping',
      name: 'is-default-shipping',
    });
    this.asBillingLabel = new Label({
      classNames: ['label'],
      for: 'is-shipping-as-billing',
      textContent: 'Make shipping address as billing address',
    });
    this.checkboxAsBilling = new CreateInput({
      classNames: ['as-billing'],
      type: 'checkbox',
      id: 'is-shipping-as-billing',
      name: 'is-shipping-as-billing',
    });

    this.street = new CreateElement({
      tag: 'div',
      classNames: ['input', 'input-street'],
      children: [this.streetLabel, this.inputStreet],
    });
    this.city = new CreateElement({
      tag: 'div',
      classNames: ['input', 'input-city'],
      children: [this.cityLabel, this.inputCity],
    });
    this.postalCode = new CreateElement({
      tag: 'div',
      classNames: ['input', 'input-postal-code'],
      children: [this.postalCodeLabel, this.inputPostalCode],
    });
    this.country = new CreateElement({
      tag: 'div',
      classNames: ['input', 'input-country'],
      children: [this.countryLabel, this.countryList.node],
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

    this.addInnerElement([this.street, this.city, this.postalCode, this.country, this.checkboxWrapper]);
  }
}
