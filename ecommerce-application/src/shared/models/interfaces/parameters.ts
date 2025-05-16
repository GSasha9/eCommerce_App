import type { CreateElement } from '../../utils/create-element';

export type IParameters = {
  tag: keyof HTMLElementTagNameMap;
  classNames: string[];
  textContent?: string;
  callback?: (callback: MouseEvent) => void | Promise<void>;
  children?: (CreateElement | HTMLElement)[];
  dataAttr?: Record<string, string>;
};
