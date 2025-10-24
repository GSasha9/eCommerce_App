import type { ProductProjection } from '@commercetools/platform-sdk';

export type ProductPerPageResponse = {
  products: ProductProjection[];
  total: number | undefined;
  currentPage: number;
  totalPages: number;
};
