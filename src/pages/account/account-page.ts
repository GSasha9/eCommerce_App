import { CreateButton } from '../../components/button/create-button.ts';
import Element from '../../components/element/element.ts';
import { route } from '../../router';
import { MESSAGE_CONTENT } from '../../shared/constants/messages-for-validator.ts';
import type { IParameters } from '../../shared/models/interfaces';
import { isFormName } from '../../shared/models/typeguards.ts';
import { CreateElement } from '../../shared/utils/create-element.ts';
import { View } from '../view.ts';
import { BillingAddressesList } from './billing-adress-list.ts';
import { AddShippingAddressModal } from './new-shipping/new-shipping.ts';
import { ChangePasswordModal } from './password/password.ts';
import { PersonalInfoElementsAccount } from './personal-info-account.ts';
import { ShippingAddressesList } from './shiping-adressess-list.ts';
import { UnsortedAccountList } from './unsorted-account-list.ts';

import './style.scss';

class AccountPage extends View {
  private static instance: AccountPage;
  public homeButton: CreateButton;

  public containerForm: Element<'form'>;
  public personalInfoElements: PersonalInfoElementsAccount;
  public billingAddressesList: BillingAddressesList;
  public shippingAddressesList: ShippingAddressesList;
  public unsortedAddressesList: UnsortedAccountList;
  private container: CreateElement;
  private buttonAdd: CreateElement;
  private buttonChange: CreateElement;

  private constructor(parameters: Partial<IParameters> = {}) {
    super({ tag: 'div', classNames: ['account-page'], ...parameters });
    this.personalInfoElements = new PersonalInfoElementsAccount();
    this.billingAddressesList = new BillingAddressesList();
    this.shippingAddressesList = new ShippingAddressesList();
    this.unsortedAddressesList = new UnsortedAccountList();
    const mainTitle = new CreateElement({
      tag: 'h2',
      classNames: ['title-registration'],
      textContent: 'Your account',
    });

    const close = new CreateElement({
      tag: 'a',
      classNames: ['close-reg'],
      textContent: '',
      callback: (event: Event): void => {
        event.preventDefault();
        route.navigate(`/home`);
      },
    });

    this.homeButton = new CreateButton({ classNames: ['not-found__button'], textContent: 'Go to Home' });
    const personalInfoTitle = new CreateElement({
      tag: 'h3',
      classNames: ['title'],
      textContent: 'Personal Info',
    });
    const shippingAddressTitle = new CreateElement({
      tag: 'h3',
      classNames: ['title'],
      textContent: 'Shipping Address',
    });
    const billingAddressTitle = new CreateElement({
      tag: 'h3',
      classNames: ['title'],
      textContent: 'Billing Address',
    });

    const unsortedAddressTitle = new CreateElement({
      tag: 'h3',
      classNames: ['title'],
      textContent: 'Uncategorized adresses',
    });

    this.container = new CreateElement({ tag: 'div', classNames: ['container-btn'] });

    this.buttonAdd = new CreateElement({
      tag: 'button',
      textContent: 'Add new',
      classNames: ['root-button', 'btn-add-change'],
      callback: (evt): void => {
        evt.preventDefault();
        const modal = new AddShippingAddressModal();

        modal.open();
      },
    });

    this.buttonChange = new CreateElement({
      tag: 'button',
      textContent: 'Change Password',
      classNames: ['root-button', 'btn-add-change'],
      callback: (evt): void => {
        evt.preventDefault();
        const changePasswordModal = new ChangePasswordModal();

        changePasswordModal.open();
      },
    });

    this.container.getElement().appendChild(this.buttonAdd.getElement());
    this.container.getElement().appendChild(this.buttonChange.getElement());

    this.containerForm = new Element<'form'>({
      tag: 'form',
      className: 'wrapper-form',
      children: [
        close.getElement(),
        mainTitle.getElement(),
        this.container.getElement(),
        personalInfoTitle.getElement(),
        this.personalInfoElements.getElement(),
        shippingAddressTitle.getElement(),
        this.shippingAddressesList.getElement(),
        billingAddressTitle.getElement(),
        this.billingAddressesList.getElement(),
        unsortedAddressTitle.getElement(),
        this.unsortedAddressesList.getElement(),
      ],
    });

    this.viewElementCreator.addInnerElement(this.containerForm.node);
  }

  public static getInstance(parameters: Partial<IParameters> = {}): AccountPage {
    if (!AccountPage.instance) {
      AccountPage.instance = new AccountPage(parameters);
    }

    return AccountPage.instance;
  }

  public renderErrorMassage(inputName: string): void {
    let selectorName = '';

    switch (inputName) {
      case 'postalCodeBilling':
        selectorName = 'postal-code-billing';

        break;
      case 'postalCode':
        selectorName = 'postal-code';

        break;
      case 'streetBilling':
        selectorName = 'street-billing';

        break;
      case 'cityBilling':
        selectorName = 'city-billing';

        break;
      case 'countryBilling':
        selectorName = 'country-billing';

        break;
      default:
        selectorName = inputName;

        break;
    }
    const elem = this.containerForm.node.querySelector(`.input-${selectorName}`);
    let message;

    if (isFormName(inputName)) {
      message = MESSAGE_CONTENT[inputName];
    }

    const node = new CreateElement({
      tag: 'div',
      classNames: ['error-message'],
      textContent: `${message}`,
    });

    if (elem && elem instanceof HTMLElement) {
      elem.append(node.getElement());
    }
  }

  public deleteErrorMessage(): void {
    const messages = this.containerForm.node.querySelectorAll(`.error-message`);

    if (messages) {
      messages.forEach((message): void => {
        if (message instanceof HTMLElement) {
          message.remove();
        }
      });
    }
  }
}

export default AccountPage;
