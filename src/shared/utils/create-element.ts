import type { ICreateElement, IParameters } from '../models/interfaces';

export class CreateElement implements ICreateElement {
  private readonly element: HTMLElement;

  constructor(parameters: IParameters) {
    this.element = document.createElement(parameters.tag);
    this.setCssClasses(parameters.classNames);
    this.setTextContent(parameters.textContent);
    this.setDataAttrsClasses(parameters.dataAttr);
    this.setCallback(parameters.callback);

    if (parameters.children) {
      parameters.children.forEach((child) => this.addInnerElement(child));
    }
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public addInnerElement(element: HTMLElement | CreateElement | CreateElement[]): void {
    if (element instanceof CreateElement) {
      this.element.append(element.getElement());
    } else if (Array.isArray(element)) {
      this.element.append(...element.map((elem) => elem.getElement()));
    } else {
      this.element.append(element);
    }
  }

  public setCssClasses(cssClasses: string[] = []): void {
    for (const cssClass of cssClasses) {
      this.element.classList.add(cssClass);
    }
  }

  public setDataAttrsClasses(dataAttrs?: Record<string, string>): void {
    for (const attr in dataAttrs) {
      this.element.dataset[attr] = dataAttrs[attr];
    }
  }

  public setTextContent(text: string = ''): void {
    this.element.textContent = text;
  }

  public setCallback(callback?: (event: MouseEvent) => void): void {
    if (typeof callback === 'function') {
      this.element.addEventListener('click', (event: MouseEvent) => callback(event));
    }
  }
}
