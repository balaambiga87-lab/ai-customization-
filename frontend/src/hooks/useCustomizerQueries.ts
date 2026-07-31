import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/api-client';

export interface ApiBlueprint {
  id: string;
  name: string;
  modelUrl: string;
  thumbnailUrl?: string;
  basePrice: string;
  metadata: any;
}

export interface ApiBlueprintAnchor {
  id: string;
  blueprintId: string;
  name: string;
  anchorType: string;
  positionX: number;
  positionY: number;
  positionZ: number;
  allowedAssetCategoryIds: string[];
}

export interface ApiAssetCategory {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export interface ApiAsset {
  id: string;
  assetCategoryId: string;
  name: string;
  sku: string;
  modelUrl: string;
  thumbnailUrl?: string;
  priceModifier: string;
  category: ApiAssetCategory;
}

export const useBlueprints = () => {
  return useQuery<ApiBlueprint[]>({
    queryKey: ['blueprints'],
    queryFn: async () => {
      const res = await apiClient.get<any, any>('/blueprints');
      return res.data;
    },
  });
};

export const useBlueprintAnchors = (blueprintId: string | null) => {
  return useQuery<ApiBlueprintAnchor[]>({
    queryKey: ['blueprint-anchors', blueprintId],
    queryFn: async () => {
      if (!blueprintId) return [];
      const res = await apiClient.get<any, any>(`/blueprints/${blueprintId}/anchors`);
      return res.data;
    },
    enabled: !!blueprintId,
  });
};

export const useAssetCategories = () => {
  return useQuery<ApiAssetCategory[]>({
    queryKey: ['asset-categories'],
    queryFn: async () => {
      const res = await apiClient.get<any, any>('/assets/categories');
      return res.data;
    },
  });
};

export const useAssets = (params: {
  page?: number;
  limit?: number;
  search?: string;
  categoryCode?: string;
}) => {
  return useQuery<{ items: ApiAsset[]; meta: any }>({
    queryKey: ['assets', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', String(params.page));
      if (params.limit) queryParams.append('limit', String(params.limit));
      if (params.search) queryParams.append('search', params.search);
      if (params.categoryCode) queryParams.append('categoryCode', params.categoryCode);

      const res = await apiClient.get<any, any>(`/assets?${queryParams.toString()}`);
      return res;
    },
  });
};
export default useBlueprints;
