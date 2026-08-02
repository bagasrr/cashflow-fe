import { useUiStore } from "@/store/ui-store";
import { ModalSendTransaction } from "../shared/modal-transaction-add";
import { Button } from "../ui/button";
import { IconXFilled } from "@tabler/icons-react";
import ModalTransactionDetail from "../shared/modal-transaction-detail";
import ModalConfirmDelete from "../shared/modal-confirm-delete";

export const PopupInput = () => {
  const isModalOpen = useUiStore((state) => state.isModalOpen);
  const modalType = useUiStore((state) => state.modalType);
  const setCloseAllModal = useUiStore((state) => state.closeAllModals);

  // 🔥 Logika super bersih: Kalau modal gak dibuka, jangan render apa-apa
  if (!isModalOpen || modalType === "none") {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Button variant="ghost" className="absolute top-10 right-10" onClick={setCloseAllModal}>
        <IconXFilled className="h-6 w-6" />
      </Button>

      {/* 🔥 Render form berdasarkan tipenya */}
      {(modalType === "add" || modalType === "edit") && <ModalSendTransaction />}
      {modalType === "detail" && <ModalTransactionDetail />}
      {modalType === "delete" && <ModalConfirmDelete />}
    </div>
  );
};
