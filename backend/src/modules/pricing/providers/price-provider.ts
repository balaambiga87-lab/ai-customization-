import { Injectable } from '@nestjs/common';

export interface SpotRates {
  gold24k: number; // Rate per gram (INR)
  gold22k: number;
  gold18k: number;
  platinum: number;
  silver: number;
}

@Injectable()
export class PriceProvider {
  /**
   * Fetches latest spot rates.
   * Extension Point: Replace hardcoded fallbacks with external live API fetches here.
   */
  async getLatestSpotRates(): Promise<SpotRates> {
    return {
      gold24k: 6200.00,
      gold22k: 5750.00,
      gold18k: 4850.00,
      platinum: 3200.00,
      silver: 75.00,
    };
  }
}
