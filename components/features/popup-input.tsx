import { useUiStore } from "@/store/ui-store";
import { AddTransaction } from "../shared/add-transaction";
import { Button } from "../ui/button";
import { IconXFilled } from "@tabler/icons-react";

export const PopupInput = () => {
  const isAddTransaction = useUiStore((state) => state.isAddTransaction);
  const setIsAddTransaction = useUiStore((state) => state.setIsAddTransaction);
  if (!isAddTransaction) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Button variant="ghost" className="absolute top-10 right-10" onClick={() => setIsAddTransaction(false)}>
        <IconXFilled className="h-6 w-6" />
      </Button>
      <AddTransaction />
    </div>
  );
};
