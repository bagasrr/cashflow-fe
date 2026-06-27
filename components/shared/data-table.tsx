"use client";

import * as React from "react";
import { closestCenter, DndContext, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors, type DragEndEvent, type UniqueIdentifier } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader,
  IconPlus,
  IconTrendingUp,
} from "@tabler/icons-react";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { toast } from "sonner";
import { z } from "zod";

import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ZTransaction } from "@/libs/validation";
import { FormatIDR } from "@/libs/utils";
import { IconArrowsSort } from "@tabler/icons-react";

export const schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
});

// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button {...attributes} {...listeners} variant="ghost" size="icon" className="size-7 text-muted-foreground hover:bg-transparent">
      <IconGripVertical className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

// const columns: ColumnDef<ZTransaction>[] = [
//   {
//     id: "drag",
//     header: () => null,
//     cell: ({ row }) => <DragHandle id={row.original.id} />,
//   },
//   {
//     id: "select",
//     header: ({ table }) => (
//       <div className="flex items-center justify-center">
//         <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />
//       </div>
//     ),
//     cell: ({ row }) => (
//       <div className="flex items-center justify-center">
//         <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
//       </div>
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorKey: "header",
//     header: "Header",
//     cell: ({ row }) => {
//       return <TableCellViewer item={row.original} />;
//     },
//     enableHiding: false,
//   },
//   {
//     accessorKey: "type",
//     header: "Section Type",
//     cell: ({ row }) => (
//       <div className="w-32">
//         <Badge variant="outline" className="px-1.5 text-muted-foreground">
//           {row.original.type}
//         </Badge>
//       </div>
//     ),
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//     cell: ({ row }) => (
//       <Badge variant="outline" className="px-1.5 text-muted-foreground">
//         {row.original.status === "Done" ? <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" /> : <IconLoader />}
//         {row.original.status}
//       </Badge>
//     ),
//   },
//   {
//     accessorKey: "target",
//     header: () => <div className="w-full text-right">Target</div>,
//     cell: ({ row }) => (
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
//             loading: `Saving ${row.original.header}`,
//             success: "Done",
//             error: "Error",
//           });
//         }}
//       >
//         <Label htmlFor={`${row.original.id}-target`} className="sr-only">
//           Target
//         </Label>
//         <Input
//           className="h-8 w-16 border-transparent bg-transparent text-right shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background dark:bg-transparent dark:hover:bg-input/30 dark:focus-visible:bg-input/30"
//           defaultValue={row.original.target}
//           id={`${row.original.id}-target`}
//         />
//       </form>
//     ),
//   },
//   {
//     accessorKey: "limit",
//     header: () => <div className="w-full text-right">Limit</div>,
//     cell: ({ row }) => (
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
//             loading: `Saving ${row.original.header}`,
//             success: "Done",
//             error: "Error",
//           });
//         }}
//       >
//         <Label htmlFor={`${row.original.id}-limit`} className="sr-only">
//           Limit
//         </Label>
//         <Input
//           className="h-8 w-16 border-transparent bg-transparent text-right shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background dark:bg-transparent dark:hover:bg-input/30 dark:focus-visible:bg-input/30"
//           defaultValue={row.original.limit}
//           id={`${row.original.id}-limit`}
//         />
//       </form>
//     ),
//   },
//   {
//     accessorKey: "reviewer",
//     header: "Reviewer",
//     cell: ({ row }) => {
//       const isAssigned = row.original.reviewer !== "Assign reviewer";

//       if (isAssigned) {
//         return row.original.reviewer;
//       }

//       return (
//         <>
//           <Label htmlFor={`${row.original.id}-reviewer`} className="sr-only">
//             Reviewer
//           </Label>
//           <Select>
//             <SelectTrigger className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate" size="sm" id={`${row.original.id}-reviewer`}>
//               <SelectValue placeholder="Assign reviewer" />
//             </SelectTrigger>
//             <SelectContent align="end">
//               <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
//               <SelectItem value="Jamik Tashpulatov">Jamik Tashpulatov</SelectItem>
//             </SelectContent>
//           </Select>
//         </>
//       );
//     },
//   },
//   {
//     id: "actions",
//     cell: () => (
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="ghost" className="flex size-8 text-muted-foreground data-[state=open]:bg-muted" size="icon">
//             <IconDotsVertical />
//             <span className="sr-only">Open menu</span>
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="end" className="w-32">
//           <DropdownMenuItem>Edit</DropdownMenuItem>
//           <DropdownMenuItem>Make a copy</DropdownMenuItem>
//           <DropdownMenuItem>Favorite</DropdownMenuItem>
//           <DropdownMenuSeparator />
//           <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     ),
//   },
// ];

const columns: ColumnDef<ZTransaction>[] = [
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
export function DataTable({ data: initialData }: { data: ZTransaction[] }) {
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Sinkronisasi data kalau dari parent berubah (hasil fetch API)
  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <Tabs defaultValue="outline" className="w-full flex-col justify-start gap-6 px-5">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select defaultValue="outline">
          <SelectTrigger className="flex w-fit @4xl/main:hidden" size="sm" id="view-selector">
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="outline">Outline</SelectItem>
            <SelectItem value="past-performance">Past Performance</SelectItem>
            <SelectItem value="key-personnel">Key Personnel</SelectItem>
            <SelectItem value="focus-documents">Focus Documents</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="outline">Outline</TabsTrigger>
          <TabsTrigger value="past-performance">
            Past Performance <Badge variant="secondary">3</Badge>
          </TabsTrigger>
          <TabsTrigger value="key-personnel">
            Key Personnel <Badge variant="secondary">2</Badge>
          </TabsTrigger>
          <TabsTrigger value="focus-documents">Focus Documents</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          {/* <div className="flex items-center gap-2"> */}
          <Input
            placeholder="Cari transaksi by title"
            // Ambil nilai filter saat ini dari kolom "title"
            value={globalFilter ?? ""}
            // Update nilai filter tiap kali user ngetik
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns className="mr-2 h-4 w-4" />
                <span className="hidden lg:inline">Customize Columns</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)} onSelect={(e) => e.preventDefault()}>
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="overflow-x-auto overflow-y-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Tidak ada transaksi di rentang tanggal ini.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} dari {table.getFilteredRowModel().rows.length} baris terpilih.
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Baris per halaman</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Halaman {table.getState().pagination.pageIndex + 1} dari {table.getPageCount() || 1}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="hidden size-8 p-0 lg:flex" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
              <IconChevronsLeft className="size-4" />
            </Button>
            <Button variant="outline" className="size-8 p-0" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              <IconChevronLeft className="size-4" />
            </Button>
            <Button variant="outline" className="size-8 p-0" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              <IconChevronRight className="size-4" />
            </Button>
            <Button variant="outline" className="hidden size-8 p-0 lg:flex" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
              <IconChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </Tabs>
  );
}

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="w-fit px-0 text-left text-foreground">
          {item.header}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.header}</DrawerTitle>
          <DrawerDescription>Showing total visitors for the last 6 months</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} hide />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                  <Area dataKey="mobile" type="natural" fill="var(--color-mobile)" fillOpacity={0.6} stroke="var(--color-mobile)" stackId="a" />
                  <Area dataKey="desktop" type="natural" fill="var(--color-desktop)" fillOpacity={0.4} stroke="var(--color-desktop)" stackId="a" />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 leading-none font-medium">
                  Trending up by 5.2% this month <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">Showing total visitors for the last 6 months. This is just some random text to test the layout. It spans multiple lines and should wrap around.</div>
              </div>
              <Separator />
            </>
          )}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">Header</Label>
              <Input id="header" defaultValue={item.header} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="type">Type</Label>
                <Select defaultValue={item.type}>
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Table of Contents">Table of Contents</SelectItem>
                    <SelectItem value="Executive Summary">Executive Summary</SelectItem>
                    <SelectItem value="Technical Approach">Technical Approach</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Capabilities">Capabilities</SelectItem>
                    <SelectItem value="Focus Documents">Focus Documents</SelectItem>
                    <SelectItem value="Narrative">Narrative</SelectItem>
                    <SelectItem value="Cover Page">Cover Page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={item.status}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Done">Done</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="target">Target</Label>
                <Input id="target" defaultValue={item.target} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="limit">Limit</Label>
                <Input id="limit" defaultValue={item.limit} />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="reviewer">Reviewer</Label>
              <Select defaultValue={item.reviewer}>
                <SelectTrigger id="reviewer" className="w-full">
                  <SelectValue placeholder="Select a reviewer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
                  <SelectItem value="Jamik Tashpulatov">Jamik Tashpulatov</SelectItem>
                  <SelectItem value="Emily Whalen">Emily Whalen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
