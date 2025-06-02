import type CatalogController from '../catalog-controller';

export const addSearchTextToFilters = (controller: CatalogController): void => {
  const value = controller.catalogPage.searchInput.getValue().trim();

  if (value === '') {
    delete controller.filters.text;
    void controller.showFilteredProducts();

    return;
  }

  controller.filters.text = value;

  void controller.showFilteredProducts();
};
