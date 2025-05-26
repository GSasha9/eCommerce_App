export const genElement = <T extends keyof HTMLElementTagNameMap>(
  tag: T,
  { dataset, ...attributes }: Partial<HTMLElementTagNameMap[T]> = {},
  children?: (HTMLElement | string)[],
): HTMLElementTagNameMap[T] => {
  const element = Object.assign(document.createElement(tag), attributes);

  if (dataset) Object.assign(element.dataset, dataset);

  if (children && Array.isArray(children)) {
    element.append(...children);
  }

  return element;
};
