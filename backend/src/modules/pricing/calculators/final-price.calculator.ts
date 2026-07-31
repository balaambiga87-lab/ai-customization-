export interface DetailedPriceBreakdown {
  basePrice: number;
  metalPrice: number;
  estimatedWeight: number;
  pricePerGram: number;
  gemstonePrice: number;
  totalCarats: number;
  assetPrice: number;
  makingCharges: number;
  tax: number;
  discount: number;
  totalPrice: number;
  currency: string;
}

export class FinalPriceCalculator {
  static calculate(params: {
    basePrice: number;
    metalPrice: number;
    estimatedWeight: number;
    pricePerGram: number;
    gemstonePrice: number;
    totalCarats: number;
    assetPrice: number;
    makingCharges: number;
    tax: number;
    discount?: number;
    currency?: string;
  }): DetailedPriceBreakdown {
    const discount = params.discount || 0;
    const subtotal =
      params.basePrice +
      params.metalPrice +
      params.gemstonePrice +
      params.assetPrice +
      params.makingCharges;
    
    const totalPrice = subtotal + params.tax - discount;

    return {
      basePrice: params.basePrice,
      metalPrice: params.metalPrice,
      estimatedWeight: params.estimatedWeight,
      pricePerGram: params.pricePerGram,
      gemstonePrice: params.gemstonePrice,
      totalCarats: params.totalCarats,
      assetPrice: params.assetPrice,
      makingCharges: params.makingCharges,
      tax: params.tax,
      discount,
      totalPrice: Math.round(totalPrice * 100) / 100,
      currency: params.currency || 'INR',
    };
  }
}
