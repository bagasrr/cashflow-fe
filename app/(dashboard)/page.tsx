"use client";

import { useEffect, useState } from "react";
import { ChartAreaInteractive } from "@/components/shared/chart-area-interactive";
import { DataTable } from "@/components/shared/data-table"; // Pastikan path ini benar
import { SectionCards } from "@/components/shared/section-cards";
import { WalletToggle } from "@/components/shared/wallet-toggle";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import type { SortingState, PaginationState } from "@tanstack/react-table"; // 🔥 Import tipe dari TanStack
import { PopupInput } from "@/components/features/popup-input";
import { useUiStore } from "@/store/ui-store";
import { toast } from "sonner";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

// Interface menyesuaikan Zod Transaction lu
interface Trx {
  id: string;
  date: string;
  title: string;
  description: string;
  amount: number;
  category: { id?: string; name: string; type: string };
}

export default function Page() {
  const router = useRouter();
  const defaultTimeRage = 30;
  const { user, setAuth, clearAuth } = useAuthStore();
  const selectedWalletId = useAuthStore((state) => state.selectedWalletId);
  const date = useAuthStore((state) => state.dateRange);

  const [trxData, setTrxData] = useState<Trx[] | null>(null);
  const refreshKey = useUiStore((state) => state.refreshKey);

  // fetch api
  const [pageCount, setPageCount] = useState(0);
  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedSearch = useDebounce(globalFilter, 500); // Tunggu 500ms setelah user stop ngetik
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const safeFrom = date?.from || new Date(new Date().setDate(new Date().getDate() - defaultTimeRage));
  const safeTo = date?.to || new Date();
  const startDateStr = format(safeFrom, "yyyy-MM-dd");
  const endDateStr = format(safeTo, "yyyy-MM-dd");
  const getMeUrl = "/api/users/me";
  const openModal = useUiStore((state) => state.openModal);
  useEffect(() => {
    const FetchMe = async () => {
      try {
        const getMe = await fetch(getMeUrl, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        const getMeJson = await getMe.json();
        if (!getMe.ok || !getMeJson.success) {
          throw new Error(getMeJson.error || "Gagal fetch data user");
        }
        setAuth(getMeJson.user);
      } catch (error) {
        console.error("Error getMe:", error);
        clearAuth();
        router.push("/auth/login");
      }
    };
    FetchMe();
  }, [setAuth, clearAuth, router]);

  useEffect(() => {
    const fetchTrxData = async () => {
      if (!selectedWalletId || selectedWalletId === "" || selectedWalletId === "all") {
        setTrxData([]);
        return;
      }

      try {
        const page = pagination.pageIndex + 1;
        const limit = pagination.pageSize;

        // console.log("pagination state", pagination);

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
        if (json.meta && json.meta.total_pages) {
          setPageCount(json.meta.total_pages);
        } else {
          setPageCount(1);
        }
        toast.success("Berhasil mengambil data transaksi");
      } catch (error) {
        toast.error("Gagal mengambil data transaksi");
        console.error("❌ Error fetchTrxData:", error);
        setTrxData([]);
        setPageCount(0);
      }
    };

    fetchTrxData();
  }, [selectedWalletId, startDateStr, endDateStr, pagination, sorting, debouncedSearch, refreshKey]);

  return (
    <div className="flex flex-1 flex-col p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Welcome, {user?.username || "Loading..."}</h1>
        <span onClick={() => openModal("wallet")} className="cursor-pointer">
          <WalletToggle />
        </span>
      </div>

      <div className="@container/main flex flex-1 flex-col gap-2 ">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>

          <div className="px-4 lg:px-6">
            <DataTable data={trxData || []} pageCount={pageCount} pagination={pagination} setPagination={setPagination} sorting={sorting} setSorting={setSorting} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
          </div>
        </div>
      </div>

      <PopupInput />
    </div>
  );
}
