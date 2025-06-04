import { authService } from '../../commerce-tools/auth-service';
import type { IResponseDetailedProduct } from '../../shared/models/interfaces/response-detailed-product.ts';
import { isCommercetoolsApiError } from '../../shared/models/typeguards.ts';

import 'swiper/css/bundle';
const isString = (value: unknown): value is string => typeof value === 'string';

class DetailedProductModel {
  private static instance: DetailedProductModel;
  public key?: string;
  public response?: IResponseDetailedProduct | undefined;
  public isSuccess?: boolean;

  private constructor() {}

  public static getInstance(): DetailedProductModel {
    if (!DetailedProductModel.instance) {
      DetailedProductModel.instance = new DetailedProductModel();
    }

    return DetailedProductModel.instance;
  }

  public getProductKeyByUrl(): boolean {
    const path = window.location.pathname;

    this.key = path
      .split('/')
      .filter((i) => i)
      .pop();

    return Boolean(this.key);
  }

  public async getDetailedInformation(): Promise<void> {
    try {
      if (this.key) {
        const response = await authService.getProductByKey(this.key);

        //console.log('response-----', response);

        const name = response.body.name.en;
        const img = response.body.masterVariant.images?.map((img) => img.url);
        const description = response.body.description?.['en-US'];
        const fullDescription = isString(response.body.masterVariant.attributes?.[3].value)
          ? response.body.masterVariant.attributes?.[3].value
          : '';
        const prices = response.body.masterVariant.prices?.[0].value.centAmount;
        const pricesFractionDigits = response.body.masterVariant.prices?.[0].value.fractionDigits;
        const discounted = response.body.masterVariant.prices?.[0].discounted?.value.centAmount;
        const discountedFractionDigits = response.body.masterVariant.prices?.[0].discounted?.value.fractionDigits;

        this.isSuccess = true;

        if (name && img && description && fullDescription && prices && pricesFractionDigits) {
          this.response = {
            name,
            img,
            description,
            fullDescription,
            prices,
            pricesFractionDigits,
          };
        }

        if (discounted && discountedFractionDigits && this.response) {
          Object.assign(this.response, {
            discounted,
            discountedFractionDigits,
          });
        }
      }
    } catch (error) {
      if (isCommercetoolsApiError(error)) {
        this.isSuccess = false;
      } else {
        console.error('Unknown error', error);
      }
    }
  }

  public clearQueryResults(): void {
    this.key = '';
    this.response = undefined;
    this.isSuccess = undefined;
  }

  public formatPrice(): string {
    if (this.response) {
      const formatPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: this.response?.pricesFractionDigits,
        maximumFractionDigits: this.response?.pricesFractionDigits,
      }).format(this.response.prices / 100);

      return formatPrice;
    }

    return '';
  }

  public formatDiscountedPrice(): string {
    if (this.response && this.response.discounted) {
      const formatPrice = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: this.response?.discountedFractionDigits,
        maximumFractionDigits: this.response?.discountedFractionDigits,
      }).format(this.response.discounted / 100);

      return formatPrice;
    }

    return '';
  }
}

export default DetailedProductModel;
