import { create } from "zustand";

interface UiState {
  isAddTransaction: boolean;
  // Fungsi untuk mengubah nilainya
  setIsAddTransaction: (isOpen: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isAddTransaction: false, // Default-nya popup ketutup
  setIsAddTransaction: (isOpen) => set({ isAddTransaction: isOpen }),
}));
