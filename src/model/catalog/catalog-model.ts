import type { CatalogPage } from '../../pages/catalog/catalog';

export class CatalogModel {
  private static instance: CatalogModel;
  public page: CatalogPage;

  private constructor(page: CatalogPage) {
    this.page = page;
  }

  public static getInstance(page: CatalogPage): CatalogModel {
    if (!CatalogModel.instance) {
      CatalogModel.instance = new CatalogModel(page);
    }

    return CatalogModel.instance;
  }
}
