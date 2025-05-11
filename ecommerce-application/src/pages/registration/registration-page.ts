import type { IParameters } from '../../shared/models/interfaces';
import { CreateElement } from '../../shared/utils/create-element.ts';
import { View } from '../view.ts';
import { CreateButton } from '../../components/button/create-button.ts';
import './registration.scss';
import { CredentialElements } from './credentials-elements.ts';
import { PersonalInfoElements } from './personal-info-elements.ts';
import { ShippingAddressElements } from './shipping-address-elements.ts';
import { BillingAddressElements } from './billing-address-elements.ts';
import Element from '../../components/element/element.ts';

class RegistrationPage extends View {
  public homeButton: CreateButton;
  public credentialElements: CredentialElements;
  public personalInfoElements: PersonalInfoElements;
  public shippingAddressElements: ShippingAddressElements;
  public billingAddressElements: BillingAddressElements;
  public containerForm: Element<'form'>;
  public registrationButton: CreateButton;

  constructor(parameters: Partial<IParameters> = {}) {
    super({ tag: 'div', classNames: ['registration-page'], ...parameters });
    this.credentialElements = new CredentialElements();
    this.personalInfoElements = new PersonalInfoElements();
    this.shippingAddressElements = new ShippingAddressElements();
    this.billingAddressElements = new BillingAddressElements();

    const mainTitle = new CreateElement({
      tag: 'h2',
      classNames: ['title-registration'],
      textContent: 'Registration',
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

    this.registrationButton = new CreateButton({
      classNames: ['register'],
      textContent: 'REGISTER',
      disabled: true,
    });

    this.containerForm = new Element({
      tag: 'form',
      className: 'wrapper-form',
      children: [
        mainTitle.getElement(),
        this.credentialElements.getElement(),
        personalInfoTitle.getElement(),
        this.personalInfoElements.getElement(),
        shippingAddressTitle.getElement(),
        this.shippingAddressElements.getElement(),
        billingAddressTitle.getElement(),
        this.billingAddressElements.getElement(),
        this.registrationButton.getElement(),
      ],
    });

    this.viewElementCreator.addInnerElement(this.containerForm.node);
  }

  public renderDisabledRegister(isDisabled: boolean): void {
    console.log('REND');

    if (isDisabled) {
      this.registrationButton.getElement().setAttribute('disabled', 'true');
    } else {
      this.registrationButton.getElement().setAttribute('disabled', 'false');
    }
  }

  public renderErrorMassage(inputName: string, message: string): void {
    const elem = this.containerForm.node.querySelector(`.input-${inputName}`);

    const node = new CreateElement({
      tag: 'div',
      classNames: ['error-message'],
      textContent: `${message}`,
    });

    if (elem) {
      elem.append(node.getElement());
    }
  }

  public deleteErrorMessage(inputName: string): void {
    const elem = this.containerForm.node.querySelector(`.input-${inputName}`);

    if (elem?.children && elem?.children.length > 2) {
      if (elem?.lastElementChild) {
        elem?.lastElementChild.remove();
      }
    }
  }
}

export default RegistrationPage;
