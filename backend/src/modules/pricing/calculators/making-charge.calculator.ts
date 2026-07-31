export class MakingChargeCalculator {
  static calculate(params: {
    baseRate: number;
    attachedAssetsCount: number;
    metalWeight: number;
  }): number {
    // Surcharge per anchor setting/accent placement
    const assetSurcharge = params.attachedAssetsCount * 450.00;
    
    // Weight surcharge for crafting effort per gram
    const weightSurcharge = params.metalWeight * 120.00;
    
    const charges = params.baseRate + assetSurcharge + weightSurcharge;

    return Math.round(charges * 100) / 100;
  }
}
