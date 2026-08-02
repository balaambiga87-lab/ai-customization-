import { create } from 'zustand';

interface Pendant {
  id: string;
  position: [number, number, number];
  type: string;
  price: number;
}

interface BuilderState {
  chain: string | null;
  chainPrice: number;
  pendants: Pendant[];
  metalType: string;
  metalMultiplier: number;
  stoneType: string;
  setChain: (chain: string, price: number) => void;
  addPendant: (pendant: Pendant) => void;
  removePendant: (pendantId: string) => void;
  updatePendantPosition: (pendantId: string, position: [number, number, number]) => void;
  setMetalType: (type: string, multiplier: number) => void;
  setStoneType: (type: string) => void;
  clearBuilder: () => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  chain: null,
  chainPrice: 0,
  pendants: [],
  metalType: '18k_gold',
  metalMultiplier: 1.0,
  stoneType: 'diamond',
  setChain: (chain, price) => set({ chain, chainPrice: price }),
  addPendant: (pendant) => set((state) => ({ pendants: [...state.pendants, pendant] })),
  removePendant: (pendantId) => set((state) => ({
    pendants: state.pendants.filter((p) => p.id !== pendantId)
  })),
  updatePendantPosition: (pendantId, position) => set((state) => ({
    pendants: state.pendants.map((p) => p.id === pendantId ? { ...p, position } : p)
  })),
  setMetalType: (metalType, metalMultiplier) => set({ metalType, metalMultiplier }),
  setStoneType: (stoneType) => set({ stoneType }),
  clearBuilder: () => set({ chain: null, chainPrice: 0, pendants: [] }),
}));
