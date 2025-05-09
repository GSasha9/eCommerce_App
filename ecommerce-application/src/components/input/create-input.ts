import './_input.scss';
import { CreateElement } from '../../shared/utils/create-element.ts';
import type { IParameters, IParametersInput } from '../../shared/models/interfaces';
import './_input.scss';

export class CreateInput extends CreateElement {
  private input: HTMLInputElement;

  constructor(parameters: IParametersInput) {
    const inputParams: IParameters = {
      tag: 'input',
      classNames: ['root', ...(parameters.classNames || [])],
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
