import type { IParameters } from '../../shared/models/interfaces/index.ts';
import { CreateElement } from '../../shared/utils/create-element.ts';
import { View } from '../view.ts';
import { CreateButton } from '../../components/button/create-button.ts';
import './registration.scss';
import { CredentialElements } from './credentials-elements.ts';
import { PersonalInfoElements } from './personal-info-elements.ts';
import { ShippingAddressElements } from './shipping-address-elements.ts';
import { BillingAddressElements } from './billing-address-elements.ts';
import Element from '../../components/element/element.ts';
import type RegistrationModel from '../../model/registration/registration-model.ts';
import { MESSAGE_CONTENT } from '../../shared/constants/messages-for-validator.ts';
import { isFormName } from '../../shared/models/typeguards.ts/typeguards.ts';
import { route } from '../../router/index.ts';

class RegistrationPage extends View {
  private static instance: RegistrationPage;
  public homeButton: CreateButton;
  public credentialElements: CredentialElements;
  public personalInfoElements: PersonalInfoElements;
  public shippingAddressElements: ShippingAddressElements;
  public billingAddressElements: BillingAddressElements;
  public containerForm: Element<'form'>;
  public linkToSignIn: Element<'a'>;
  public wrapperQuestion: Element<'div'>;
  public registrationButton: CreateButton;

  private constructor(parameters: Partial<IParameters> = {}) {
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

    this.linkToSignIn = new Element<'a'>({
      tag: 'a',
      className: 'link-sign-in',
      href: '/login',
      textContent: 'Sign In',
    });
    this.wrapperQuestion = new Element<'div'>({
      tag: 'div',
      className: 'wrapper-question',
      children: [
        new Element<'div'>({
          tag: 'div',
          className: 'question',
          textContent: 'Already have an account?',
        }).node,
        this.linkToSignIn.node,
      ],
    });

    this.registrationButton = new CreateButton({
      classNames: ['register'],
      textContent: 'REGISTER',
      disabled: true,
    });

    this.containerForm = new Element<'form'>({
      tag: 'form',
      className: 'wrapper-form',
      children: [
        close.getElement(),
        mainTitle.getElement(),
        this.credentialElements.getElement(),
        personalInfoTitle.getElement(),
        this.personalInfoElements.getElement(),
        shippingAddressTitle.getElement(),
        this.shippingAddressElements.getElement(),
        billingAddressTitle.getElement(),
        this.billingAddressElements.getElement(),
        this.wrapperQuestion.node,
        this.registrationButton.getElement(),
      ],
    });

    this.viewElementCreator.addInnerElement(this.containerForm.node);
  }

  public static getInstance(parameters: Partial<IParameters> = {}): RegistrationPage {
    if (!RegistrationPage.instance) {
      RegistrationPage.instance = new RegistrationPage(parameters);
    }

    return RegistrationPage.instance;
  }

  public renderDisabledRegister(isValidForm: boolean): void {
    if (isValidForm) {
      this.registrationButton.getElement().removeAttribute('disabled');
    } else {
      this.registrationButton.getElement().setAttribute('disabled', 'true');
    }
  }

  public renderErrorMassage(inputName: string): void {
    const elem = this.containerForm.node.querySelector(`.input-${inputName}`);
    let message;

    if (isFormName(inputName)) {
      message = MESSAGE_CONTENT[inputName];
    }

    const node = new CreateElement({
      tag: 'div',
      classNames: ['error-message'],
      textContent: `${message}`,
    });

    if (elem) {
      elem.append(node.getElement());
    }
  }

  public deleteErrorMessage(): void {
    const messages = this.containerForm.node.querySelectorAll(`.error-message`);

    if (messages) {
      messages.forEach((message) => message.remove());
    }
  }

  public updateBillingAddress(model: RegistrationModel): void {
    const isDisabled = model.currentFormValues['isShippingAsBilling'];
    const street = this.billingAddressElements.inputStreet;
    const city = this.billingAddressElements.inputCity;
    const postal = this.billingAddressElements.inputPostalCode;
    const country = this.billingAddressElements.countryList;
    const isDefault = this.billingAddressElements.checkboxDefault;

    [street.getElement(), city.getElement(), postal.getElement(), country.node, isDefault.getElement()].forEach(
      (node) => {
        if (isDisabled) node.setAttribute('disabled', 'true');
        else node.removeAttribute('disabled');
      },
    );

    if (isDisabled) {
      const values = model.currentFormValues;

      street.setValue(values.street);
      city.setValue(values.city);
      postal.setValue(values['postalCode']);
      country.node.value = values.country;
      isDefault.setValue(values['isDefaultShipping']);
      model.setStringValue(values.street, 'streetBilling');
      model.setStringValue(values.city, 'cityBilling');
      model.setStringValue(values['postalCode'], 'postalCodeBilling');
      model.setStringValue(values['country'], 'countryBilling');
    }
  }
}

export default RegistrationPage;
