import { CreateInput } from '../../components/input/create-input.ts';
import { Label } from '../../components/label/label.ts';
import type { IParameters } from '../../shared/models/interfaces/index.ts';
import { CreateElement } from '../../shared/utils/create-element.ts';

import './styles.scss';

export class PersonalInfoElements extends CreateElement {
  public inputName: CreateInput;
  public inputSurname: CreateInput;
  public inputBirthday: CreateInput;
  public nameLabel: Label;
  public surnameLabel: Label;
  public birthdayLabel: Label;
  public name: CreateElement;
  public surname: CreateElement;
  public birthday: CreateElement;

  constructor(parameters: Partial<IParameters> = {}) {
    super({ tag: 'div', classNames: ['group'], ...parameters });

    this.nameLabel = new Label({ classNames: ['label'], for: 'name', textContent: 'First name:' });
    this.inputName = new CreateInput({
      classNames: ['name'],
      placeholder: 'your name',
      id: 'name',
      name: 'name',
    });
    this.surnameLabel = new Label({ classNames: ['label'], for: 'surname', textContent: 'Last name:' });
    this.inputSurname = new CreateInput({
      classNames: ['surname'],
      placeholder: 'your surname',
      id: 'surname',
      name: 'surname',
    });
    this.birthdayLabel = new Label({
      classNames: ['label'],
      for: 'birthday',
      textContent: 'Date of birth:',
    });
    this.inputBirthday = new CreateInput({
      classNames: ['birthday'],
      placeholder: 'your birthday',
      id: 'birthday',
      name: 'birthday',
      type: 'date',
    });

    this.name = new CreateElement({
      tag: 'div',
      classNames: ['input', 'input-name'],
      children: [this.nameLabel, this.inputName],
    });
    this.surname = new CreateElement({
      tag: 'div',
      classNames: ['input', 'input-surname'],
      children: [this.surnameLabel, this.inputSurname],
    });
    this.birthday = new CreateElement({
      tag: 'div',
      classNames: ['input', 'input-birthday'],
      children: [this.birthdayLabel, this.inputBirthday],
    });

    this.addInnerElement([this.name, this.surname, this.birthday]);
  }
}
