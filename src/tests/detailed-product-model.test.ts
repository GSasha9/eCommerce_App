import type { ClientResponse, ProductProjection } from '@commercetools/platform-sdk';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import DetailedProductModel from '../model/detailed-product/detailed-product-model';

vi.mock('../commerce-tools/auth-service', () => {
  return {
    authService: {
      getProductByKey: (): Promise<ClientResponse<ProductProjection>> => {
        const mockResponse: ClientResponse<ProductProjection> = {
          statusCode: 200,
          headers: {},
          body: {
            name: { en: 'Test Product' },
            description: { 'en-US': 'Short desc' },
            categories: [],
            createdAt: '',
            id: '',
            lastModifiedAt: '',
            productType: { id: '', typeId: 'product-type' },
            slug: {},
            variants: [],
            version: 1,
            masterVariant: {
              id: 1,
              images: [{ url: 'img1.jpg', dimensions: { w: 128, h: 128 } }],
              attributes: [
                { name: '1', value: 1 },
                { name: '2', value: 2 },
                { name: '3', value: 3 },
                { name: 'Full desc', value: 'Full desc' },
              ],
              prices: [
                {
                  id: 'price',
                  value: {
                    centAmount: 1000,
                    fractionDigits: 2,
                    currencyCode: 'currencyCode',
                    type: 'centPrecision',
                  },
                  discounted: {
                    discount: {
                      id: '',
                      typeId: 'product-discount',
                      obj: {
                        createdAt: '',
                        id: '',
                        isActive: true,
                        lastModifiedAt: '',
                        name: {},
                        predicate: '',
                        references: [],
                        sortOrder: '',
                        value: { money: [], type: 'absolute' },
                        version: 1,
                      },
                    },
                    value: {
                      type: 'centPrecision',
                      currencyCode: 'currencyCode',
                      centAmount: 750,
                      fractionDigits: 2,
                    },
                  },
                },
              ],
            },
          },
        };

        return Promise.resolve(mockResponse);
      },
    },
  };
});

describe('DetailedProductModel (safe, no assertions)', () => {
  let model: DetailedProductModel;

  beforeEach(() => {
    model = DetailedProductModel.getInstance();
    model.clearQueryResults();
  });

  it('should extract key from URL', () => {
    const originalPath = window.location.pathname;

    Object.defineProperty(window, 'location', {
      value: { pathname: '/products/some-key' },
    });

    const result = model.getProductKeyByUrl();

    expect(result).toBe(true);
    expect(model.key).toBe('some-key');

    Object.defineProperty(window, 'location', {
      value: { pathname: originalPath },
    });
  });

  it('fetches and parses product data correctly', async () => {
    model.key = 'test-key';
    await model.getDetailedInformation();

    expect(model.isSuccess).toBe(true);
    expect(model.response?.name).toBe('Test Product');
    expect(model.response?.img).toEqual(['img1.jpg']);
    expect(model.response?.description).toBe('Short desc');
    expect(model.response?.fullDescription).toBe('Full desc');
    expect(model.response?.prices).toBe(1000);
    expect(model.response?.discounted).toBe(750);
  });

  it('formats prices correctly', () => {
    model.response = {
      id: 'product-id-123',
      name: 'Test',
      img: [],
      description: '',
      fullDescription: '',
      prices: 1200,
      pricesFractionDigits: 2,
    };

    expect(model.formatPrice()).toBe('$12.00');
  });

  it('formats discounted prices correctly', () => {
    model.response = {
      id: 'product-id-123',
      name: 'Test',
      img: [],
      description: '',
      fullDescription: '',
      prices: 1200,
      pricesFractionDigits: 2,
      discounted: 950,
      discountedFractionDigits: 2,
    };

    expect(model.formatDiscountedPrice()).toBe('$9.50');
  });

  it('clears query results', () => {
    model.key = 'x';
    model.response = {
      id: 'product-id-123',
      name: 'X',
      img: [],
      description: '',
      fullDescription: '',
      prices: 1,
      pricesFractionDigits: 2,
    };
    model.isSuccess = true;

    model.clearQueryResults();

    expect(model.key).toBe('');
    expect(model.response).toBeUndefined();
    expect(model.isSuccess).toBeUndefined();
  });
});
