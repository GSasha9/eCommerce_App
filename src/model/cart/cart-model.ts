import type { Cart, DiscountCode } from '@commercetools/platform-sdk';

import { authService } from '../../commerce-tools/auth-service';
import { isCommercetoolsApiError } from '../../shared/models/typeguards.ts';

import 'swiper/css/bundle';

class CartModel {
  private static instance: CartModel;
  public cart?: Cart;
  public couponName?: string;
  public codes?: DiscountCode[];

  private constructor() {}

  public static getInstance(): CartModel {
    if (!CartModel.instance) {
      CartModel.instance = new CartModel();
    }

    return CartModel.instance;
  }

  public async getCartInformation(): Promise<void> {
    try {
      const response = await authService.getCart();

      this.codes = (await authService.api.discountCodes().get().execute()).body.results;
      const data = response.body;

      this.cart = data;
    } catch (error) {
      if (isCommercetoolsApiError(error)) {
        console.error('Unknown error', error);
      }
    }
  }
}

export default CartModel;
