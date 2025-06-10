import type { IParameters } from '../../shared/models/interfaces';
import { CreateElement } from '../../shared/utils/create-element.ts';

export class ShippingAddressesList extends CreateElement {
  constructor(parameters: Partial<IParameters> = {}) {
    super({ tag: 'div', classNames: ['shipping-addresses-list'], ...parameters });
  }
}
