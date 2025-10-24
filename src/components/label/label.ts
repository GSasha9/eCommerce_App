import { ErrorMessage } from '../../shared/constants/error-message.ts';
import type { IParametersLabel } from '../../shared/models/interfaces/index.ts';
import { CreateElement } from '../../shared/utils/create-element.ts';
export class Label extends CreateElement {
  constructor(parameters: IParametersLabel) {
    super({ tag: 'label', classNames: parameters.classNames || [] });

    const element = this.getElement();

    if (!(element instanceof HTMLLabelElement)) {
      throw new Error(ErrorMessage.INPUT_CREATOR_INVALID);
    }

    if (parameters.for) {
      element.htmlFor = parameters.for;
    }

    if (parameters.textContent) {
      element.textContent = parameters.textContent;
    }
  }
}
