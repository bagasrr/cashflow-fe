"use client";
import { DataTable } from "@/components/shared/data-table";
import { WalletToggle } from "@/components/shared/wallet-toggle";
import { useAuthUser } from "@/hooks/use-auth";
import { useTransactions } from "@/hooks/use-transaction";
import { useUiStore } from "@/store/ui-store";

const Page = () => {
  const { user, isUserLoading } = useAuthUser();
  // const cek = true;
  console.log("User di transaction: ", user);

  const { trxData, pageCount, pagination, setPagination, sorting, setSorting, globalFilter, setGlobalFilter } = useTransactions();
  const openModal = useUiStore((state) => state.openModal);
  return (
    <>
      <div className="flex w-full items-center justify-end gap-2 mb-5">
        {isUserLoading && <div className="rounded-md px-5 bg-muted text-sm">Memuat data ...</div>}
        <span onClick={() => openModal("wallet")} className="cursor-pointer">
          <WalletToggle />
        </span>
      </div>
      <DataTable data={trxData || []} pageCount={pageCount} pagination={pagination} setPagination={setPagination} sorting={sorting} setSorting={setSorting} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
    </>
  );
};

export default Page;
