import type { Handlers } from '../models/interfaces';

export const genElement = <T extends keyof HTMLElementTagNameMap>(
  tag: T,
  { dataset, onClick, ...attributes }: Partial<HTMLElementTagNameMap[T]> & Handlers = {},
  children?: (HTMLElement | string)[],
): HTMLElementTagNameMap[T] => {
  const element = Object.assign(document.createElement(tag), attributes);

  if (dataset) Object.assign(element.dataset, dataset);

  if (children && Array.isArray(children)) {
    element.append(...children);
  }

  if (onClick) {
    element.addEventListener('click', (e) => onClick(e));
  }

  return element;
};
