import type { ProductProjection } from '@commercetools/platform-sdk';

import { authService } from '../../commerce-tools/auth-service';
import type CatalogController from '../../controllers/catalog/catalog-controller';
import type { ProductPerPageResponse } from '../../shared/models/type';

export class CatalogModel {
  private static instance: CatalogModel;
  public allProducts: ProductProjection[];
  public filteredProducts: ProductProjection[];
  public controller: CatalogController;

  private constructor(controller: CatalogController) {
    this.controller = controller;
    this.allProducts = [];
    this.filteredProducts = [];
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

      if (response) {
        for (const el of response) {
          const name = el.name?.['en'] ?? el.name?.['en-US'] ?? 'No description available';

          if (el.key) {
            const products = await authService.fetchProductsByCategory(el.key);

            const amount = products?.length ?? 0;

            this.controller.addCategory(name, amount);
          }
        }
      }
    } catch (error) {
      console.warn(error);
    }
  }

  public async fetchAllProducts(): Promise<ProductPerPageResponse | undefined> {
    let response;

    try {
      response = await authService.fetchProducts();

      if (response) this.allProducts = response.products;
    } catch (error) {
      console.warn(error);
    }

    if (response) return response;
  }

  public async filterProductByCategory(event: Event): Promise<ProductProjection[] | undefined> {
    const clickedCategory = event.target;

    if (clickedCategory instanceof HTMLParagraphElement && clickedCategory.textContent) {
      try {
        const response = await authService.fetchProductsByCategory(clickedCategory.textContent);

        if (response) {
          this.filteredProducts = response;

          return response;
        }
      } catch (error) {
        console.warn(error);
      }
    }
  }
}
