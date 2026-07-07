// file: components/shared/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IconArrowsSort, IconDotsVertical } from "@tabler/icons-react";
import { ZTransaction } from "@/libs/validation";
import { FormatIDR } from "@/libs/utils";

// Hapus bagian `schema` lama (z.object({...})) karena udah pakai ZTransaction

export const Columns: ColumnDef<ZTransaction>[] = [
  // 1. Kolom Checkbox
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // 2. Kolom Tanggal Transaksi
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button variant="ghost" className="-ml-4 h-8 hover:bg-muted" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Tanggal
        <IconArrowsSort className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.date);
      const formattedDate = date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
      return <span className="text-muted-foreground">{formattedDate}</span>;
    },
  },

  // 3. Kolom Deskripsi/Judul (Title)
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button variant="ghost" className="-ml-4 h-8 hover:bg-muted" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Title
        <IconArrowsSort className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium text-foreground">{row.original.title}</div>,
  },

  // 4. Kolom Kategori
  {
    id: "category",
    accessorFn: (row) => row.category?.name,
    header: ({ column }) => (
      <Button variant="ghost" className="-ml-4 h-8 hover:bg-muted" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Kategori
        <IconArrowsSort className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <Badge variant="secondary" className="px-2 font-normal">
        {row.original.category?.name || "Tanpa Kategori"}
      </Badge>
    ),
  },

  // 5. Kolom Tipe (EXPENSE / INCOME / INVESTMENT)
  {
    id: "type",
    accessorFn: (row) => row.category?.type,
    header: ({ column }) => (
      <Button variant="ghost" className="-ml-4 h-8 hover:bg-muted" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Tipe
        <IconArrowsSort className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const type = row.original.category?.type;
      const isIncome = type === "INCOME";
      const isExpense = type === "EXPENSE";

      return (
        <Badge
          variant="outline"
          className={isIncome ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500" : isExpense ? "border-destructive/20 bg-destructive/10 text-destructive" : "border-amber-500/20 bg-amber-500/10 text-amber-500"}
        >
          {isIncome ? "INCOME" : isExpense ? "EXPENSE" : "INVESTMENT"}
        </Badge>
      );
    },
  },

  // 6. Kolom Nominal Rupiah
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <div className="flex w-full justify-end">
        <Button variant="ghost" className="-mr-4 h-8 hover:bg-muted" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Nominal
          <IconArrowsSort className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const amount = row.original.amount;
      const formatted = FormatIDR(amount); // Asumsi lu udah import FormatIDR
      return <div className="w-full text-right tabular-nums font-semibold">{formatted}</div>;
    },
  },

  // 7. Kolom Deskripsi Panjang
  {
    accessorKey: "description",
    header: ({ column }) => (
      <Button variant="ghost" className="-ml-4 h-8 hover:bg-muted" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Description
        <IconArrowsSort className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.description}</span>,
  },

  // 8. Kolom Aksi
  {
    id: "actions",
    enableSorting: false,
    cell: () => (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex size-8 text-muted-foreground data-[state=open]:bg-muted" size="icon">
              <IconDotsVertical className="size-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem>Detail</DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Hapus</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
