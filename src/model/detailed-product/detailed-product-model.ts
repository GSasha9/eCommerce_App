import { authService } from '../../commerce-tools/auth-service';
import { isCommercetoolsApiError } from '../../shared/models/typeguards.ts';

import 'swiper/css/bundle';

export interface IResponseDetailedProduct {
  name: string;
  img: string[];
  description: string;
  prices: number;
  pricesFractionDigits: number;
  discounted?: number;
  discountedFractionDigits?: number;
}

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
        const name = response.body.name.en;
        const img = response.body.masterVariant.images?.map((img) => img.url);
        const description = response.body.description?.en;
        const prices = response.body.masterVariant.prices?.[0].value.centAmount;
        const pricesFractionDigits = response.body.masterVariant.prices?.[0].value.fractionDigits;
        const discounted = response.body.masterVariant.prices?.[0].discounted?.value.centAmount;
        const discountedFractionDigits = response.body.masterVariant.prices?.[0].discounted?.value.fractionDigits;

        this.isSuccess = true;

        if (name && img && description && prices && pricesFractionDigits) {
          this.response = {
            name,
            img,
            description,
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

        console.log('response------', response.body);
        console.log('this.response', this.response);
      }
    } catch (error) {
      if (isCommercetoolsApiError(error)) {
        // const statusCode = error.body.statusCode;
        // const code = error.body.errors[0].code;

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
