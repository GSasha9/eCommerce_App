type CategoryId = string[];
type RangeOfPrice = {
  from: number | string;
  to: number | '*';
};
type Sort = {
  parameter: string;
  method: string;
};

export type Filters = {
  categoriesId?: CategoryId;
  range?: RangeOfPrice;
  sort?: Sort;
  discount?: boolean;
  text?: string;
  height?: string[];
};
