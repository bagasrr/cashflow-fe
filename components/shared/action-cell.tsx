import { Row } from "@tanstack/react-table";
import { useUiStore } from "@/store/ui-store";
import { ZTransaction } from "@/libs/validation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Edit, Eye, Trash } from "lucide-react";
import { IconDotsVertical } from "@tabler/icons-react";

// 🔥 1. BIKIN KOMPONEN TERPISAH DI SINI
export const ActionCell = ({ row }: { row: Row<ZTransaction> }) => {
  const transaction = row.original;

  // Karena ini adalah Komponen React asli (huruf kapital), linter nggak akan ngomel lagi!
  const openDetailModal = useUiStore((state) => state.openDetailModal);
  const openEditModal = useUiStore((state) => state.openEditModal);
  console.log("Open detail modal function:", openDetailModal);

  return (
    <div className="flex justify-end w-5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex size-8 text-muted-foreground data-[state=open]:bg-muted" size="icon">
            <IconDotsVertical className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-22">
          <DropdownMenuLabel>Action</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              openDetailModal(transaction);
            }}
          >
            <Eye className="mr-2 h-4 w-4" /> Lihat Detail
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openEditModal(transaction)}>
            <Edit className="mr-2 h-4 w-4" /> Edit Transaksi
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">
            <Trash className="mr-2 h-4 w-4" /> Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
