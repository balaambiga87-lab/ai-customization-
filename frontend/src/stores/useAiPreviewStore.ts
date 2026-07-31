import { create } from 'zustand';

export interface Preview {
  id: string;
  imageUrl: string;
  isSaved: boolean;
  promptText: string;
  createdAt: string;
}

export interface InterpretedDesign {
  productType: string;
  occasion: string;
  style: string;
  metal: {
    type: string;
    karat: string;
  };
  gemstone: {
    type: string;
    shape: string;
    carat: number;
  };
  customText: string | null;
  estimatedPrice: number;
  confidenceScore: number;
  explanation: string;
}

interface AiPreviewState {
  currentPrompt: string;
  activePreview: Preview | null;
  previewHistory: Preview[];
  isGenerating: boolean;
  interpretedDesign: InterpretedDesign | null;
  setCurrentPrompt: (prompt: string) => void;
  setActivePreview: (preview: Preview | null) => void;
  addPreviewToHistory: (preview: Preview) => void;
  setGenerating: (generating: boolean) => void;
  setInterpretedDesign: (data: InterpretedDesign | null) => void;
  clearPreviewState: () => void;
}

export const useAiPreviewStore = create<AiPreviewState>((set) => ({
  currentPrompt: '',
  activePreview: null,
  previewHistory: [],
  isGenerating: false,
  interpretedDesign: null,

  setCurrentPrompt: (prompt) => set({ currentPrompt: prompt }),
  setActivePreview: (preview) => set({ activePreview: preview }),
  addPreviewToHistory: (preview) =>
    set((state) => ({
      previewHistory: [preview, ...state.previewHistory],
      activePreview: preview,
    })),
  setGenerating: (generating) => set({ isGenerating: generating }),
  setInterpretedDesign: (data) => set({ interpretedDesign: data }),
  clearPreviewState: () =>
    set({
      currentPrompt: '',
      activePreview: null,
      previewHistory: [],
      isGenerating: false,
      interpretedDesign: null,
    }),
}));
