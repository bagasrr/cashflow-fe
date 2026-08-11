"use client";
import { PopupInput } from "@/components/features/popup-input";
import { DataTable } from "@/components/shared/data-table";
import { WalletToggle } from "@/components/shared/wallet-toggle";
import { Button } from "@/components/ui/button";
import { useAuthUser } from "@/hooks/use-auth";
import { useTransactions } from "@/hooks/use-transaction";
import { useUiStore } from "@/store/ui-store";
import { FileSpreadsheet } from "lucide-react";

const Page = () => {
  const { user, isUserLoading } = useAuthUser();
  // const cek = true;
  const openModal = useUiStore((state) => state.openModal);
  const modalType = useUiStore((state) => state.modalType);
  console.log("Type pada modal: ", modalType);

  const { trxData, pageCount, pagination, setPagination, sorting, setSorting, globalFilter, setGlobalFilter } = useTransactions();
  return (
    <>
      <PopupInput />

      <div className="flex w-full items-center justify-between gap-2 mb-5">
        <Button variant="default" className="" onClick={() => openModal("import_data")}>
          <FileSpreadsheet />
          Import data
        </Button>
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
