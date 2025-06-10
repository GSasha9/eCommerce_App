import type { Address } from '@commercetools/platform-sdk';

import { authService } from '../../commerce-tools/auth-service.ts';
import { CustomerProfileService } from '../../commerce-tools/customer-profile-service/customer-profile-service.ts';
import { AccountModel } from '../../model/account/account-model.ts';
import AccountPage from '../../pages/account/account-page.ts';
import { BillingAddressAccount } from '../../pages/account/billing-account.ts';
import { ShippingAddressAccount } from '../../pages/account/shipping-account.ts';
import { UnsortedAddressAccount } from '../../pages/account/unsorted-account.ts';
import { Layout } from '../../pages/layout/layout.ts';
import type { IParameters } from '../../shared/models/interfaces';
import {
  isFormName,
  isHTMLCheckboxElement,
  isHTMLInputElement,
  isHTMLSelectElement,
} from '../../shared/models/typeguards.ts';
import { isCustomer, isFormNameAcc } from '../../shared/models/typeguards.ts/account-type-guards.ts';
import { convertInputName } from '../../shared/utils/convert-input-name.ts';
import { UserState } from '../../state/customer-state.ts';

export class AccountController {
  private readonly page: AccountPage;
  private readonly model: AccountModel;
  private addressesComponentsBilling: BillingAddressAccount[] = [];
  private addressesComponentsShipping: ShippingAddressAccount[] = [];
  private addressesComponentsUnsorted: UnsortedAddressAccount[] = [];

  constructor() {
    this.page = AccountPage.getInstance();
    this.model = AccountModel.getInstance();

    UserState.getInstance().subscribe(this.onCustomerUpdate);

    if (authService.isAuthenticated) {
      if (!isCustomer(UserState.getInstance().customer)) {
        void (async (): Promise<void> => {
          UserState.getInstance().customer = await CustomerProfileService.fetchCustomerData();
          this.onCustomerUpdate();
        })();
      }

      this.page.containerForm.node.addEventListener('input', this.onChangeInputs);
    }
  }

  public static getAddressComparisons(
    billingAddresses: Address[],
    shippingAddresses: Address[],
  ): { commonIds: Address[]; uniqueBilling: Address[]; uniqueShipping: Address[] } {
    const commonIds = billingAddresses.filter((bAddress) =>
      shippingAddresses.some((sAddress) => sAddress.id === bAddress.id),
    );
    const uniqueBilling = billingAddresses.filter(
      (bAddress) => !shippingAddresses.some((sAddress) => sAddress.id === bAddress.id),
    );
    const uniqueShipping = shippingAddresses.filter(
      (sAddress) => !billingAddresses.some((bAddress) => bAddress.id === sAddress.id),
    );

    return {
      commonIds,
      uniqueBilling,
      uniqueShipping,
    };
  }

  private onCustomerUpdate = (): void => {
    const customer = UserState.getInstance().customer;

    if (!customer) {
      return;
    }

    const billingAddresses = customer.addresses.filter((address) => {
      if (!address.id) return false;

      return customer.billingAddressIds?.includes(address.id);
    });

    const defaultBillingAddress = billingAddresses.find((address) => address.id === customer.defaultBillingAddressId);
    const remainingBillingAddresses = billingAddresses.filter(
      (address) => address.id !== customer.defaultBillingAddressId,
    );
    const sortedBillingAddresses = defaultBillingAddress
      ? [defaultBillingAddress, ...remainingBillingAddresses]
      : billingAddresses;

    const shippingAddresses = customer.addresses.filter((address) => {
      if (!address.id) return false;

      return customer.shippingAddressIds?.includes(address.id);
    });
    const defaultShippingAddress = shippingAddresses.find(
      (address) => address.id === customer.defaultShippingAddressId,
    );
    const remainingShippingAddresses = shippingAddresses.filter(
      (address) => address.id !== customer.defaultShippingAddressId,
    );
    const sortedShippingAddresses = defaultShippingAddress
      ? [defaultShippingAddress, ...remainingShippingAddresses]
      : shippingAddresses;

    const unsortedAddresses = customer.addresses.filter((address) => {
      if (!address.id) return false;

      return !customer.billingAddressIds?.includes(address.id) && !customer.shippingAddressIds?.includes(address.id);
    });

    const unique = AccountController.getAddressComparisons(billingAddresses, shippingAddresses);

    AccountController.updateAddressComponents(
      sortedBillingAddresses,
      this.addressesComponentsBilling,
      this.page.billingAddressesList.getElement(),
      BillingAddressAccount,
      unique,
    );

    AccountController.updateAddressComponents(
      sortedShippingAddresses,
      this.addressesComponentsShipping,
      this.page.shippingAddressesList.getElement(),
      ShippingAddressAccount,
      unique,
    );

    AccountController.updateAddressComponents(
      unsortedAddresses,
      this.addressesComponentsUnsorted,
      this.page.unsortedAddressesList.getElement(),
      UnsortedAddressAccount,
      unique,
    );
  };

  private static updateAddressComponents<
    T extends {
      currentAddressId: string;
      updateData: (
        address: Address,
        unique: { commonIds: Address[]; uniqueBilling: Address[]; uniqueShipping: Address[] },
      ) => void;
      getElement: () => HTMLElement;
    },
  >(
    newAddresses: Address[],
    currentComponents: T[],
    containerEl: HTMLElement,
    ComponentType: { new (parameters: Partial<IParameters>, ind: number): T },
    unique: { commonIds: Address[]; uniqueBilling: Address[]; uniqueShipping: Address[] },
  ): void {
    if (containerEl.childElementCount === 1 && containerEl.firstElementChild?.textContent === 'Nothing here...') {
      containerEl.firstElementChild.remove();
    }

    newAddresses.forEach((newAddress, index) => {
      const existingComp = currentComponents.find((comp) => comp.currentAddressId === newAddress.id);

      if (existingComp) {
        existingComp.updateData(newAddress, unique);
      } else {
        const comp = new ComponentType({}, index);

        comp.updateData(newAddress, unique);
        currentComponents.push(comp);
        containerEl.appendChild(comp.getElement());
      }
    });

    for (let i = currentComponents.length - 1; i >= 0; i--) {
      const comp = currentComponents[i];

      if (!newAddresses.some((address) => address.id === comp.currentAddressId)) {
        comp.getElement().remove();
        currentComponents.splice(i, 1);
      }
    }

    if (currentComponents.length === 0) {
      const emptyElem = document.createElement('div');

      emptyElem.textContent = 'Nothing here...';
      emptyElem.style.display = 'flex';
      emptyElem.style.alignItems = 'center';
      emptyElem.style.height = '80px';
      emptyElem.style.width = '100%';
      emptyElem.style.borderBottom = '1px dotted black';
      containerEl.appendChild(emptyElem);
    }
  }

  private onChangeInputs = (event: Event): void => {
    if (!(isHTMLInputElement(event.target) || isHTMLSelectElement(event.target))) return;

    const inputName = convertInputName(event.target.name);

    if (isHTMLCheckboxElement(event.target)) {
      const value = event.target.checked;

      if (isFormName(inputName)) {
        this.model.setBooleanValue(value, inputName);
      }
    } else {
      const value = event.target.value;

      if (isFormNameAcc(inputName)) {
        this.model.setStringValue(value, inputName);
      }
    }

    this.checkAndShowErrors();
  };

  private checkAndShowErrors(): void {
    this.page.deleteErrorMessage();
    this.model.validateForm();
    this.model.errorsAcc.forEach((name) => this.page.renderErrorMassage(name));
    this.model.determineValidForm();
  }

  public render(): void {
    const layout = Layout.getInstance();
    const mainEl = this.page;

    if (mainEl) {
      layout.setMainContent(mainEl.getHtmlElement());
    }
  }
}
