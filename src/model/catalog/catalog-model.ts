import { authService } from '../../commerce-tools/auth-service';
import type CatalogController from '../../controllers/catalog/catalog-controller';
import type { ProductPerPageResponse } from '../../shared/models/type';

export class CatalogModel {
  private static instance: CatalogModel;
  public controller: CatalogController;
  public categories: Map<string, string>;
  public filters: Map<string, []>;

  private constructor(controller: CatalogController) {
    this.controller = controller;
    this.categories = new Map();
    this.filters = new Map();
  }

  public static getInstance(controller: CatalogController): CatalogModel {
    if (!CatalogModel.instance) {
      CatalogModel.instance = new CatalogModel(controller);
    }

    return CatalogModel.instance;
  }

  public async fetchCategories(): Promise<void> {
    try {
      const response = await authService.getPlantCategories();

      console.log(response);

      if (response) {
        for (const el of response) {
          const name = el.name?.['en'] ?? el.name?.['en-US'] ?? 'No description available';

          if (el.key) {
            const products = await authService.fetchProductsByCategory(el.key);

            const amount = products?.length ?? 0;

            this.controller.addCategory(name, amount);

            if (this.categories.get(el.key)) continue;

            this.categories.set(el.key, el.id);
          }
        }
      }
    } catch (error) {
      console.warn(error);
    }
  }

  public static async fetchAllProducts(): Promise<ProductPerPageResponse | undefined> {
    try {
      const response = await authService.fetchProducts();

      if (response) return response;
    } catch (error) {
      console.warn(error);
    }
  }

  public async applyFilters(): Promise<void> {
    const response = await authService.searchProducts();

    console.log(response);

    console.log(this);
  }
}
