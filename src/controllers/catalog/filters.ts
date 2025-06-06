import type { Sort } from './models/interfaces';
import type { RangeOfPrice } from './models/interfaces';
import type { CategoryId } from './models/types';

export interface Filters {
  categoriesId?: CategoryId;
  range?: RangeOfPrice;
  sort?: Sort;
  discount?: boolean;
  text?: string;
  height?: string[];
}
