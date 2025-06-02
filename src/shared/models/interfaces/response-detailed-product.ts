export interface IResponseDetailedProduct {
  name: string;
  img: string[];
  description: string;
  prices: number;
  pricesFractionDigits: number;
  discounted?: number;
  discountedFractionDigits?: number;
}
