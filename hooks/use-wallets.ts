"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getWallets, createWallet, updateWallet, deleteWallet, transferWalletBalance } from "@/features/wallets/services";
import { useUiStore } from "@/store/ui-store";

export function useWallets() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const refreshKey = useUiStore((state) => state.refreshKey);
  const triggerRefresh = useUiStore((state) => state.triggerRefresh);

  const fetchWallets = async () => {
    setLoading(true);
    try {
      const json = await getWallets(1, 100);
      if (json.data) {
        setWallets(json.data);
      }
    } catch (error) {
      toast.error("Gagal mengambil data wallet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, [refreshKey]);

  const addWallet = async (name: string, balance: number) => {
    setIsUpdating(true);
    try {
      await createWallet({ name, balance });
      toast.success("Wallet berhasil ditambahkan");
      triggerRefresh();
      return true;
    } catch (error) {
      toast.error("Gagal menambahkan wallet");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const editWallet = async (id: string, name: string, balance: number) => {
    setIsUpdating(true);
    try {
      await updateWallet(id, { name, balance });
      toast.success("Wallet berhasil diubah");
      triggerRefresh();
      return true;
    } catch (error) {
      toast.error("Gagal mengubah wallet");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const removeWallet = async (id: string) => {
    setIsUpdating(true);
    try {
      await deleteWallet(id);
      toast.success("Wallet berhasil dihapus");
      triggerRefresh();
      return true;
    } catch (error) {
      toast.error("Gagal menghapus wallet");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const transferBalance = async (from: string, to: string, amount: number, notes?: string) => {
    setIsUpdating(true);
    try {
      await transferWalletBalance({ from_wallet_id: from, to_wallet_id: to, amount, notes });
      toast.success("Saldo berhasil ditransfer");
      triggerRefresh();
      return true;
    } catch (error) {
      toast.error("Gagal transfer saldo");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    wallets,
    loading,
    isUpdating,
    addWallet,
    editWallet,
    removeWallet,
    transferBalance,
  };
}
