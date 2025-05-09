import type { IParameters } from '../../shared/models/interfaces';
import { CreateElement } from '../../shared/utils/create-element.ts';
import { View } from '../view.ts';
import { CreateButton } from '../../components/button/create-button.ts';
import './registration.scss';
import { CredentialElements } from './credentials-elements.ts';
import { PersonalInfoElements } from './personal-info-elements.ts';
import { ShippingAddressElements } from './shipping-address-elements.ts';
import { BillingAddressElements } from './billing-address-elements.ts';

class RegistrationPage extends View {
  public homeButton: CreateButton;
  public credentialElements: CredentialElements;
  public personalInfoElements: PersonalInfoElements;
  public shippingAddressElements: ShippingAddressElements;
  public billingAddressElements: BillingAddressElements;

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

    const container = new CreateElement({
      tag: 'form',
      classNames: ['wrapper-form'],
      children: [
        mainTitle,
        this.credentialElements,
        personalInfoTitle,
        this.personalInfoElements,
        shippingAddressTitle,
        this.shippingAddressElements,
        billingAddressTitle,
        this.billingAddressElements,
      ],
    });

    this.viewElementCreator.addInnerElement(container.getElement());
  }
}

export default RegistrationPage;
