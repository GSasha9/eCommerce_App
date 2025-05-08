import type { CreateElement } from '../../utils/create-element.ts';
import type { IParameters } from '../interfaces';

export interface IViewMain {
  getHtmlElement(): HTMLElement;
  createView(parameters: Partial<IParameters>): CreateElement;
}
