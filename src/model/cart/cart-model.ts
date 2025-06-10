import { authService } from '../../commerce-tools/auth-service';
import { isCommercetoolsApiError } from '../../shared/models/typeguards.ts';

import 'swiper/css/bundle';

class CartModel {
  private static instance: CartModel;
  public isSuccess?: boolean;

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

      console.log('Cart-------', response.body);
    } catch (error) {
      if (isCommercetoolsApiError(error)) {
        this.isSuccess = false;
      } else {
        console.error('Unknown error', error);
      }
    }
  }
}

export default CartModel;
