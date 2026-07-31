import { Injectable } from '@nestjs/common';

@Injectable()
export class RecommenderService {
  async getRecommendations(userId: string): Promise<string[]> {
    // Placeholder logic for recommendations
    return ['mock-blueprint-id-1', 'mock-blueprint-id-2'];
  }
}
