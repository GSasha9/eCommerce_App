import type { IParameters } from './parameters.ts';

export interface IButtonParameters extends IParameters {
  type: 'button';
  disabled: boolean;
}
