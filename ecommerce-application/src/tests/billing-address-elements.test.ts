import { describe, it, expect, beforeEach } from 'vitest';
import { BillingAddressElements } from '../pages/registration/billing-address-elements';
import { COUNTRIES } from '../shared/utils/validator-сonstants.ts';

describe('BillingAddressElements', () => {
  let component: BillingAddressElements;

  beforeEach(() => {
    component = new BillingAddressElements();
    document.body.innerHTML = ''; // сброс DOM
    document.body.append(component.getElement()); // добавляем в DOM для проверки
  });

  it('должен создавать корневой элемент с классом group', () => {
    expect(component.getElement().tagName).toBe('DIV');
    expect(component.getElement().classList.contains('group')).toBe(true);
  });

  it('должен содержать инпуты для street, city, postal code и чекбокс', () => {
    expect(component.inputStreet.getElement()).toBeInstanceOf(HTMLInputElement);
    expect(component.inputStreet.getPlaceholder()).toBe('your street');

    expect(component.inputCity.getPlaceholder()).toBe('your city');
    expect(component.inputPostalCode.getPlaceholder()).toBe('your postal code');
  });

  it('должен содержать список стран с правильными опциями', () => {
    const options = component.countryList.node.querySelectorAll('option');

    expect(options.length).toBe(COUNTRIES.length + 1); // +1 за hidden option

    COUNTRIES.forEach(([name, value]) => {
      const found = Array.from(options).find((opt) => opt.textContent === name && opt.getAttribute('value') === value);

      expect(found).toBeDefined();
    });
  });

  it('все основные блоки должны присутствовать (street, city, postalCode, country, default)', () => {
    expect(component.street.getElement().querySelector('input')).toBe(component.inputStreet.getElement());
    expect(component.city.getElement().querySelector('input')).toBe(component.inputCity.getElement());
    expect(component.postalCode.getElement().querySelector('input')).toBe(component.inputPostalCode.getElement());
    expect(component.country.getElement().querySelector('select')).toBe(component.countryList.node);
    expect(component.default.getElement().querySelector('input')).toBe(component.checkboxDefault.getElement());
  });

  it('должен содержать соответствующие лейблы', () => {
    expect(component.streetLabel.getElement().textContent).toBe('Street:');
    expect(component.cityLabel.getElement().textContent).toBe('City:');
    expect(component.postalCodeLabel.getElement().textContent).toBe('Postal code:');
    expect(component.countryLabel.getElement().textContent).toBe('Country:');
    expect(component.defaultLabel.getElement().textContent).toBe('Set as default address');
  });
});
