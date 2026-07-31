import { create } from 'zustand';

export interface AnchorConfig {
  assetId: string | null;
  materialId: string | null;
  gemstoneId: string | null;
  scale: number;
  rotation: number;
}

export interface PriceBreakdown {
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

interface DesignState {
  activeSavedDesignId: string | null;
  activeBlueprintId: string | null;
  activeBlueprintName: string | null;
  selectedMetalId: string | null;
  selectedGemstoneId: string | null;
  customText: string | null;
  configuration: Record<string, AnchorConfig>;
  estimatedPrice: number;
  priceBreakdown: PriceBreakdown | null;
  priceStatus: 'idle' | 'updating' | 'updated' | 'error';
  historyStack: Record<string, AnchorConfig>[];
  redoStack: Record<string, AnchorConfig>[];
  setSavedDesignId: (id: string | null) => void;
  setBlueprint: (id: string, name: string, basePrice: number) => void;
  setMetal: (materialId: string, priceModifier: number) => void;
  setGemstone: (gemstoneId: string, priceModifier: number) => void;
  setCustomText: (text: string | null) => void;
  setPriceBreakdown: (breakdown: PriceBreakdown | null) => void;
  setPriceStatus: (status: 'idle' | 'updating' | 'updated' | 'error') => void;
  updateComponent: (
    anchorName: string,
    details: Partial<AnchorConfig>,
    priceChange?: number,
    skipHistory?: boolean,
  ) => void;
  undo: () => void;
  redo: () => void;
  resetDesign: () => void;
}

export const useDesignStore = create<DesignState>((set) => ({
  activeSavedDesignId: null,
  activeBlueprintId: null,
  activeBlueprintName: null,
  selectedMetalId: null,
  selectedGemstoneId: null,
  customText: null,
  configuration: {},
  estimatedPrice: 0,
  priceBreakdown: null,
  priceStatus: 'idle',
  historyStack: [],
  redoStack: [],

  setPriceStatus: (status) => set({ priceStatus: status }),

  setPriceBreakdown: (breakdown) =>
    set({
      priceBreakdown: breakdown,
      estimatedPrice: breakdown ? breakdown.totalPrice : 0,
      priceStatus: 'updated',
    }),

  setSavedDesignId: (id) => set({ activeSavedDesignId: id }),

  setBlueprint: (id, name, basePrice) =>
    set({
      activeBlueprintId: id,
      activeBlueprintName: name,
      estimatedPrice: basePrice,
      selectedMetalId: null,
      selectedGemstoneId: null,
      customText: null,
      configuration: {},
      historyStack: [],
      redoStack: [],
    }),

  setMetal: (materialId, priceModifier) =>
    set((state) => ({
      selectedMetalId: materialId,
      estimatedPrice: state.estimatedPrice + priceModifier,
    })),

  setGemstone: (gemstoneId, priceModifier) =>
    set((state) => ({
      selectedGemstoneId: gemstoneId,
      estimatedPrice: state.estimatedPrice + priceModifier,
    })),

  setCustomText: (text) => set({ customText: text }),

  updateComponent: (anchorName, details, priceChange = 0, skipHistory = false) =>
    set((state) => {
      // 1. Record current state into historyStack
      const newHistory = skipHistory
        ? state.historyStack
        : [...state.historyStack, JSON.parse(JSON.stringify(state.configuration))];

      // 2. Compute updated configuration for anchorName
      const currentAnchor = state.configuration[anchorName] || {
        assetId: null,
        materialId: null,
        gemstoneId: null,
        scale: 1.0,
        rotation: 0,
      };

      const updatedAnchor = {
        ...currentAnchor,
        ...details,
      };

      return {
        configuration: {
          ...state.configuration,
          [anchorName]: updatedAnchor,
        },
        estimatedPrice: state.estimatedPrice + priceChange,
        historyStack: newHistory,
        redoStack: [], // Reset redo stack on new action
      };
    }),

  undo: () =>
    set((state) => {
      if (state.historyStack.length === 0) return {};

      // 1. Pop last snapshot from history
      const prevHistory = [...state.historyStack];
      const snapshot = prevHistory.pop()!;

      // 2. Save current state to redo
      const currentSnapshot = JSON.parse(JSON.stringify(state.configuration));
      const newRedo = [...state.redoStack, currentSnapshot];

      return {
        configuration: snapshot,
        historyStack: prevHistory,
        redoStack: newRedo,
      };
    }),

  redo: () =>
    set((state) => {
      if (state.redoStack.length === 0) return {};

      // 1. Pop last snapshot from redo
      const prevRedo = [...state.redoStack];
      const snapshot = prevRedo.pop()!;

      // 2. Save current state to history
      const currentSnapshot = JSON.parse(JSON.stringify(state.configuration));
      const newHistory = [...state.historyStack, currentSnapshot];

      return {
        configuration: snapshot,
        historyStack: newHistory,
        redoStack: prevRedo,
      };
    }),

  resetDesign: () =>
    set({
      activeSavedDesignId: null,
      activeBlueprintId: null,
      activeBlueprintName: null,
      selectedMetalId: null,
      selectedGemstoneId: null,
      customText: null,
      configuration: {},
      estimatedPrice: 0,
      priceBreakdown: null,
      priceStatus: 'idle',
      historyStack: [],
      redoStack: [],
    }),
}));
