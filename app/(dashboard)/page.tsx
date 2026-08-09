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
import { useTransactions } from "@/hooks/use-transaction";

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
  const { user, setAuth, clearAuth } = useAuthStore();

  const getMeUrl = "/api/users/me";
  const { trxData, pageCount, pagination, setPagination, sorting, setSorting, globalFilter, setGlobalFilter } = useTransactions();
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

  return (
    <div className="flex flex-1 flex-col">
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
