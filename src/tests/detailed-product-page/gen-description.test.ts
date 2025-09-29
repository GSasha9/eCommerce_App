import { beforeEach, describe, expect, it } from 'vitest';

import type DetailedProductModel from '../../model/detailed-product/detailed-product-model';
import DetailedProductPage from '../../pages/detailed-product/detailed-product-page';

describe('DetailedProductPage.genDescription', () => {
  const modelMock: DetailedProductModel = {
    response: {
      id: 'product-id-123',
      name: 'Test Product',
      img: ['image.jpg'],
      description: 'A short description',
      fullDescription: 'A full description',
      prices: 10000,
      pricesFractionDigits: 2,
    },
    key: 'test-key',
    isSuccess: true,
    formatPrice: () => '100 €',
    formatDiscountedPrice: () => '80 €',
    clearQueryResults: () => {},
    getDetailedInformation: () => Promise.resolve(),
    getProductKeyByUrl: () => false,
  };
  let page: DetailedProductPage;

  beforeEach(() => {
    Object.defineProperty(DetailedProductPage, 'instance', {
      value: undefined,
      writable: true,
    });

    page = DetailedProductPage.getInstance(modelMock);
  });

  it('should create a .wrapper-information element with product name, price and description', () => {
    const element = page.genDescription();

    expect(element.classList.contains('wrapper-information')).toBe(true);

    const name = element.querySelector('.name-detailed-product');
    const price = element.querySelector('.detailed-price');
    const description = element.querySelector('.description-value');

    expect(name?.textContent).toBe('Test Product');
    expect(price?.textContent).toBe('100 €');
    expect(description?.textContent).toBe('A short description');
  });

  it('should include discounted price and apply discount class if discounted is set', () => {
    if (modelMock?.response) {
      modelMock.response.discounted = 8000;
      modelMock.response.discountedFractionDigits = 2;
    }

    Object.defineProperty(DetailedProductPage, 'instance', {
      value: undefined,
      writable: true,
    });

    page = DetailedProductPage.getInstance(modelMock);
    const element = page.genDescription();

    const discount = element.querySelector('.detailed-discounted-price');
    const price = element.querySelector('.detailed-price');

    expect(discount?.textContent).toBe('80 €');
    expect(price?.classList.contains('discount-detailed')).toBe(true);
  });
});
