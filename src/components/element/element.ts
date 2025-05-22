type IParameters<T extends keyof HTMLElementTagNameMap> = Omit<Partial<HTMLElementTagNameMap[T]>, 'children'> & {
  tag: T;
  children?: HTMLElement | string | (HTMLElement | string)[];
};

class Element<T extends keyof HTMLElementTagNameMap> {
  public readonly node: HTMLElementTagNameMap[T];

  constructor({ tag, children, dataset, ...rest }: IParameters<T>) {
    const node = document.createElement(tag);

    this.node = Object.assign(node, rest);

    if (Array.isArray(children)) {
      children.forEach((child) => this.addChild(child));
    } else if (children) {
      this.addChild(children);
    }

    if (dataset) {
      Object.assign(this.node.dataset, dataset);
    }
  }

  public addChild(element: HTMLElement | string): void {
    this.node.append(element);
  }
}

export default Element;
