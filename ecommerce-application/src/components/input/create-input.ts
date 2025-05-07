import { CreateElement } from '../../shared/utils/create-element.ts';
import type { IParameters, IParametersInput } from '../../shared/models/interfaces';

export class CreateInput extends CreateElement {
  private input: HTMLInputElement;

  constructor(parameters: IParametersInput) {
    const inputParams: IParameters = {
      tag: 'input',
      classNames: parameters.classNames || [],
      textContent: '',
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
  }

  public getValue(): string {
    return this.input.value;
  }

  public setValue(value: string): void {
    this.input.value = value;
  }

  public setPlaceholder(placeholder: string): void {
    this.input.placeholder = placeholder;
  }
}
