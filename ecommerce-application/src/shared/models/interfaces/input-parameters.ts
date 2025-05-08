import type { IParameters } from './parameters.ts';

export interface IParametersInput extends IParameters {
  placeholder?: string;
  type?: string;
  value?: string;
}
