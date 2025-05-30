type CategoryId = string[];
type RangeOfPrice = {
  from: number | string;
  to: number | '*';
};
type Sort = {
  parameter: 'name.en-US' | 'price';
  method: 'asc' | 'desc';
};

export type Filters = {
  categoriesId?: CategoryId;
  range?: RangeOfPrice;
  sort?: Sort;
  discount?: boolean;
};
