import type { CreateElement } from '../../utils/create-element.ts';

export interface ICreateElement {
  setCssClasses(cssClasses: string[]): void;
  addInnerElement(element: HTMLElement | CreateElement): void;
  setTextContent(text: string): void;
  setCallback(callback: (event: MouseEvent) => void): void;
}
