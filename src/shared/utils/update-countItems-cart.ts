import { authService } from '../../commerce-tools/auth-service.ts';
import { isCommercetoolsApiError } from '../models/typeguards.ts/index.ts';

export const updateCountItemsCart = async function (): Promise<void> {
  try {
    const response = await authService.getCart();
    const count = response.body.lineItems.length;
    const countNode = document.querySelector('#cart-count-icon');

    if (countNode) countNode.innerHTML = count ? String(count) : '';
  } catch (error) {
    if (isCommercetoolsApiError(error)) {
      console.error('Unknown error', error);
    }
  }
};
