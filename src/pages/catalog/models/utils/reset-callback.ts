import type CatalogController from '../../../../controllers/catalog/catalog-controller';

export const resetCallback = (controller: CatalogController): void => {
  controller.isFiltered = false;
  controller.filters = {};

  controller.catalogPage.filterPriceFrom?.setValue('');

  controller.catalogPage.filterPriceTo?.setValue('');
  document.querySelectorAll('.selected-category').forEach((el) => {
    el.classList.remove('selected-category');
  });

  document.querySelectorAll('.catalog-header__list-item').forEach((el) => {
    if (el.textContent !== 'All') {
      el.classList.remove('selected');
    } else {
      el.classList.add('selected');
    }
  });

  const select = document.querySelector('.catalog-header__select');

  if (select instanceof HTMLSelectElement) {
    select.selectedIndex = 0;
  }

  const nameOfSubCategories = controller.catalogModel.categories.keys();

  for (const el of nameOfSubCategories) {
    controller.catalogPage.removeBreadCrumb(el);
  }

  controller.catalogPage.searchInput.setValue('');

  void controller.showAllProductCards();
};
