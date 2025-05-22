import Element from '../../components/element/element.ts';
import { CreateInput } from '../../components/input/create-input.ts';
import { Label } from '../../components/label/label.ts';
import type { IParameters } from '../../shared/models/interfaces/index.ts';
import { CreateElement } from '../../shared/utils/create-element.ts';

import './styles.scss';

export class CredentialElements extends CreateElement {
  public inputEmail: CreateInput;
  public inputPassword: CreateInput;
  public emailLabel: Label;
  public passwordLabel: Label;
  public email: CreateElement;
  public password: CreateElement;
  public visibilityIcon: Element<'button'>;

  constructor(parameters: Partial<IParameters> = {}) {
    super({ tag: 'div', classNames: ['group'], ...parameters });

    this.emailLabel = new Label({ classNames: ['label'], for: 'email', textContent: 'Email:' });
    this.inputEmail = new CreateInput({
      classNames: ['email'],
      id: 'email',
      name: 'email',
      placeholder: 'your email',
    });

    this.passwordLabel = new Label({ classNames: ['label'], for: 'password', textContent: 'Password:' });
    this.visibilityIcon = new Element({
      tag: 'button',
      className: 'visibility-icon',
      type: 'button',
    });
    this.inputPassword = new CreateInput({
      classNames: ['password'],
      id: 'password',
      name: 'password',
      placeholder: '********',
      type: 'password',
    });

    this.email = new CreateElement({
      tag: 'div',
      classNames: ['input', 'input-email'],
      children: [this.emailLabel, this.inputEmail],
    });
    this.password = new CreateElement({
      tag: 'div',
      classNames: ['input', 'input-password'],
      children: [this.passwordLabel, this.visibilityIcon.node, this.inputPassword],
    });

    this.addInnerElement([this.email, this.password]);
  }
}
