import type { Address, Customer } from '@commercetools/platform-sdk';

import { CustomerProfileService } from '../../commerce-tools/customer-profile-service/customer-profile-service.ts';
import Element from '../../components/element/index.ts';
import { CreateInput } from '../../components/input/create-input.ts';
import { Label } from '../../components/label/label.ts';
import { ModalGreeting } from '../../components/modals/modal-greeting.ts';
import { BillingAddressModalModel } from '../../model/account/billing-account/billing-account-model.ts';
import type { IShippingAddressFormValues } from '../../model/account/new-adress/new-adress.ts';
import { COUNTRIES, MESSAGE_CONTENT } from '../../shared/constants/messages-for-validator.ts';
import type { IParameters } from '../../shared/models/interfaces';
import { isValidErrorKey } from '../../shared/models/typeguards.ts/account-type-guards.ts';
import { CreateElement } from '../../shared/utils/create-element.ts';
import { UserState } from '../../state/customer-state.ts';

export class ShippingAddressAccount extends CreateElement {
  public streetLabel: Label;
  public cityLabel: Label;
  public countryLabel: Label;
  public postalCodeLabel: Label;
  public defaultLabel: Label;
  public asBillingLabel: Label | undefined = undefined;

  public inputStreet: CreateInput;
  public inputCity: CreateInput;
  public inputPostalCode: CreateInput;
  public checkboxDefault: CreateInput;
  public checkboxAsBilling: CreateInput | undefined = undefined;

  public street: CreateElement | undefined = undefined;
  public city: CreateElement | undefined = undefined;
  public country: CreateElement | undefined = undefined;
  public postalCode: CreateElement | undefined = undefined;
  public default: CreateElement | undefined = undefined;
  public checkboxWrapper: CreateElement | undefined = undefined;
  public countryList: Element<'select'>;
  private errorContainers: Partial<Record<keyof IShippingAddressFormValues, HTMLElement>> = {};
  private readonly editButton: HTMLButtonElement;
  private readonly deleteButton: HTMLButtonElement;
  public currentAddressId: string = '';
  private addressId: string = '';
  private version: number = 0;
  private isDeleted: boolean = false;
  private isEdited: boolean = false;
  private modalModel: BillingAddressModalModel;
  private actionsContainer: CreateElement | undefined = undefined;
  private checkboxInitialClick: boolean = false;
  private state: UserState = UserState.getInstance();

  constructor(parameters: Partial<IParameters> = {}, ind: number) {
    super({ tag: 'div', classNames: ['group-account'], ...parameters });
    this.modalModel = new BillingAddressModalModel();
    this.errorContainers = {};

    this.streetLabel = new Label({
      classNames: ['label'],
      for: `street-${ind}`,
      textContent: 'Street:',
    });
    this.inputStreet = new CreateInput({
      classNames: ['street'],
      placeholder: 'your street',
      id: `street-${ind}`,
      name: `street-${ind}`,
    });

    if (this.inputStreet.getElement() instanceof HTMLInputElement) {
      this.inputStreet.getElement().setAttribute('disabled', 'true');
    }

    const streetErrorDiv = document.createElement('div');

    streetErrorDiv.className = `error-message-street-${ind}`;
    this.errorContainers['street'] = streetErrorDiv;

    const streetContainer = new CreateElement({
      tag: 'div',
      classNames: ['input', 'input-street'],
      children: [this.streetLabel, this.inputStreet],
    });

    streetContainer.getElement().appendChild(streetErrorDiv);

    this.cityLabel = new Label({
      classNames: ['label'],
      for: `city-${ind}`,
      textContent: 'City:',
    });
    this.inputCity = new CreateInput({
      classNames: ['city'],
      placeholder: 'your city',
      id: `city-${ind}`,
      name: `city-${ind}`,
    });

    if (this.inputCity.getElement() instanceof HTMLInputElement) {
      this.inputCity.getElement().setAttribute('disabled', 'true');
    }

    const cityErrorDiv = document.createElement('div');

    cityErrorDiv.className = `error-message-city-${ind}`;
    this.errorContainers['city'] = cityErrorDiv;

    const cityContainer = new CreateElement({
      tag: 'div',
      classNames: ['input', 'input-city'],
      children: [this.cityLabel, this.inputCity],
    });

    cityContainer.getElement().appendChild(cityErrorDiv);

    this.postalCodeLabel = new Label({
      classNames: ['label'],
      for: `postal-code-${ind}`,
      textContent: 'Postal code:',
    });
    this.inputPostalCode = new CreateInput({
      classNames: ['postal-code'],
      placeholder: 'your postal code',
      id: `postal-code-${ind}`,
      name: `postal-code-${ind}`,
      value: '',
    });

    if (this.inputPostalCode.getElement() instanceof HTMLInputElement) {
      this.inputPostalCode.getElement().setAttribute('disabled', 'true');
    }

    const postalErrorDiv = document.createElement('div');

    postalErrorDiv.className = `error-message-postal-code-${ind}`;
    this.errorContainers['postalCode'] = postalErrorDiv;

    const postalContainer = new CreateElement({
      tag: 'div',
      classNames: ['input', 'input-postal-code'],
      children: [this.postalCodeLabel, this.inputPostalCode],
    });

    postalContainer.getElement().appendChild(postalErrorDiv);

    this.countryLabel = new Label({
      classNames: ['label'],
      for: `country-${ind}`,
      textContent: 'Country:',
    });
    this.countryList = new Element({
      tag: 'select',
      className: 'country-list',
      name: `country-${ind}`,
      id: `country-${ind}`,
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

    if (this.countryList.node instanceof HTMLSelectElement) {
      this.countryList.node.setAttribute('disabled', 'true');
    }

    const countryErrorDiv = document.createElement('div');

    countryErrorDiv.className = `error-message-country-${ind}`;
    this.errorContainers['country'] = countryErrorDiv;
    const countryContainer = new CreateElement({
      tag: 'div',
      classNames: ['input', 'input-country'],
      children: [this.countryLabel, this.countryList.node],
    });

    countryContainer.getElement().appendChild(countryErrorDiv);

    this.defaultLabel = new Label({
      classNames: ['label'],
      for: `is-default-shipping-${ind}`,
      textContent: 'Set as default address',
    });
    this.checkboxDefault = new CreateInput({
      classNames: ['default-shipping'],
      type: 'checkbox',
      id: `is-default-shipping-${ind}`,
      name: `is-default-shipping-${ind}`,
    });

    if (this.checkboxDefault.getElement() instanceof HTMLInputElement) {
      this.checkboxDefault.getElement().setAttribute('disabled', 'true');
    }

    const defaultContainer = new CreateElement({
      tag: 'div',
      classNames: ['checkbox'],
      children: [this.checkboxDefault, this.defaultLabel],
    });
    const checkboxWrapper = new CreateElement({
      tag: 'div',
      classNames: ['checkbox-wrapper'],
      children: [defaultContainer],
    });

    this.editButton = document.createElement('button');
    this.editButton.textContent = 'Edit';
    this.editButton.addEventListener('click', (evt): void => {
      evt.preventDefault();
      void (async (): Promise<void> => {
        this.state = UserState.getInstance();
        const currentEditingId = this.state.editingAddressId;
        const thisAddressId = this.currentAddressId;

        if (currentEditingId && currentEditingId !== thisAddressId) {
          console.warn(`Finish editing address ${currentEditingId} first.`);

          return;
        }

        if (this.editButton.classList.contains('save') && this.state.isEdited) {
          await this.onSaveBillingChanges();
          this.onEdit(false);
          this.state.isEdited = false;
          this.state.editingAddressId = null;
        } else {
          this.state.isEdited = true;
          this.state.editingAddressId = thisAddressId;
          this.onEdit(true);
        }
      })();
    });

    this.deleteButton = document.createElement('button');
    this.deleteButton.textContent = 'Remove';
    this.deleteButton.addEventListener('click', (evt): void => {
      evt.preventDefault();
      void this.onDelete();
    });

    this.addInnerElement([streetContainer, cityContainer, postalContainer, countryContainer, checkboxWrapper]);
    this.setupRealTimeValidation();
  }

  private onEdit(isEdit: boolean): void {
    if (isEdit) {
      this.setEditable(true);
      this.editButton.classList.remove('edit');
      this.editButton.classList.add('save');
      this.editButton.textContent = 'Save';
    } else {
      this.setEditable(false);
      this.editButton.classList.remove('save');
      this.editButton.classList.add('edit');
      this.editButton.textContent = 'Edit';
    }
  }

  private async onDelete(): Promise<void> {
    if (this.isDeleted) {
      return;
    }

    this.isDeleted = true;
    const customer: Customer | undefined = UserState.getInstance().customer;

    if (!customer) {
      this.isDeleted = false;

      return;
    }

    if (this.currentAddressId && typeof customer.version === 'number') {
      this.addressId = this.currentAddressId;
      this.version = customer.version;

      try {
        const updatedCustomer: Customer | undefined = await CustomerProfileService.removeShippingAddressId({
          version: this.version,
          addressId: this.addressId,
        });

        if (updatedCustomer) {
          UserState.getInstance().customer = updatedCustomer;

          if (this.state.editingAddressId === this.currentAddressId) {
            this.state.isEdited = false;
            this.state.editingAddressId = null;
          }
        }

        this.isDeleted = false;
      } catch (error) {
        console.warn(error);
        this.isDeleted = false;
      }
    }
  }

  private async onSaveBillingChanges(): Promise<void> {
    if (!this.modalModel.isValidForm) return;

    if (this.isEdited) return;

    this.isEdited = true;

    const currentCustomer: Customer | undefined = UserState.getInstance().customer;

    if (!currentCustomer) return;

    if (!this.currentAddressId) return;

    const streetEl: unknown = this.inputStreet.getElement();
    const cityEl: unknown = this.inputCity.getElement();
    const postalEl: unknown = this.inputPostalCode.getElement();
    const countryEl: unknown = this.countryList.node;

    if (
      !(
        streetEl instanceof HTMLInputElement &&
        cityEl instanceof HTMLInputElement &&
        postalEl instanceof HTMLInputElement &&
        countryEl instanceof HTMLSelectElement
      )
    ) {
      console.warn('Invalid form elements');
      this.isEdited = false;

      return;
    }

    const updatedAddress = {
      streetName: streetEl.value,
      city: cityEl.value,
      postalCode: postalEl.value,
      country: countryEl.value,
    };

    try {
      const updatedCustomer: Customer | undefined = await CustomerProfileService.updateBillingAddressData({
        version: currentCustomer.version,
        addressId: this.currentAddressId,
        address: updatedAddress,
      });

      if (updatedCustomer) {
        const checkboxElement: unknown = this.checkboxDefault.getElement();

        if (checkboxElement instanceof HTMLInputElement) {
          if (this.checkboxInitialClick === checkboxElement.checked) {
            UserState.getInstance().customer = updatedCustomer;
          } else if (this.checkboxInitialClick !== checkboxElement.checked) {
            if (checkboxElement.checked) {
              const newCustomer: Customer | undefined = await CustomerProfileService.setDefaultShippingAddress(
                this.currentAddressId,
                updatedCustomer.version,
              );

              if (newCustomer) {
                UserState.getInstance().customer = newCustomer;
              }
            } else {
              UserState.getInstance().customer = updatedCustomer;
            }
          }
        } else {
          UserState.getInstance().customer = updatedCustomer;
        }
      }

      const modal = new ModalGreeting('Your data was saved successfully');

      void modal.open();
    } catch (error) {
      console.warn(error);
    } finally {
      this.setEditable(false);
      this.isEdited = false;
    }
  }

  private setupRealTimeValidation(): void {
    const inputs: HTMLElement[] = [
      this.inputStreet.getElement(),
      this.inputCity.getElement(),
      this.inputPostalCode.getElement(),
      this.countryList.node,
    ];

    inputs.forEach((el: HTMLElement): void => {
      if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) {
        el.addEventListener('input', (): void => {
          this.handleRealTimeValidation();
        });
      }
    });
  }

  private handleRealTimeValidation(): void {
    const streetEl: unknown = this.inputStreet.getElement();
    const cityEl: unknown = this.inputCity.getElement();
    const postalEl: unknown = this.inputPostalCode.getElement();
    const countryEl: unknown = this.countryList.node;

    if (
      streetEl instanceof HTMLInputElement &&
      cityEl instanceof HTMLInputElement &&
      postalEl instanceof HTMLInputElement &&
      countryEl instanceof HTMLSelectElement
    ) {
      this.modalModel.currentFormValues.street = streetEl.value;
      this.modalModel.currentFormValues.city = cityEl.value;
      this.modalModel.currentFormValues.postalCode = postalEl.value;
      this.modalModel.currentFormValues.country = countryEl.value;

      this.modalModel.validateForm();
      this.modalModel.determineValidForm();
      this.editButton.disabled = !this.modalModel.isValidForm;

      Object.values(this.errorContainers).forEach((container: unknown): void => {
        if (container instanceof HTMLElement) {
          container.textContent = '';
        }
      });

      if (!this.modalModel.isValidForm) {
        this.modalModel.errors.forEach((errorKey: string): void => this.renderErrorMessage(errorKey));
      }
    }
  }

  public renderErrorMessage(inputName: string): void {
    if (!isValidErrorKey(inputName)) {
      return;
    }

    const message: string = MESSAGE_CONTENT[inputName] || '';
    const errorContainer: unknown = this.errorContainers[inputName];

    if (errorContainer instanceof HTMLElement) {
      errorContainer.textContent = message;
      errorContainer.style.color = 'darkred';
    }
  }

  public setEditable(isEditable: boolean): void {
    const inputs: HTMLElement[] = [
      this.inputStreet.getElement(),
      this.inputCity.getElement(),
      this.inputPostalCode.getElement(),
      this.countryList.node,
    ];

    const checkboxElement = this.checkboxDefault.getElement();

    if (checkboxElement instanceof HTMLInputElement) {
      if (!checkboxElement.checked) {
        inputs.push(checkboxElement);
      }
    }

    inputs.forEach((el: HTMLElement): void => {
      if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) {
        if (isEditable) {
          el.removeAttribute('disabled');
        } else {
          el.setAttribute('disabled', 'true');
        }
      }
    });
  }

  public updateData(
    address: Customer['addresses'][number],
    unique: { commonIds: Address[]; uniqueBilling: Address[]; uniqueShipping: Address[] },
  ): void {
    if (!address || !address.id) return;

    this.addressId = address.id;
    this.currentAddressId = address.id;
    const streetInputEl: unknown = this.inputStreet.getElement();

    if (streetInputEl instanceof HTMLInputElement) {
      streetInputEl.value = address.streetName ?? '';
    }

    const cityInputEl: unknown = this.inputCity.getElement();

    if (cityInputEl instanceof HTMLInputElement) {
      cityInputEl.value = address.city ?? '';
    }

    const postalInputEl: unknown = this.inputPostalCode.getElement();

    if (postalInputEl instanceof HTMLInputElement) {
      postalInputEl.value = address.postalCode ?? '';
    }

    if (this.countryList.node instanceof HTMLSelectElement) {
      this.countryList.node.value = address.country ?? '';
    }

    Object.values(this.errorContainers).forEach((container: HTMLElement): void => {
      container.textContent = '';
    });
    const checkboxDefault: unknown = this.checkboxDefault.getElement();

    if (checkboxDefault instanceof HTMLInputElement) {
      const customer: Customer | undefined = UserState.getInstance().customer;

      if (customer && address.id === customer.defaultShippingAddressId) {
        checkboxDefault.checked = true;
        this.checkboxInitialClick = checkboxDefault.checked;
        checkboxDefault.disabled = true;
      } else {
        checkboxDefault.checked = false;
        checkboxDefault.disabled = true;
        this.checkboxInitialClick = checkboxDefault.checked;
      }
    }

    if (!this.actionsContainer) {
      this.actionsContainer = new CreateElement({
        tag: 'div',
        classNames: ['actions-container'],
      });
      this.addInnerElement([this.actionsContainer]);
    } else {
      this.actionsContainer.getElement().replaceChildren();
    }

    const container: HTMLElement = this.actionsContainer.getElement();

    if (unique.uniqueShipping.some((item: Address): boolean => item.id === address.id)) {
      const addToBillingButton: HTMLButtonElement = document.createElement('button');

      addToBillingButton.textContent = 'Add to Billing';
      addToBillingButton.classList.add('account-button');
      addToBillingButton.addEventListener('click', (evt: Event): void => {
        evt.preventDefault();

        if (this.currentAddressId) {
          void (async (): Promise<void> => {
            await CustomerProfileService.updateCustomerAddress(this.currentAddressId, { billing: true });
          })();
        }
      });
      container.appendChild(addToBillingButton);
    }

    this.editButton.classList.add('account-button');
    container.appendChild(this.editButton);
    this.deleteButton.classList.add('account-button');
    container.appendChild(this.deleteButton);

    if (this.state.editingAddressId !== this.currentAddressId) {
      setTimeout((): void => this.onEdit(false), 0);
    }
  }
}
