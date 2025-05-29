import type { ProductProjection } from '@commercetools/platform-sdk';

import { authService } from '../../commerce-tools/auth-service';
import type CatalogController from '../../controllers/catalog/catalog-controller';
import type { ProductPerPageResponse } from '../../shared/models/type';

export class CatalogModel {
  private static instance: CatalogModel;
  public allCategories: Map<string, string>;
  public allProducts: Map<string, ProductProjection[]>;
  public filteredProducts: Map<string, ProductProjection[]>;
  public controller: CatalogController;

  private constructor(controller: CatalogController) {
    this.controller = controller;
    this.allCategories = new Map();
    this.allProducts = new Map();
    this.filteredProducts = new Map();
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

            this.allCategories.set(el.id, el.key);

            this.controller.addCategory(name, amount);
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
        response.products.forEach((product) => {
          const categoryId = String(product.categories?.[0]?.id);
          const productCategory = this.allCategories.get(categoryId) || 'no-category';

          if (this.allProducts.has(productCategory)) {
            const currentList = this.allProducts.get(productCategory) || [];

            currentList.push(product);

            this.allProducts.set(productCategory, currentList);
          } else {
            this.allProducts.set(productCategory, [product]);
          }
        });
      }

      console.log('allProd from model', this.allProducts);

      return response;
    } catch (error) {
      console.warn(error);
    }
  }

  public applyCategoryFilters(event: Event): void {
    const clickedCategory = event.target;

    if (!(clickedCategory instanceof HTMLParagraphElement) || !clickedCategory.textContent) return;

    const categoryName = clickedCategory.textContent;

    if (this.filteredProducts.has(categoryName)) {
      this.filteredProducts.delete(categoryName);
    } else {
      const products = this.allProducts.get(categoryName) || [];

      this.filteredProducts.set(categoryName, products);
    }

    console.log(this.filteredProducts);
  }
}
