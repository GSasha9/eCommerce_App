import type { CategoryId } from '../types';
import type { Sort } from '.';
import type { RangeOfPrice } from '.';

export interface Filters {
  categoriesId?: CategoryId;
  range?: RangeOfPrice;
  sort?: Sort;
  discount?: boolean;
  text?: string;
  height?: string[];
}
