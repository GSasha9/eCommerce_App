import type { ProductProjection } from '@commercetools/platform-sdk';

import { authService } from '../../commerce-tools/auth-service';
import type CatalogController from '../../controllers/catalog/catalog-controller';
import type { Filters } from '../../controllers/catalog/filters';
import type { ProductPerPageResponse } from '../../shared/models/type';

export class CatalogModel {
  private static instance: CatalogModel;
  public controller: CatalogController;
  public categories: Map<string, string>;
  public filteredProducts: ProductProjection[];
  public allProducts: ProductProjection[];

  private constructor(controller: CatalogController) {
    this.controller = controller;
    this.categories = new Map();
    this.filteredProducts = [];
    this.allProducts = [];

    void this.fetchCategories();
  }

  public static getInstance(controller: CatalogController): CatalogModel {
    if (!CatalogModel.instance) {
      CatalogModel.instance = new CatalogModel(controller);
    }

    return CatalogModel.instance;
  }

  public async fetchCategories(): Promise<void> {
    try {
      const response = await authService.getPlantSubCategories();

      if (response) {
        this.controller.addCategory(Object.keys(response)[0]);
        for (const el of Object.values(response)[0]) {
          const name = el.name?.['en'] ?? el.name?.['en-US'] ?? 'No description available';

          if (el.key) {
            const products = await authService.fetchProductsByCategory(el.key);

            const amount = products?.length ?? 0;

            this.controller.addSubCategory(name, amount);

            if (this.categories.get(el.key)) continue;

            this.categories.set(el.key, el.id);
          }
        }
      }
    } catch (error) {
      console.warn(error);
    }
  }

  public async fetchAllProducts(): Promise<ProductPerPageResponse | undefined> {
    try {
      const response = await authService.fetchProducts();

      if (response) {
        this.allProducts = response.products;

        return response;
      }
    } catch (error) {
      console.warn(error);
    }
  }

  public async applyFilters(filters: Filters): Promise<void> {
    const filterQuery: string[] = [];

    if (filters.categoriesId && filters.categoriesId.length > 0) {
      const uniqueCategoryIds = Array.from(new Set(filters.categoriesId));
      const joinedIds = uniqueCategoryIds.map((id) => `"${id}"`).join(',');
      const categoryFilter = `categories.id:${joinedIds}`;

      filterQuery.push(categoryFilter);
    }

    if (filters.range) {
      const rangeFrom = typeof filters.range.from === 'number' ? filters.range.from * 100 : filters.range.from;

      const rangeTo = typeof filters.range.to === 'number' ? filters.range.to * 100 : filters.range.to;

      filterQuery.push(`variants.price.centAmount:range(${rangeFrom} to ${rangeTo})`);
    }

    if (filters.discount !== undefined) {
      filterQuery.push(`variants.prices.discounted:exists`);
    }

    let sort: string | undefined;

    if (filters.sort) {
      const parameter = filters.sort.parameter === 'name' ? 'name.en-US' : filters.sort.parameter;
      const method = filters.sort.method === 'asc' || filters.sort.method === 'desc' ? filters.sort.method : 'asc';

      sort = `${parameter} ${method}`;
    }

    let text: string | undefined;

    if (filters.text) {
      text = filters.text ?? '';
    }

    const response = await authService.searchProducts(filterQuery, sort, text);

    console.log(response);

    if (response) this.filteredProducts = response.body.results;
  }
}
