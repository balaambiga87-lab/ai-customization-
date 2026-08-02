import { create } from 'zustand';

export type JewelleryType = 'ring' | 'earring' | 'pendant';

export interface CanvasLayer {
  id: string;
  jewelleryType: JewelleryType;
  type: string;       // e.g. 'ring_band' | 'center_stone' | 'hoop' | 'chain' | etc.
  category: string;   // sub-category identifier
  key: string;
  name: string;
  image?: string;
  x: number;          // percentage of canvas width  (0–100)
  y: number;          // percentage of canvas height (0–100)
  scale: number;
  rotation: number;   // degrees
  zIndex: number;
  metal?: string;
  selected?: boolean;
}

interface LayerStore {
  layers: CanvasLayer[];
  selectedLayerId: string | null;
  history: CanvasLayer[][];
  future: CanvasLayer[][];

  // Actions
  addLayer:       (layer: CanvasLayer) => void;
  updateLayer:    (id: string, updates: Partial<CanvasLayer>) => void;
  selectLayer:    (id: string | null) => void;
  deleteLayer:    (id: string) => void;
  duplicateLayer: (id: string) => void;
  bringForward:   (id: string) => void;
  sendBack:       (id: string) => void;
  bringToFront:   (id: string) => void;
  sendToBack:     (id: string) => void;
  clearLayers:    () => void;
  setLayers:      (layers: CanvasLayer[]) => void;
  
  // History Actions
  undo:           () => void;
  redo:           () => void;
  canUndo:        boolean;
  canRedo:        boolean;
}

export const useLayerStore = create<LayerStore>((set, get) => {
  const recordHistory = (currentLayers: CanvasLayer[]) => {
    const { history } = get();
    // Limit history stack size to 30 snapshots
    const newHistory = [...history, JSON.parse(JSON.stringify(currentLayers))].slice(-30);
    return { history: newHistory, future: [] };
  };

  return {
    layers: [],
    selectedLayerId: null,
    history: [],
    future: [],
    canUndo: false,
    canRedo: false,

    addLayer: (layer) => {
      const { layers } = get();
      const historyUpdate = recordHistory(layers);
      set({
        layers: [...layers, layer],
        selectedLayerId: layer.id,
        ...historyUpdate,
        canUndo: true,
        canRedo: false,
      });
    },

    updateLayer: (id, updates) => {
      const { layers } = get();
      const newLayers = layers.map((l) => (l.id === id ? { ...l, ...updates } : l));
      set({ layers: newLayers });
    },

    selectLayer: (id) => set({ selectedLayerId: id }),

    deleteLayer: (id) => {
      const { layers, selectedLayerId } = get();
      const historyUpdate = recordHistory(layers);
      const newLayers = layers.filter((l) => l.id !== id);
      set({
        layers: newLayers,
        selectedLayerId: selectedLayerId === id ? null : selectedLayerId,
        ...historyUpdate,
        canUndo: true,
        canRedo: false,
      });
    },

    duplicateLayer: (id) => {
      const { layers } = get();
      const target = layers.find((l) => l.id === id);
      if (!target) return;
      const historyUpdate = recordHistory(layers);
      const clone: CanvasLayer = {
        ...target,
        id: `${target.type}_dup_${Date.now()}`,
        x: Math.min(95, target.x + 3),
        y: Math.min(95, target.y + 3),
        zIndex: layers.length + 1,
      };
      set({
        layers: [...layers, clone],
        selectedLayerId: clone.id,
        ...historyUpdate,
        canUndo: true,
        canRedo: false,
      });
    },

    bringForward: (id) => {
      const { layers } = get();
      const historyUpdate = recordHistory(layers);
      const newLayers = layers.map((l) => (l.id === id ? { ...l, zIndex: l.zIndex + 1 } : l));
      set({ layers: newLayers, ...historyUpdate, canUndo: true, canRedo: false });
    },

    sendBack: (id) => {
      const { layers } = get();
      const historyUpdate = recordHistory(layers);
      const newLayers = layers.map((l) =>
        l.id === id ? { ...l, zIndex: Math.max(0, l.zIndex - 1) } : l,
      );
      set({ layers: newLayers, ...historyUpdate, canUndo: true, canRedo: false });
    },

    bringToFront: (id) => {
      const { layers } = get();
      const historyUpdate = recordHistory(layers);
      const maxZ = Math.max(0, ...layers.map((l) => l.zIndex));
      const newLayers = layers.map((l) => (l.id === id ? { ...l, zIndex: maxZ + 1 } : l));
      set({ layers: newLayers, ...historyUpdate, canUndo: true, canRedo: false });
    },

    sendToBack: (id) => {
      const { layers } = get();
      const historyUpdate = recordHistory(layers);
      const newLayers = layers.map((l) =>
        l.id === id ? { ...l, zIndex: 0 } : { ...l, zIndex: l.zIndex + 1 },
      );
      set({ layers: newLayers, ...historyUpdate, canUndo: true, canRedo: false });
    },

    clearLayers: () => {
      const { layers } = get();
      if (layers.length === 0) return;
      const historyUpdate = recordHistory(layers);
      set({ layers: [], selectedLayerId: null, ...historyUpdate, canUndo: true, canRedo: false });
    },

    setLayers: (newLayers) => {
      const { layers } = get();
      const historyUpdate = recordHistory(layers);
      set({ layers: newLayers, ...historyUpdate, canUndo: true, canRedo: false });
    },

    undo: () => {
      const { history, layers, future } = get();
      if (history.length === 0) return;
      const previousState = history[history.length - 1];
      const newHistory = history.slice(0, history.length - 1);
      const newFuture = [JSON.parse(JSON.stringify(layers)), ...future];
      set({
        layers: previousState,
        history: newHistory,
        future: newFuture,
        canUndo: newHistory.length > 0,
        canRedo: true,
      });
    },

    redo: () => {
      const { history, layers, future } = get();
      if (future.length === 0) return;
      const nextState = future[0];
      const newFuture = future.slice(1);
      const newHistory = [...history, JSON.parse(JSON.stringify(layers))];
      set({
        layers: nextState,
        history: newHistory,
        future: newFuture,
        canUndo: true,
        canRedo: newFuture.length > 0,
      });
    },
  };
});
