export interface GemInput {
  price: number;
  carat: number;
  scale: number;
}

export class GemstoneCalculator {
  static calculate(gemstones: GemInput[]): { price: number; totalCarats: number } {
    let price = 0;
    let totalCarats = 0;

    for (const gem of gemstones) {
      // Custom scaling factor representing carat volume price hikes
      const scaleMultiplier = Math.pow(gem.scale, 1.8);
      price += gem.price * scaleMultiplier;
      totalCarats += gem.carat * gem.scale;
    }

    return {
      price: Math.round(price * 100) / 100,
      totalCarats: Math.round(totalCarats * 100) / 100,
    };
  }
}
