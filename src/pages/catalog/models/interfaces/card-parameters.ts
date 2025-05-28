import type { Image } from '@commercetools/platform-sdk';

export type IParametersCard = {
  name: string;
  description: string;
  img: string | Image;
  price: string;
  discount?: string;
};
