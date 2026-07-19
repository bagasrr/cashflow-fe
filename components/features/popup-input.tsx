import { useUiStore } from "@/store/ui-store";
import { AddTransaction } from "../shared/modal-transaction-add";
import { Button } from "../ui/button";
import { IconXFilled } from "@tabler/icons-react";
import ModalTransactionDetail from "../shared/modal-transaction-detail";

export const PopupInput = () => {
  const isAddTransaction = useUiStore((state) => state.isAddTransaction);
  const setIsAddTransaction = useUiStore((state) => state.setIsAddTransaction);
  const setCloseAllModal = useUiStore((state) => state.closeAllModals);
  const isDetailOpen = useUiStore((state) => state.isDetailOpen);
  if (!isAddTransaction && !isDetailOpen) {
    return null; // Jangan render apa pun jika kedua modal tidak terbuka
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Button
        variant="ghost"
        className="absolute top-10 right-10"
        onClick={() => {
          setIsAddTransaction(false);
          setCloseAllModal();
        }}
      >
        <IconXFilled className="h-6 w-6" />
      </Button>
      {!isAddTransaction ? null : <ModalTransactionDetail />}
      {!isDetailOpen ? null : <ModalTransactionDetail />}
    </div>
  );
};
