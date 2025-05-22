import { beforeEach, describe, expect, it } from 'vitest';

import { BillingAddressElements } from '../pages/registration/billing-address-elements.ts';
import { COUNTRIES } from '../shared/constants/messages-for-validator.ts';

describe('BillingAddressElements', () => {
  let component: BillingAddressElements;

  beforeEach(() => {
    component = new BillingAddressElements();
    document.body.innerHTML = '';
    document.body.append(component.getElement());
  });

  it('must create a root element with class group', () => {
    expect(component.getElement().tagName).toBe('DIV');
    expect(component.getElement().classList.contains('group')).toBe(true);
  });

  it('must contain inputs for street, city, postal code and a checkbox', () => {
    expect(component.inputStreet.getElement()).toBeInstanceOf(HTMLInputElement);
    expect(component.inputStreet.getPlaceholder()).toBe('your street');

    expect(component.inputCity.getPlaceholder()).toBe('your city');
    expect(component.inputPostalCode.getPlaceholder()).toBe('your postal code');
  });

  it('should contain a list of countries with the correct options', () => {
    const options = component.countryList.node.querySelectorAll('option');

    expect(options.length).toBe(COUNTRIES.length + 1);

    COUNTRIES.forEach(([name, value]) => {
      const found = Array.from(options).find((opt) => opt.textContent === name && opt.getAttribute('value') === value);

      expect(found).toBeDefined();
    });
  });

  it('all main blocks must be present (street, city, postalCode, country, default)', () => {
    expect(component.street.getElement().querySelector('input')).toBe(component.inputStreet.getElement());
    expect(component.city.getElement().querySelector('input')).toBe(component.inputCity.getElement());
    expect(component.postalCode.getElement().querySelector('input')).toBe(component.inputPostalCode.getElement());
    expect(component.country.getElement().querySelector('select')).toBe(component.countryList.node);
    expect(component.default.getElement().querySelector('input')).toBe(component.checkboxDefault.getElement());
  });

  it('must contain appropriate labels', () => {
    expect(component.streetLabel.getElement().textContent).toBe('Street:');
    expect(component.cityLabel.getElement().textContent).toBe('City:');
    expect(component.postalCodeLabel.getElement().textContent).toBe('Postal code:');
    expect(component.countryLabel.getElement().textContent).toBe('Country:');
    expect(component.defaultLabel.getElement().textContent).toBe('Set as default address');
  });
});
