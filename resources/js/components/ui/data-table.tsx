import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "./button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  pagination?: {
    total: number;
    currentPage: number;
    perPage: number;
    onPageChange: (page: number) => void;
  }
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  const totalPages = pagination && Math.ceil(pagination.total / pagination.perPage);

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {/* Pagination Controls */}
        
      </div>
      <FloatingBar selectedRows={table.getSelectedRowModel().rows} />
      {/* Pagination Controls */}
      {pagination && (
        <div className="flex items-center justify-between space-x-2 py-4 ">
            <span className="text-sm text-muted-foreground">
              Page <b>{pagination.currentPage}</b> sur <b>{totalPages}</b>
            </span>
          <div className="space-x-2">
          <Button size="sm" variant={"outline"} disabled={pagination.currentPage === 1} onClick={() => pagination.onPageChange(pagination.currentPage - 1)}>
            Précédent
          </Button>
        
          <Button size="sm" variant={"outline"} disabled={pagination.currentPage === totalPages} onClick={() => pagination.onPageChange(pagination.currentPage + 1)}>
            Suivant
          </Button>
          </div>
        </div>
      )}
      
    </div>
  )
}

const FloatingBar = ({ selectedRows }: { selectedRows: any[] }) => {
  return selectedRows.length > 0 ? (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-100 p-4 shadow-lg">
      Actions sur {selectedRows.length} lignes sélectionnées.
      {/* Ajoutez vos boutons d'action ici */}
    </div>
  ) : null;
};

