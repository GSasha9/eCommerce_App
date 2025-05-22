import type { IButtonParameters, IParameters } from '../../shared/models/interfaces/index.ts';
import { CreateElement } from '../../shared/utils/create-element.ts';

import './styles.scss';

export class CreateButton extends CreateElement {
  private button: HTMLButtonElement;

  constructor(parameters: IButtonParameters) {
    const buttonParams: IParameters = {
      tag: 'button',
      classNames: ['root-button', ...(parameters.classNames || [])],
      textContent: parameters.textContent,
      callback: parameters.callback,
    };

    super(buttonParams);

    const element: HTMLElement = this.getElement();

    if (!(element instanceof HTMLButtonElement)) {
      throw new Error('ButtonCreator must create an HTMLButtonElement');
    }

    this.button = element;

    this.button.type = parameters.type || 'button';

    if (parameters.disabled) {
      this.button.disabled = true;
    }
  }

  public setDisabled(disabled: boolean): void {
    this.button.disabled = disabled;
  }

  public isDisabled(): boolean {
    return this.button.disabled;
  }

  public setType(type: 'button' = 'button'): void {
    this.button.type = type;
  }

  public getType(): string {
    return this.button.type;
  }
}
