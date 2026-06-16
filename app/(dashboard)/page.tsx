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

import data from "./data.json";

export default function Page() {
  const { user, setAuth, clearAuth, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [totalCashflow, setTotalCashflow] = React.useState(0);
  const [totalIncome, setTotalIncome] = React.useState(0);
  const [totalExpense, setTotalExpense] = React.useState(0);
  const [totalInvestment, setTotalInvestment] = React.useState(0);

  console.log("Dashboard user:", user);
  useEffect(() => {
    const getMe = async () => {
      try {
        const res = await fetch("/api/users/me", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        const json = await res.json();
        // console.log("res json : ", json);
        // console.log("json.user : ", json.user);
        // console.log("res.ok : ", res.ok);
        // console.log("res : ", res);

        // 1. Cek res.ok dan json.success (karena Proxy Next.js ngirimnya key "success")
        if (!res.ok || !json.success) {
          throw new Error(json.error || "Gagal fetch data user");
        }

        // 2. Ambil json.user (karena Proxy Next.js membungkusnya di dalam key "user")
        setAuth(json.user);
      } catch (error) {
        console.error("Error getMe:", error);
        clearAuth();
        router.push("/auth/login"); // Lempar ke login kalau token expired/gak ada
      }
    };

    getMe();
  }, [setAuth, clearAuth, router]);
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
          <DataTable data={data} />
        </div>
      </div>
    </div>
  );
}
