import type { IParameters, IParametersInput } from '../../shared/models/interfaces/index.ts';
import { CreateElement } from '../../shared/utils/create-element.ts';

import './_input.scss';
import './_input.scss';

export class CreateInput extends CreateElement {
  private input: HTMLInputElement;

  constructor(parameters: IParametersInput) {
    const inputParams: IParameters = {
      tag: 'input',
      classNames: ['root-input', ...(parameters.classNames || [])],
      callback: parameters.callback,
    };

    super(inputParams);

    const element = this.getElement();

    if (!(element instanceof HTMLInputElement)) {
      throw new Error('InputCreator must create an HTMLInputElement');
    }

    this.input = element;

    this.input.type = parameters.type || 'text';
    this.input.placeholder = parameters.placeholder || '';

    if (parameters.value) {
      this.input.value = parameters.value;
    }

    if (parameters.id) {
      this.input.id = parameters.id;
    }

    if (parameters.name) {
      this.input.name = parameters.name;
    }

    if (parameters.autocomplete) {
      this.input.autocomplete = parameters.autocomplete;
    }
  }

  public getValue(): string {
    return this.input.value;
  }

  public setValue(value?: string | boolean): void {
    if (this.input.type === 'checkbox') {
      this.input.checked = Boolean(value);
    } else this.input.value = String(value || '');
  }

  public getPlaceholder(): string {
    return this.input.placeholder;
  }

  public setPlaceholder(placeholder: string): void {
    this.input.placeholder = placeholder;
  }
}
