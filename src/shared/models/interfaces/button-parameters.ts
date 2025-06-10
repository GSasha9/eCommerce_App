import type { IParameters } from './parameters.ts';

export interface IButtonParameters extends Omit<IParameters, 'tag'> {
  type?: 'button' | 'submit';
  disabled?: boolean;
}
