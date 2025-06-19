import type {
  Category,
  ClientResponse,
  ProductProjection,
  ProductProjectionPagedSearchResponse,
} from '@commercetools/platform-sdk';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Filters } from '../controllers/catalog/models/interfaces/filters';
import { CatalogModel } from '../model/catalog/catalog-model';
import type { ProductPerPageResponse } from '../shared/models/type';

vi.mock('../pages/catalog/models/utils/observer.ts', () => ({
  constructor(): void {},
  observe(): void {},
  unobserve(): void {},
  disconnect(): void {},
}));

const mockProducts: ProductProjection[] = [
  {
    id: '1',
    name: { en: 'Test' },
    masterVariant: { id: 1 },
    categories: [],
    createdAt: '',
    lastModifiedAt: '',
    productType: { id: '', typeId: 'product-type' },
    slug: {},
    variants: [],
    version: 1,
  },
];

vi.mock('../commerce-tools/auth-service', () => ({
  authService: {
    getPlantSubCategories: (): Promise<Record<string, Category[]>> => {
      return Promise.resolve({
        plants: [
          {
            ancestors: [],
            createdAt: '',
            lastModifiedAt: '',
            orderHint: '',
            slug: {},
            version: 1,
            key: 'cat-1',
            id: 'id-1',
            name: { en: 'Cactus' },
          },
        ],
      });
    },
    fetchProductsByCategory: (): Promise<ProductProjection[] | undefined> => {
      return Promise.resolve([
        {
          id: '1',
          name: { en: 'Test' },
          masterVariant: { id: 1 },
          categories: [],
          createdAt: '',
          lastModifiedAt: '',
          productType: { id: '', typeId: 'product-type' },
          slug: {},
          variants: [],
          version: 1,
        },
      ]);
    },
    fetchProducts: (): Promise<ProductPerPageResponse> => {
      return Promise.resolve({
        products: mockProducts,
        currentPage: 1,
        total: 1,
        totalPages: 1,
      });
    },
    searchProducts: (): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> => {
      return Promise.resolve({
        body: {
          results: mockProducts,
          count: 1,
          limit: 1,
          offset: 0,
        },
      });
    },
  },
}));

import CatalogController from '../controllers/catalog/catalog-controller';

describe('CatalogModel', () => {
  let model: CatalogModel;

  beforeEach(() => {
    vi.clearAllMocks();
    model = CatalogModel.getInstance(new CatalogController());
  });

  it('fetches categories and sets data correctly', async () => {
    await model.fetchCategories();

    expect(model.categories.get('cat-1')).toBe('id-1');
  });

  it('fetchAllProducts stores products correctly', async () => {
    const response: ProductPerPageResponse = {
      products: mockProducts,
      currentPage: 1,
      total: 1,
      totalPages: 1,
    };

    const result = await model.fetchAllProducts();

    expect(model.allProducts).toEqual(mockProducts);
    expect(result).toEqual(response);
  });

  it('applyFilters builds query and updates filteredProducts', async () => {
    const filters: Filters = {
      categoriesId: ['id-1', 'id-2'],
      range: { from: 10, to: 20 },
      discount: true,
      height: ['low', 'tall'],
      sort: { parameter: 'name', method: 'asc' },
      text: 'fern',
    };

    await model.applyFilters(filters);

    expect(model.filteredProducts).toEqual(mockProducts);
  });
});
