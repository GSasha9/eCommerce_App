import type { Cart } from '@commercetools/platform-sdk';

import { authService } from '../../commerce-tools/auth-service';
import { isCommercetoolsApiError } from '../../shared/models/typeguards.ts';

import 'swiper/css/bundle';

class CartModel {
  private static instance: CartModel;
  public cart?: Cart;

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

      console.log('response+++', response.body);
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
