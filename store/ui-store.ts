import { ZTransaction } from "@/libs/validation";
import { create } from "zustand";

interface UiState {
  isAddTransaction: boolean;
  isEditTransaction: boolean;
  isDetailOpen: boolean;
  selectedTransaction: ZTransaction | null;
  // Fungsi untuk mengubah nilainya
  openDetailModal: (transaction: ZTransaction) => void;
  openEditModal: (transaction: ZTransaction) => void;
  setIsAddTransaction: (isOpen: boolean) => void;
  closeAllModals: () => void;
  refreshKey: number; // State untuk nyimpen key refresh
  triggerRefresh: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isAddTransaction: false,
  isEditTransaction: false,
  isDetailOpen: false,
  selectedTransaction: null,
  refreshKey: 0,

  openDetailModal: (transaction) => set({ isDetailOpen: true, selectedTransaction: transaction }),
  openEditModal: (transaction) => set({ isEditTransaction: true, selectedTransaction: transaction }),
  closeAllModals: () => set({ isDetailOpen: false, isEditTransaction: false, selectedTransaction: null }),
  setIsAddTransaction: (isOpen) => set({ isAddTransaction: isOpen }),
  triggerRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })), //untuk ngubah value refreshKey, biar refecth otomatis
}));
