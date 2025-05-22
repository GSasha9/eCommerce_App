import type { IParametersLabel } from '../../shared/models/interfaces/index.ts';
import { CreateElement } from '../../shared/utils/create-element.ts';
export class Label extends CreateElement {
  constructor(parameters: IParametersLabel) {
    super({ tag: 'label', classNames: parameters.classNames || [] });

    const element = this.getElement();

    if (!(element instanceof HTMLLabelElement)) {
      throw new Error('InputCreator must create an HTMLInputElement');
    }

    if (parameters.for) {
      element.htmlFor = parameters.for;
    }

    if (parameters.textContent) {
      element.textContent = parameters.textContent;
    }
  }
}
