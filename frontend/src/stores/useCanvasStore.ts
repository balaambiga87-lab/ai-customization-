import { create } from 'zustand';

interface CanvasState {
  activeAnchorName: string | null;
  cameraZoom: number;
  isModelLoading: boolean;
  setActiveAnchor: (anchorName: string | null) => void;
  setCameraZoom: (zoom: number) => void;
  setModelLoading: (loading: boolean) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  activeAnchorName: null,
  cameraZoom: 1.0,
  isModelLoading: false,
  setActiveAnchor: (anchorName) => set({ activeAnchorName: anchorName }),
  setCameraZoom: (zoom) => set({ cameraZoom: zoom }),
  setModelLoading: (loading) => set({ isModelLoading: loading }),
}));
