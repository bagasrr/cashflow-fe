import { ZTransaction } from "@/libs/validation";
import { create } from "zustand";

interface UiState {
  isAddTransaction: boolean;
  isEditTransaction: boolean;
  isDetailOpen: boolean;
  isLoading: boolean;
  selectedTransaction: ZTransaction | null;
  refreshKey: number;
  // Fungsi untuk mengubah nilainya
  openDetailModal: (transaction: ZTransaction) => void;
  openEditModal: (transaction: ZTransaction) => void;
  setIsAddTransaction: (isOpen: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  closeAllModals: () => void;
  triggerRefresh: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isAddTransaction: false,
  isEditTransaction: false,
  isDetailOpen: false,
  selectedTransaction: null,
  isLoading: false,
  refreshKey: 0,

  openDetailModal: (transaction) => set({ isDetailOpen: true, selectedTransaction: transaction }),
  openEditModal: (transaction) => set({ isEditTransaction: true, selectedTransaction: transaction }),
  closeAllModals: () => set({ isAddTransaction: false, isDetailOpen: false, isEditTransaction: false, selectedTransaction: null }),
  setIsAddTransaction: (isOpen) => set({ isAddTransaction: isOpen }),
  triggerRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })), //untuk ngubah value refreshKey, biar refecth otomatis
  setIsLoading: (isLoading) => set({ isLoading }),
}));
