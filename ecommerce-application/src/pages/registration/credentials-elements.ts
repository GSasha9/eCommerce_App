import type { IParameters } from '../../shared/models/interfaces/index.ts';
import { CreateElement } from '../../shared/utils/create-element.ts';
import './registration.scss';
import { CreateInput } from '../../components/input/create-input.ts';
import { Label } from '../../components/label/label.ts';

export class CredentialElements extends CreateElement {
  public inputEmail: CreateInput;
  public inputPassword: CreateInput;
  public emailLabel: Label;
  public passwordLabel: Label;
  public email: CreateElement;
  public password: CreateElement;

  private inputEmailId = 'email';
  private inputPasswordId = 'password';

  constructor(parameters: Partial<IParameters> = {}) {
    super({ tag: 'div', classNames: ['group'], ...parameters });

    this.emailLabel = new Label({ classNames: ['label'], for: this.inputEmailId, textContent: 'Email:' });
    this.inputEmail = new CreateInput({
      classNames: ['input-email'],
      id: this.inputEmailId,
      name: this.inputEmailId,
      placeholder: 'your email',
    });
    this.passwordLabel = new Label({ classNames: ['label'], for: this.inputPasswordId, textContent: 'Password:' });
    this.inputPassword = new CreateInput({
      classNames: ['input-password'],
      id: this.inputPasswordId,
      name: this.inputPasswordId,
      placeholder: 'your password',
    });
    this.email = new CreateElement({
      tag: 'div',
      classNames: ['input'],
      children: [this.emailLabel, this.inputEmail],
    });
    this.password = new CreateElement({
      tag: 'div',
      classNames: ['input'],
      children: [this.passwordLabel, this.inputPassword],
    });

    this.addInnerElement([this.email, this.password]);
  }
}
