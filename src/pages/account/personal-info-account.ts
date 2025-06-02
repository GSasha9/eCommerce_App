import type { Customer } from '@commercetools/platform-sdk';

import { CreateInput } from '../../components/input/create-input.ts';
import { Label } from '../../components/label/label.ts';
import type { IParameters } from '../../shared/models/interfaces';
import { CreateElement } from '../../shared/utils/create-element.ts';

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
  private data: Customer | null = null;

  constructor(parameters: Partial<IParameters> = {}) {
    super({ tag: 'div', classNames: ['group'], ...parameters });

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

    this.nameContainer = new CreateElement({
      tag: 'div',
      classNames: ['input', 'input-name'],
      children: [this.nameLabel, this.inputName],
    });
    this.surnameContainer = new CreateElement({
      tag: 'div',
      classNames: ['input', 'input-surname'],
      children: [this.surnameLabel, this.inputSurname],
    });
    this.birthdayContainer = new CreateElement({
      tag: 'div',
      classNames: ['input', 'input-birthday'],
      children: [this.birthdayLabel, this.inputBirthday],
    });

    this.addInnerElement([this.nameContainer, this.surnameContainer, this.birthdayContainer]);
  }

  public onCustomerUpdate = (customer: Customer | null): void => {
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
    }
  };

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
}
