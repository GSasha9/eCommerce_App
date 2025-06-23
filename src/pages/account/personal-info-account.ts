import type { Customer } from '@commercetools/platform-sdk';

import { CustomerProfileService } from '../../commerce-tools/customer-profile-service/customer-profile-service.ts';
import { CreateInput } from '../../components/input/create-input.ts';
import { Label } from '../../components/label/label.ts';
import { ModalGreeting } from '../../components/modals/modal-greeting.ts';
import { AccountModel } from '../../model/account/account-model.ts';
import type { IParameters } from '../../shared/models/interfaces';
import { CreateElement } from '../../shared/utils/create-element.ts';
import { UserState } from '../../state/customer-state.ts';

export class PersonalInfoElementsAccount extends CreateElement {
  public inputName: CreateInput;
  public inputSurname: CreateInput;
  public inputBirthday: CreateInput;
  public nameLabel: Label;
  public surnameLabel: Label;
  public birthdayLabel: Label;
  public nameContainer: CreateElement;
  public surnameContainer: CreateElement;
  public birthdayContainer: CreateElement;
  private data: Customer | undefined = undefined;
  private readonly editButton: CreateElement;
  private model: AccountModel;

  private readonly errorName: CreateElement;
  private readonly errorSurname: CreateElement;
  private readonly errorBirthday: CreateElement;

  constructor(parameters: Partial<IParameters> = {}) {
    super({ tag: 'div', classNames: ['group-info'], ...parameters });

    this.model = AccountModel.getInstance();

    this.nameLabel = new Label({
      classNames: ['label'],
      for: 'name',
      textContent: 'First name:',
    });
    this.surnameLabel = new Label({
      classNames: ['label'],
      for: 'surname',
      textContent: 'Last name:',
    });
    this.birthdayLabel = new Label({
      classNames: ['label'],
      for: 'birthday',
      textContent: 'Date of birth:',
    });

    this.inputName = new CreateInput({
      classNames: ['name'],
      placeholder: 'your name',
      id: 'name',
      name: 'name',
    });

    if (this.inputName.getElement() instanceof HTMLInputElement) {
      this.inputName.getElement().setAttribute('disabled', 'true');
    }

    this.inputSurname = new CreateInput({
      classNames: ['surname'],
      placeholder: 'your surname',
      id: 'surname',
      name: 'surname',
    });

    if (this.inputSurname.getElement() instanceof HTMLInputElement) {
      this.inputSurname.getElement().setAttribute('disabled', 'true');
    }

    this.inputBirthday = new CreateInput({
      classNames: ['birthday'],
      placeholder: 'your birthday',
      id: 'birthday',
      name: 'birthday',
      type: 'date',
    });

    if (this.inputBirthday.getElement() instanceof HTMLInputElement) {
      this.inputBirthday.getElement().setAttribute('disabled', 'true');
    }

    this.errorName = new CreateElement({
      tag: 'div',
      classNames: ['error-message'],
      textContent: '',
    });
    this.errorSurname = new CreateElement({
      tag: 'div',
      classNames: ['error-message'],
      textContent: '',
    });
    this.errorBirthday = new CreateElement({
      tag: 'div',
      classNames: ['error-message'],
      textContent: '',
    });

    this.nameContainer = new CreateElement({
      tag: 'div',
      classNames: ['input', 'input-name'],
      children: [this.nameLabel, this.inputName, this.errorName],
    });
    this.surnameContainer = new CreateElement({
      tag: 'div',
      classNames: ['input', 'input-surname'],
      children: [this.surnameLabel, this.inputSurname, this.errorSurname],
    });
    this.birthdayContainer = new CreateElement({
      tag: 'div',
      classNames: ['input', 'input-birthday'],
      children: [this.birthdayLabel, this.inputBirthday, this.errorBirthday],
    });

    this.editButton = new CreateElement({
      tag: 'button',
      textContent: 'Edit',
      classNames: ['root-button', 'edit'],
      callback: (evt): void => {
        evt.preventDefault();

        if (this.editButton.getElement().classList.contains('save')) {
          void this.onSavePersonalInfo();
        } else {
          this.onEdit(true);
        }
      },
    });

    this.addInnerElement([this.nameContainer, this.surnameContainer, this.birthdayContainer, this.editButton]);

    UserState.getInstance().subscribe(this.onCustomerUpdate);
  }

  public onCustomerUpdate = (customer: Customer | undefined): void => {
    this.data = customer;

    if (this.data) {
      const nameInputEl = this.inputName.getElement();

      if (nameInputEl instanceof HTMLInputElement) {
        nameInputEl.value = this.data.firstName ?? '';
      }

      const surnameInputEl = this.inputSurname.getElement();

      if (surnameInputEl instanceof HTMLInputElement) {
        surnameInputEl.value = this.data.lastName ?? '';
      }

      const birthdayInputEl = this.inputBirthday.getElement();

      if (birthdayInputEl instanceof HTMLInputElement) {
        birthdayInputEl.value = this.data.dateOfBirth ?? '';
      }

      this.model.setStringValue(this.data.firstName ?? '', 'name');
      this.model.setStringValue(this.data.lastName ?? '', 'surname');
      this.model.setStringValue(this.data.dateOfBirth ?? '', 'birthday');
    }
  };

  private onEdit(isEdit: boolean): void {
    const btn = this.editButton.getElement();

    if (!(btn instanceof HTMLButtonElement)) {
      console.warn("Edit button isn't an HTMLButtonElement.");

      return;
    }

    if (isEdit) {
      this.setEditable(true);
      btn.classList.remove('edit');
      btn.classList.add('save');
      btn.textContent = 'Save';
    } else {
      this.setEditable(false);
      btn.classList.remove('save');
      btn.classList.add('edit');
      btn.textContent = 'Edit';
    }
  }

  public setEditable(isEditable: boolean): void {
    const inputs = [this.inputName.getElement(), this.inputSurname.getElement(), this.inputBirthday.getElement()];

    inputs.forEach((el) => {
      if (el instanceof HTMLInputElement) {
        if (isEditable) {
          el.removeAttribute('disabled');
        } else {
          el.setAttribute('disabled', 'true');
        }
      }
    });
  }

  private async onSavePersonalInfo(): Promise<void> {
    const nameEl = this.inputName.getElement();
    const surnameEl = this.inputSurname.getElement();
    const birthdayEl = this.inputBirthday.getElement();

    if (
      !(
        nameEl instanceof HTMLInputElement &&
        surnameEl instanceof HTMLInputElement &&
        birthdayEl instanceof HTMLInputElement
      )
    ) {
      return;
    }

    const newFirstName = nameEl.value;
    const newLastName = surnameEl.value;
    const newBirthday = birthdayEl.value;

    this.model.setStringValue(newFirstName, 'name');
    this.model.setStringValue(newLastName, 'surname');
    this.model.setStringValue(newBirthday, 'birthday');

    if (!this.model.validatePersonalInfo()) {
      return;
    }

    const currentCustomer = UserState.getInstance().customer;

    if (!currentCustomer) {
      console.warn('Customer state not found.');

      return;
    }

    const updatedData = {
      version: currentCustomer.version,
      firstName: newFirstName,
      lastName: newLastName,
      dateOfBirth: newBirthday,
    };

    try {
      const updatedCustomer: Customer = await CustomerProfileService.updateCustomerData(updatedData);

      UserState.getInstance().customer = updatedCustomer;
      const modal = new ModalGreeting('Your data was saved successfully');

      void modal.open();
    } catch (error) {
      console.error('Failed to update customer data:', error);
    } finally {
      this.onEdit(false);
    }
  }
}
