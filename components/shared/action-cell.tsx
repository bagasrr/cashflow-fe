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
    <div className="flex justify-center w-5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex size-8 text-muted-foreground data-[state=open]:bg-muted cursor-pointer" size="icon">
            <IconDotsVertical className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-fit text-center">
          <DropdownMenuLabel>Action</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* 🔥 Panggilannya jauh lebih bersih */}
          <DropdownMenuItem onClick={() => openModal("detail", transaction)} className="cursor-pointer flex gap-2 items-center justify-between">
            <p>Lihat Detail</p>
            <Eye className="mr-2 h-4 w-4" />
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => openModal("edit", transaction)} className="cursor-pointer  flex gap-2 items-center justify-between">
            <p>Edit Transaksi</p>
            <Edit className="mr-2 h-4 w-4 " />
          </DropdownMenuItem>

          <DropdownMenuItem className="text-destructive  cursor-pointer flex gap-2 items-center justify-between" onClick={() => openModal("delete", transaction)}>
            <p>Hapus</p>
            <Trash className="mr-2 h-4 w-4" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
