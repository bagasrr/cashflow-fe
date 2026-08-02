import { Row } from "@tanstack/react-table";
import { useUiStore } from "@/store/ui-store";
import { ZTransaction } from "@/libs/validation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Edit, Eye, Trash } from "lucide-react";
import { IconDotsVertical } from "@tabler/icons-react";

export const ActionCell = ({ row }: { row: Row<ZTransaction> }) => {
  const transaction = row.original;
  const openModal = useUiStore((state) => state.openModal);

  return (
    <div className="flex justify-end w-5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex size-8 text-muted-foreground data-[state=open]:bg-muted cursor-pointer" size="icon">
            <IconDotsVertical className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-22">
          <DropdownMenuLabel>Action</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* 🔥 Panggilannya jauh lebih bersih */}
          <DropdownMenuItem onClick={() => openModal("detail", transaction)} className="cursor-pointer">
            <Eye className="mr-2 h-4 w-4" /> Lihat Detail
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => openModal("edit", transaction)} className="cursor-pointer">
            <Edit className="mr-2 h-4 w-4 " /> Edit Transaksi
          </DropdownMenuItem>

          <DropdownMenuItem className="text-destructive  cursor-pointer" onClick={() => openModal("delete", transaction)}>
            <Trash className="mr-2 h-4 w-4" /> Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
