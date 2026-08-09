"use client";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import type { SortingState, PaginationState } from "@tanstack/react-table";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
import { useUiStore } from "@/store/ui-store";

// Helper useDebounce pindah ke sini (atau ke file utils/helpers)
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function useTransactions() {
  // 1. Ambil global state
  const selectedWalletId = useAuthStore((state) => state.selectedWalletId);
  const date = useAuthStore((state) => state.dateRange);
  const refreshKey = useUiStore((state) => state.refreshKey);

  // 2. Setup local state untuk DataTable
  const [trxData, setTrxData] = useState<any[] | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedSearch = useDebounce(globalFilter, 500);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // 3. Setup Tanggal
  const defaultTimeRage = 30;
  const safeFrom = date?.from || new Date(new Date().setDate(new Date().getDate() - defaultTimeRage));
  const safeTo = date?.to || new Date();
  const startDateStr = format(safeFrom, "yyyy-MM-dd");
  const endDateStr = format(safeTo, "yyyy-MM-dd");

  // 4. Proses Fetching
  useEffect(() => {
    const fetchTrxData = async () => {
      if (!selectedWalletId || selectedWalletId === "" || selectedWalletId === "all") {
        setTrxData([]);
        return;
      }

      try {
        const page = pagination.pageIndex + 1;
        const limit = pagination.pageSize;

        let getTransactionUrl = `/api/wallets/${selectedWalletId}/transactions?start_date=${startDateStr}&end_date=${endDateStr}&page=${page}&limit=${limit}`;

        if (debouncedSearch) {
          getTransactionUrl += `&search=${debouncedSearch}`;
        }

        if (sorting.length > 0) {
          getTransactionUrl += `&sort_by=${sorting[0].id}&sort_order=${sorting[0].desc ? "desc" : "asc"}`;
        }

        const res = await fetch(getTransactionUrl, { method: "GET", cache: "no-store" });
        const json = await res.json();

        if (!res.ok || (!json.status && !json.success)) {
          throw new Error(json.error || json.message || "Gagal fetch data transaksi");
        }

        setTrxData(json.data || []);
        setPageCount(json.meta?.total_pages || 1);

        // Opsional: Matikan toast sukses di sini agar tidak spam tiap ganti halaman
        // toast.success("Berhasil mengambil data transaksi");
      } catch (error) {
        toast.error("Gagal mengambil data transaksi");
        console.error("❌ Error fetchTrxData:", error);
        setTrxData([]);
        setPageCount(0);
      }
    };

    fetchTrxData();
  }, [selectedWalletId, startDateStr, endDateStr, pagination, sorting, debouncedSearch, refreshKey]);

  // 5. Kembalikan semua state yang dibutuhkan oleh DataTable
  return {
    trxData,
    pageCount,
    globalFilter,
    setGlobalFilter,
    sorting,
    setSorting,
    pagination,
    setPagination,
  };
}
