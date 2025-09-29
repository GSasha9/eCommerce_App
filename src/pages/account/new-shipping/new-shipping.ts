import type { Customer } from '@commercetools/platform-sdk';

import { CustomerProfileService } from '../../../commerce-tools/customer-profile-service/customer-profile-service.ts';
import Element from '../../../components/element';
import { CreateInput } from '../../../components/input/create-input.ts';
import { Label } from '../../../components/label/label.ts';
import type { IShippingAddressFormValues } from '../../../model/account/new-adress/new-adress.ts';
import { ShippingAddressModalModel } from '../../../model/account/new-adress/new-adress.ts';
import {
  COUNTRIES,
  MESSAGE_CONTENT,
  MESSAGE_CONTENT_MOBILE,
} from '../../../shared/constants/messages-for-validator.ts';
import type { IParameters } from '../../../shared/models/interfaces';
import { isShippingAddressFormKey } from '../../../shared/models/typeguards.ts/account-type-guards.ts';
import { CreateElement } from '../../../shared/utils/create-element.ts';
import { UserState } from '../../../state/customer-state.ts';

import './style.scss';

export class AddShippingAddressModal extends CreateElement {
  private readonly modalContent: CreateElement;
  private readonly inputStreet: CreateInput;
  private readonly inputCity: CreateInput;
  private readonly inputPostalCode: CreateInput;
  private countryList: Element<'select'>;
  private readonly saveButton: HTMLButtonElement;
  private readonly closeButton: HTMLButtonElement;
  private errorContainers: Partial<Record<keyof IShippingAddressFormValues, HTMLElement>> = {};
  private readonly checkboxDefault: CreateInput;
  private readonly asBillingLabel: Label;
  private readonly checkboxAsBilling: CreateInput;
  private readonly default: CreateElement;
  private readonly asBilling: CreateElement;
  private readonly checkboxWrapper: CreateElement;
  private readonly defaultLabel: Label;
  private readonly checkboxShipping: CreateInput;
  private readonly shippingLabel: Label;
  private readonly billingLabel: Label;
  private readonly billingAdress: CreateInput;
  private readonly defaultAdress: CreateElement;
  private readonly asBillingAdress: CreateElement;
  private readonly checkboxWrapperAdress: HTMLElement | CreateElement | CreateElement[];
  private readonly error: CreateElement;
  private isSaving: boolean = false;

  constructor(parameters: Partial<IParameters> = {}) {
    super({ tag: 'dialog', classNames: ['modal', 'add-shipping-address-modal'], ...parameters });

    this.modalContent = new CreateElement({ tag: 'div', classNames: ['modal-new-address'] });

    this.inputStreet = new CreateInput({
      classNames: ['input', 'street'],
      placeholder: 'Street',
      id: 'new-street',
      name: 'new-street',
    });
    const streetLabel = new Label({ classNames: ['label'], for: 'new-street', textContent: 'Street:' });
    const streetContainer = new CreateElement({
      tag: 'div',
      classNames: ['input', 'input-street'],
      children: [streetLabel, this.inputStreet],
    });
    const streetErrorDiv = document.createElement('div');

    streetErrorDiv.className = 'error-message';
    streetContainer.getElement().append(streetErrorDiv);
    this.errorContainers['street'] = streetErrorDiv;

    this.inputCity = new CreateInput({
      classNames: ['input', 'city'],
      placeholder: 'City',
      id: 'new-city',
      name: 'new-city',
    });
    const cityLabel = new Label({ classNames: ['label'], for: 'new-city', textContent: 'City:' });
    const cityContainer = new CreateElement({
      tag: 'div',
      classNames: ['input', 'input-city'],
      children: [cityLabel, this.inputCity],
    });
    const cityErrorDiv = document.createElement('div');

    cityErrorDiv.className = 'error-message';
    cityContainer.getElement().append(cityErrorDiv);
    this.errorContainers['city'] = cityErrorDiv;

    this.inputPostalCode = new CreateInput({
      classNames: ['input', 'postal-code'],
      placeholder: 'Postal Code',
      id: 'new-postal-code',
      name: 'new-postal-code',
    });
    const postalLabel = new Label({ classNames: ['label'], for: 'new-postal-code', textContent: 'Postal Code:' });
    const postalContainer = new CreateElement({
      tag: 'div',
      classNames: ['input', 'input-postal-code'],
      children: [postalLabel, this.inputPostalCode],
    });
    const postalErrorDiv = document.createElement('div');

    postalErrorDiv.className = 'error-message';
    postalContainer.getElement().append(postalErrorDiv);
    this.errorContainers['postalCode'] = postalErrorDiv;

    this.countryList = new Element({
      tag: 'select',
      className: 'country-list-new',
      name: 'new-country',
      id: 'new-country',
      children: [
        new Element({ tag: 'option', className: 'option', value: '', hidden: true }).node,
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
    const countryLabel = new Label({ classNames: ['label'], for: 'new-country', textContent: 'Country:' });
    const countryContainer = new CreateElement({
      tag: 'div',
      classNames: ['input', 'input-country'],
      children: [countryLabel, this.countryList.node],
    });
    const countryErrorDiv = document.createElement('div');

    countryErrorDiv.className = 'error-message';
    countryContainer.getElement().append(countryErrorDiv);
    this.errorContainers['country'] = countryErrorDiv;
    this.defaultLabel = new Label({
      classNames: ['label'],
      for: 'is-default-shipping',
      textContent: 'Set as default Shipping address',
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
      textContent: 'Set as default Billing address',
    });
    this.checkboxAsBilling = new CreateInput({
      classNames: ['as-billing'],
      type: 'checkbox',
      id: 'is-shipping-as-billing',
      name: 'is-shipping-as-billing',
    });
    this.default = new CreateElement({
      tag: 'div',
      classNames: ['checkbox-new'],
      children: [this.checkboxDefault, this.defaultLabel],
    });
    this.asBilling = new CreateElement({
      tag: 'div',
      classNames: ['checkbox-new'],
      children: [this.checkboxAsBilling, this.asBillingLabel],
    });
    this.checkboxWrapper = new CreateElement({
      tag: 'div',
      classNames: ['checkbox-wrapper-new'],
      children: [this.default, this.asBilling],
    });

    this.shippingLabel = new Label({
      classNames: ['label'],
      for: 'is-shipping',
      textContent: 'Create as Shipping address',
    });
    this.checkboxShipping = new CreateInput({
      classNames: ['default-shipping'],
      type: 'checkbox',
      id: 'is-shipping',
      name: 'is-shipping',
    });
    this.billingLabel = new Label({
      classNames: ['label'],
      for: 'as-billing',
      textContent: 'Create as Billing address',
    });
    this.billingAdress = new CreateInput({
      classNames: ['as-billing'],
      type: 'checkbox',
      id: 'as-billing',
      name: 'as-billing',
    });
    this.defaultAdress = new CreateElement({
      tag: 'div',
      classNames: ['checkbox-new'],
      children: [this.checkboxShipping, this.shippingLabel],
    });
    this.asBillingAdress = new CreateElement({
      tag: 'div',
      classNames: ['checkbox-new'],
      children: [this.billingAdress, this.billingLabel],
    });
    this.checkboxWrapperAdress = new CreateElement({
      tag: 'div',
      classNames: ['checkbox-wrapper-new'],
      children: [this.defaultAdress, this.asBillingAdress],
    });
    this.error = new CreateElement({
      tag: 'div',
      classNames: ['error-wrapper'],
    });

    const leftContainer = new CreateElement({
      tag: 'div',
      classNames: ['new-left-container'],
      children: [streetContainer, cityContainer],
    });

    const rightContainer = new CreateElement({
      tag: 'div',
      classNames: ['new-right-container'],
      children: [postalContainer, countryContainer],
    });
    const shippingGroup = new CreateElement({ tag: 'div', classNames: ['shipping-group-new'] });

    shippingGroup.addInnerElement([
      leftContainer,
      rightContainer,
      this.checkboxWrapper,
      this.checkboxWrapperAdress,
      this.error,
    ]);

    this.saveButton = document.createElement('button');
    this.saveButton.textContent = 'Save';
    this.saveButton.className = 'btn';
    this.saveButton.addEventListener('click', () => void this.onSave());
    this.closeButton = document.createElement('button');
    this.closeButton.textContent = 'Cancel';
    this.closeButton.className = 'btn';
    this.closeButton.addEventListener('click', () => this.close());
    const buttonsContainer = new CreateElement({ tag: 'div', classNames: ['buttons-container-new'] });

    buttonsContainer.getElement().append(this.saveButton, this.closeButton);

    this.modalContent.addInnerElement(shippingGroup);
    this.modalContent.addInnerElement(buttonsContainer);
    this.addInnerElement(this.modalContent);

    this.getElement().addEventListener('click', (e: MouseEvent): void => {
      if (e.target === this.getElement()) {
        this.close();
      }
    });

    this.setupRealTimeValidation();
    this.setupCheckboxLogic();
  }

  private setupRealTimeValidation(): void {
    [this.inputStreet, this.inputCity, this.inputPostalCode].forEach((input: CreateInput): void => {
      const element: HTMLElement = input.getElement();

      element.addEventListener('input', (): void => {
        this.handleRealTimeValidation();
      });
    });

    this.countryList.node.addEventListener('input', (): void => {
      this.handleRealTimeValidation();
    });
  }

  private handleRealTimeValidation(): void {
    const modalModel = ShippingAddressModalModel.getInstance();
    const streetEl: unknown = this.inputStreet.getElement();
    const cityEl: unknown = this.inputCity.getElement();
    const postalCodeEl: unknown = this.inputPostalCode.getElement();
    const countryEl: unknown = this.countryList.node;

    if (
      streetEl instanceof HTMLInputElement &&
      cityEl instanceof HTMLInputElement &&
      postalCodeEl instanceof HTMLInputElement &&
      countryEl instanceof HTMLSelectElement
    ) {
      modalModel.currentFormValues.street = streetEl.value;
      modalModel.currentFormValues.city = cityEl.value;
      modalModel.currentFormValues.postalCode = postalCodeEl.value;
      modalModel.currentFormValues.country = countryEl.value;

      modalModel.validateForm();
      modalModel.determineValidForm();

      Object.values(this.errorContainers).forEach((container: unknown): void => {
        if (container instanceof HTMLElement) {
          container.textContent = '';
        }
      });

      if (!modalModel.isValidForm) {
        modalModel.errors.forEach((errorKey: string): void => {
          this.renderErrorMessage(errorKey);
        });
      }
    }
  }

  public renderErrorMessage(inputName: string): void {
    if (!isShippingAddressFormKey(inputName)) {
      return;
    }

    const errorContainer = this.errorContainers[inputName];

    if (errorContainer instanceof HTMLElement) {
      let message = '';

      if (window.innerWidth < 600) {
        message = MESSAGE_CONTENT_MOBILE[inputName] || '';
      } else {
        message = MESSAGE_CONTENT[inputName] || '';
      }

      errorContainer.textContent = message;
    }
  }

  public async onSave(): Promise<void> {
    if (this.isSaving) return;

    this.isSaving = true;
    const modalModel = ShippingAddressModalModel.getInstance();

    const streetEl: unknown = this.inputStreet.getElement();
    const cityEl: unknown = this.inputCity.getElement();
    const postalCodeEl: unknown = this.inputPostalCode.getElement();
    const countryEl: unknown = this.countryList.node;

    if (
      streetEl instanceof HTMLInputElement &&
      cityEl instanceof HTMLInputElement &&
      postalCodeEl instanceof HTMLInputElement &&
      countryEl instanceof HTMLSelectElement
    ) {
      modalModel.currentFormValues.street = streetEl.value;
      modalModel.currentFormValues.city = cityEl.value;
      modalModel.currentFormValues.postalCode = postalCodeEl.value;
      modalModel.currentFormValues.country = countryEl.value;
    }

    modalModel.validateForm();
    modalModel.determineValidForm();

    Object.entries(this.errorContainers).forEach((entry): void => {
      const container = entry[1];

      if (container instanceof HTMLElement) {
        container.textContent = '';
      }
    });

    if (!modalModel.isValidForm) {
      modalModel.errors.forEach((errorKey: string): void => {
        this.renderErrorMessage(errorKey);
      });
      this.isSaving = false;

      return;
    }

    const newShippingAddress = {
      streetName: modalModel.currentFormValues.street,
      city: modalModel.currentFormValues.city,
      postalCode: modalModel.currentFormValues.postalCode,
      country: modalModel.currentFormValues.country,
    };

    const customer: Customer | undefined = UserState.getInstance().customer;

    if (!customer) {
      this.isSaving = false;

      return;
    }

    const updatePayload: {
      version: number;
      newAddresses?: Array<{ streetName: string; city: string; postalCode: string; country: string }>;
      email?: string;
    } = {
      version: customer.version,
      newAddresses: [newShippingAddress],
    };

    try {
      const updatedCustomer: Customer | undefined = await CustomerProfileService.addCustomerAdressData({
        ...updatePayload,
      });

      if (!updatedCustomer) {
        this.isSaving = false;

        return;
      }

      const newAddressId: string | undefined = AddShippingAddressModal.getNewAddressId(
        updatedCustomer.addresses,
        newShippingAddress,
      );

      if (!newAddressId) {
        this.isSaving = false;

        return;
      }

      let currentVersion: number = updatedCustomer.version;

      const defaultCheckbox: unknown = this.checkboxDefault.getElement();

      if (defaultCheckbox instanceof HTMLInputElement && defaultCheckbox.checked) {
        const shippingPayload = {
          version: currentVersion,
          defaultShippingAddress: newAddressId,
        };
        const customerAfterShippingDefault: Customer = await CustomerProfileService.updateCustomerData(shippingPayload);

        currentVersion = customerAfterShippingDefault.version;
        UserState.getInstance().customer = customerAfterShippingDefault;
      }

      const billingCheckbox: unknown = this.checkboxAsBilling.getElement();

      if (billingCheckbox instanceof HTMLInputElement && billingCheckbox.checked) {
        const billingPayload = {
          version: currentVersion,
          defaultBillingAddress: newAddressId,
        };
        const customerAfterBillingDefault: Customer = await CustomerProfileService.updateCustomerData(billingPayload);

        UserState.getInstance().customer = customerAfterBillingDefault;
      }

      const shippingCheckbox: unknown = this.checkboxShipping.getElement();

      if (shippingCheckbox instanceof HTMLInputElement && shippingCheckbox.checked) {
        const shippingPayload = {
          version: currentVersion,
          addShippingAddressId: newAddressId,
        };
        const customerAfterShippingDefault: Customer = await CustomerProfileService.updateCustomerData(shippingPayload);

        currentVersion = customerAfterShippingDefault.version;
        UserState.getInstance().customer = customerAfterShippingDefault;
      }

      const billingAddressCheckbox: unknown = this.billingAdress.getElement();

      if (billingAddressCheckbox instanceof HTMLInputElement && billingAddressCheckbox.checked) {
        const billingAddressPayload = {
          version: currentVersion,
          addBillingAddressId: newAddressId,
        };
        const customerAfterBillingAddress: Customer =
          await CustomerProfileService.updateCustomerData(billingAddressPayload);

        currentVersion = customerAfterBillingAddress.version;
        UserState.getInstance().customer = customerAfterBillingAddress;
      }

      this.isSaving = false;
      this.close();
    } catch (error) {
      this.isSaving = false;
      this.error.getElement().textContent = `${String(error)}`;
    }
  }

  private static getNewAddressId(
    addresses: Customer['addresses'],
    addressToMatch: { streetName: string; city: string; postalCode: string; country: string },
  ): string | undefined {
    const match = addresses.find(
      (addr: Customer['addresses'][number]): boolean =>
        addr.streetName === addressToMatch.streetName &&
        addr.city === addressToMatch.city &&
        addr.postalCode === addressToMatch.postalCode &&
        addr.country === addressToMatch.country,
    );

    return match?.id;
  }

  private setupCheckboxLogic(): void {
    const shippingDefaultElement: unknown = this.checkboxDefault.getElement();

    if (!(shippingDefaultElement instanceof HTMLInputElement)) {
      throw new Error('shippingDefault element is not an HTMLInputElement');
    }

    const shippingDefaultCheckbox: HTMLInputElement = shippingDefaultElement;

    const billingDefaultElement: unknown = this.checkboxAsBilling.getElement();

    if (!(billingDefaultElement instanceof HTMLInputElement)) {
      throw new Error('billingDefault element is not an HTMLInputElement');
    }

    const billingDefaultCheckbox: HTMLInputElement = billingDefaultElement;

    const createShippingElement: unknown = this.checkboxShipping.getElement();

    if (!(createShippingElement instanceof HTMLInputElement)) {
      throw new Error('checkboxShipping element is not an HTMLInputElement');
    }

    const createShippingCheckbox: HTMLInputElement = createShippingElement;

    const createBillingElement: unknown = this.billingAdress.getElement();

    if (!(createBillingElement instanceof HTMLInputElement)) {
      throw new Error('billingAdress element is not an HTMLInputElement');
    }

    const createBillingCheckbox: HTMLInputElement = createBillingElement;

    shippingDefaultCheckbox.addEventListener('change', (): void => {
      if (shippingDefaultCheckbox.checked) {
        createShippingCheckbox.checked = false;
        createShippingCheckbox.disabled = true;
      } else {
        createShippingCheckbox.disabled = false;
      }
    });

    billingDefaultCheckbox.addEventListener('change', (): void => {
      if (billingDefaultCheckbox.checked) {
        createBillingCheckbox.checked = false;
        createBillingCheckbox.disabled = true;
      } else {
        createBillingCheckbox.disabled = false;
      }
    });
  }

  public open(): void {
    const dialogEl: unknown = this.getElement();

    if (dialogEl instanceof HTMLDialogElement) {
      if (!dialogEl.isConnected) {
        document.body.appendChild(dialogEl);
      }

      dialogEl.showModal();
    }
  }

  public close(): void {
    const dialogEl: unknown = this.getElement();

    try {
      if (dialogEl instanceof HTMLDialogElement && typeof dialogEl.close === 'function') {
        dialogEl.close();
      }
    } catch (error) {
      console.warn(error);
    }

    if (dialogEl instanceof HTMLElement && dialogEl.parentElement) {
      dialogEl.parentElement.removeChild(dialogEl);
    } else if (dialogEl instanceof HTMLElement) {
      dialogEl.remove();
    }
  }
}
