import type { IParameters } from './parameters';

export interface IParametersInput extends Omit<IParameters, 'tag'> {
  placeholder?: string;
  type?: string;
  value?: string;
  name?: string;
  id?: string;
}
