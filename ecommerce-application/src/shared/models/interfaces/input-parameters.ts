import type { IParameters } from './parameters';

export interface IParametersInput extends IParameters {
  placeholder?: string;
  type?: string;
  value?: string;
}
