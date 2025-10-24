import type { CreateElement } from '../../utils/create-element.ts';
import type { IParameters } from './index.ts';

export interface IViewMain {
  getHtmlElement(): HTMLElement;
  createView(parameters: Partial<IParameters>): CreateElement;
}
