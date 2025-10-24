import type { IParameters } from './parameters.ts';

export interface IParametersLabel extends Omit<IParameters, 'tag'> {
  for?: string;
  textContent?: string;
}
