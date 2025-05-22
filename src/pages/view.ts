import { CreateElement } from '../shared/utils/create-element.ts';
import type { IViewMain, IParameters } from '../shared/models/interfaces/index.ts';

export class View implements IViewMain {
  protected viewElementCreator: CreateElement;
  constructor(parameters: Partial<IParameters> = {}) {
    parameters = { tag: 'section', classNames: [], ...parameters };
    this.viewElementCreator = this.createView(parameters);
  }

  public getHtmlElement(): HTMLElement {
    return this.viewElementCreator.getElement();
  }

  public createView(parameters: Partial<IParameters>): CreateElement {
    const elementParameters: IParameters = {
      tag: parameters.tag || 'div',
      classNames: parameters.classNames || [],
      textContent: parameters.textContent || '',
      callback: parameters.callback || ((): void => {}),
    };

    this.viewElementCreator = new CreateElement(elementParameters);

    return this.viewElementCreator;
  }
}
