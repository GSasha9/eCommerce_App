import type { Image } from '@commercetools/platform-sdk';

export interface IParametersCard {
  name: string;
  description: string;
  img: string | Image;
  price: string;
  discount?: string;
  key: string;
}
