export interface IResponseDetailedProduct {
  name: string;
  img: string[];
  description: string;
  fullDescription: string;
  prices: number;
  pricesFractionDigits: number;
  discounted?: number;
  discountedFractionDigits?: number;
}
