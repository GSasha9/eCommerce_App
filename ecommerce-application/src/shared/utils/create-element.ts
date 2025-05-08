import type { ICreateElement, IParameters } from '../models/interfaces';

export class CreateElement implements ICreateElement {
  private readonly element: HTMLElement;

  constructor(parameters: IParameters) {
    this.element = document.createElement(parameters.tag);
    this.setCssClasses(parameters.classNames);
    this.setTextContent(parameters.textContent);
    this.setCallback(parameters.callback);
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public addInnerElement(element: HTMLElement | CreateElement): void {
    if (element instanceof CreateElement) {
      this.element.append(element.getElement());
    } else {
      this.element.append(element);
    }
  }

  public setCssClasses(cssClasses: string[] = []): void {
    for (const cssClass of cssClasses) {
      this.element.classList.add(cssClass);
    }
  }

  public setTextContent(text: string = ''): void {
    this.element.textContent = text;
  }

  public setCallback(callback: (event: MouseEvent) => void): void {
    if (typeof callback === 'function') {
      this.element.addEventListener('click', (event: MouseEvent) => callback(event));
    }
  }
}
