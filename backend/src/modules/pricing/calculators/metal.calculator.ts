import { SpotRates } from '../providers/price-provider';

export class MetalCalculator {
  static calculate(params: {
    materialType: string;
    purity: string;
    density: number;
    scale: number;
    spotRates: SpotRates;
  }): { price: number; estimatedWeight: number; pricePerGram: number } {
    // Normal base weight for rings/chains is ~4.5g
    const baseWeight = 4.5;
    
    // Normalized weight by density scaling (using pure gold 19.3 g/cm3 as baseline)
    const estimatedWeight = baseWeight * params.scale * (params.density / 19.3);
    
    let pricePerGram = params.spotRates.gold24k;
    const material = params.materialType.toLowerCase();
    const purity = params.purity.toLowerCase();

    if (material === 'gold') {
      if (purity === '18k') pricePerGram = params.spotRates.gold18k;
      else if (purity === '22k') pricePerGram = params.spotRates.gold22k;
    } else if (material === 'platinum') {
      pricePerGram = params.spotRates.platinum;
    } else if (material === 'silver') {
      pricePerGram = params.spotRates.silver;
    }

    const price = estimatedWeight * pricePerGram;

    return {
      price: Math.round(price * 100) / 100,
      estimatedWeight: Math.round(estimatedWeight * 100) / 100,
      pricePerGram,
    };
  }
}
