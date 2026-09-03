"use client";

import { ChartAreaInteractive } from "@/components/shared/chart-area-interactive";
import { DataTable } from "@/components/shared/data-table"; // Pastikan path ini benar
import { SectionCards } from "@/components/shared/section-cards";
import { WalletBalanceBox } from "@/components/shared/wallet-balance-box";
import { WalletToggle } from "@/components/shared/wallet-toggle";
import { PopupInput } from "@/components/features/popup-input";
import { useUiStore } from "@/store/ui-store";
import { useTransactions } from "@/hooks/use-transaction";
import { useAuthUser } from "@/hooks/use-auth";

export default function Page() {
  // const router = useRouter();
  // const { user, setAuth, clearAuth } = useAuthStore();
  const { user } = useAuthUser();

  // const getMeUrl = "/api/users/me";
  const { trxData, pageCount, pagination, setPagination, sorting, setSorting, globalFilter, setGlobalFilter } = useTransactions();
  const openModal = useUiStore((state) => state.openModal);
  // useEffect(() => {
  //   const FetchMe = async () => {
  //     try {
  //       const getMe = await fetch(getMeUrl, {
  //         method: "GET",
  //         headers: { "Content-Type": "application/json" },
  //         cache: "no-store",
  //       });

  //       const getMeJson = await getMe.json();
  //       if (!getMe.ok || !getMeJson.success) {
  //         throw new Error(getMeJson.error || "Gagal fetch data user");
  //       }
  //       setAuth(getMeJson.user);
  //     } catch (error) {
  //       console.error("Error getMe:", error);
  //       clearAuth();
  //       router.push("/auth/login");
  //     }
  //   };
  //   FetchMe();
  // }, [setAuth, clearAuth, router]);

  return (
    <div className="flex flex-1 flex-col">
      <PopupInput />

      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Welcome, {user?.username || "Loading..."}</h1>
        <span onClick={() => openModal("wallet")} className="cursor-pointer">
          <WalletToggle />
        </span>
      </div>

      <div className="@container/main flex flex-1 flex-col gap-2 ">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <WalletBalanceBox />
          <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>

          <div className="px-4 lg:px-6">
            <DataTable data={trxData || []} pageCount={pageCount} pagination={pagination} setPagination={setPagination} sorting={sorting} setSorting={setSorting} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
          </div>
        </div>
      </div>
    </div>
  );
}
