import type { Cart, ClientResponse } from '@commercetools/platform-sdk';

import { authService } from '../auth-service';

export class CartService {
  public static async getDiscount({
    ID,
    code,
    version,
  }: {
    ID: string;
    version: number;
    code: string;
  }): Promise<ClientResponse<Cart>> {
    const updatedCart = await authService.api
      .carts()
      .withId({ ID })
      .post({
        body: {
          version,
          actions: [{ action: 'addDiscountCode', code }],
        },
      })
      .execute();

    return updatedCart;
  }
}
