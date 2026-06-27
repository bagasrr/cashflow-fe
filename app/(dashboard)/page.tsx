"use client";

import React, { useEffect } from "react";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { ChartAreaInteractive } from "@/components/shared/chart-area-interactive";
import { DataTable } from "@/components/shared/data-table";
import { SectionCards } from "@/components/shared/section-cards";
import { SiteHeader } from "@/components/shared/site-header";
import { WalletToggle } from "@/components/shared/wallet-toggle";
import { useAuthStore } from "@/store/auth-store"; // Import store Zustand kamu
import { useRouter } from "next/navigation";
import { format } from "date-fns";

import data from "./data.json";

interface Trx {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
}

export default function Page() {
  const defaultTimeRage = 30;
  const { user, setAuth, clearAuth, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const selectedWalletId = useAuthStore((state) => state.selectedWalletId);
  const date = useAuthStore((state) => state.dateRange);

  const [trxData, setTrxData] = React.useState<Trx[] | null>(null);

  const safeFrom = date?.from || new Date(new Date().setDate(new Date().getDate() - defaultTimeRage));
  const safeTo = date?.to || new Date();

  const startDateStr = format(safeFrom, "yyyy-MM-dd");
  const endDateStr = format(safeTo, "yyyy-MM-dd");

  const getMeUrl = "/api/users/me";
  const getTrxUrl = `/api/wallets/${selectedWalletId}/transactions?start_date=${startDateStr}&end_date=${endDateStr}&page=1&limit=10`;

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
      // 1. Guard Clause
      if (!selectedWalletId || selectedWalletId === "" || selectedWalletId === "all") {
        console.log("⏳ Fetch Trx ditunda: Menunggu Wallet ID siap...");
        setTrxData([]);
        return;
      }

      try {
        const res = await fetch(getTrxUrl, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        const json = await res.json();

        if (!res.ok || (!json.status && !json.success)) {
          throw new Error(json.error || json.message || "Gagal fetch data transaksi");
        }

        console.info("🚀 Data Transaksi berhasil diambil:", json);
        setTrxData(json.data);
      } catch (error) {
        console.error("❌ Error fetchTrxData:", error);
        setTrxData([]);
      }
    };

    fetchTrxData();
  }, [selectedWalletId, startDateStr, endDateStr]); // Dependency array di-update
  console.info("TRX DATA : ", trxData);
  return (
    <div className="flex flex-1 flex-col p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Selamat Datang Kembali, {user?.username || "Loading..."} 👋</h1>
        <WalletToggle />
      </div>

      <div className="@container/main flex flex-1 flex-col gap-2 ">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          <DataTable data={trxData || []} />
        </div>
      </div>
    </div>
  );
}
