import type CatalogController from '../catalog-controller';

export const updateSortAndFilter = (controller: CatalogController): void => {
  const parameterElement = document.querySelector('.catalog-header__select');
  const methodElement = document.querySelector('.catalog-header__select-arrow');

  if (!(parameterElement instanceof HTMLSelectElement) || !(methodElement instanceof HTMLSelectElement)) return;

  const selectedParam = parameterElement.value;
  const selectedMethod = methodElement.value;

  if (!selectedParam || !selectedMethod) return;

  controller.filters.sort = {
    parameter: selectedParam,
    method: selectedMethod,
  };

  void controller.showFilteredProducts();
};
