import { create } from "zustand";

interface UiState {
  isAddTransaction: boolean;
  // Fungsi untuk mengubah nilainya
  setIsAddTransaction: (isOpen: boolean) => void;
  refreshKey: number; // State untuk nyimpen key refresh
  triggerRefresh: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isAddTransaction: false, // Default-nya popup ketutup
  setIsAddTransaction: (isOpen) => set({ isAddTransaction: isOpen }),

  refreshKey: 0, // Default-nya 0
  triggerRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),
}));
