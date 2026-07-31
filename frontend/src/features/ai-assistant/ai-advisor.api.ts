import { apiClient } from '../../services/api-client';

export interface AiReviewPayload {
  blueprintId: string;
  selectedMetalId: string | null;
  selectedGemstoneId: string | null;
  configuration: any;
  estimatedPrice: number;
}

export interface AiReviewResponse {
  score: number;
  designSummary: string;
  ratings: {
    styleConsistency: number;
    colorHarmony: number;
    symmetry: number;
    luxuryAppeal: number;
    manufacturingComplexity: number;
    budgetSuitability: number;
  };
  suggestions: {
    type: 'material' | 'gemstone' | 'asset' | 'layout' | 'luxury';
    title: string;
    description: string;
    target: string;
    replacementValue: string;
    priceImpact: number;
  }[];
}

export const getAiReview = async (payload: AiReviewPayload): Promise<AiReviewResponse> => {
  const response = await apiClient.post<any, any>('/ai/review', payload);
  return response as unknown as AiReviewResponse;
};

export const improveDesign = async (payload: {
  blueprintId: string;
  selectedMetalId: string | null;
  selectedGemstoneId: string | null;
  configuration: any;
  estimatedPrice: number;
  suggestions: any[];
}): Promise<any> => {
  const response = await apiClient.post<any, any>('/ai/review/improve', payload);
  return response;
};
