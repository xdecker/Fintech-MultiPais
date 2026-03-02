"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];

  pageSize?: number;
  pageIndex?: number;
  pageCount?: number;
  onPageChange?: (page: number) => void;

  emptyIcon?: React.ReactNode;
  emptyMessage?: string;
  tableBordered?: boolean;
  sortable?: boolean;
  enableFilter?: boolean;
  placeholderFilter?: string;
  showPagination?: boolean;
  enableExport?: boolean;
  exportMethod?: () => void;
  stickyFirstColumn?: boolean;
}

export function CustomDataTable<TData, TValue>({
  columns,
  data,
  pageSize = 10,
  pageIndex,
  onPageChange,
  pageCount,
  emptyIcon,
  emptyMessage = "No hay resultados",
  tableBordered = false,
  sortable = true,
  enableFilter = true,
  placeholderFilter = "Buscar...",
  stickyFirstColumn = false,
  enableExport = true,
  exportMethod,
  showPagination = true,
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns: columns.map((c) => ({
      ...c,
      enableSorting: sortable && c.id !== "actions",
    })),
    state: {
      globalFilter,
      pagination: {
        pageIndex: pageIndex ?? 0,
        pageSize: pageSize,
      },
    },
    manualPagination: true,
    pageCount: pageCount ?? -1,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      // Filter global excepto la columna "actions"
      const val = row.getValue(columnId);
      if (columnId === "actions") return true;
      if (!val) return false;
      return String(val)
        .toLowerCase()
        .includes(String(filterValue).toLowerCase());
    },
  });

  return (
    <div
      className={`w-full overflow-x-auto ${
        tableBordered ? "border" : ""
      } bg-white  rounded-md`}
    >
      {enableFilter && (
        <div className="flex justify-between items-center p-4 gap-2">
          <Input
            placeholder={placeholderFilter}
            className="max-w-md"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
          {enableExport && (
            <Button onClick={exportMethod} variant="outline" size="sm">
              Exportar Excel
            </Button>
          )}
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <TableHead
                    key={header.id}
                    className={
                      stickyFirstColumn && index === 0
                        ? "sticky left-0 bg-white z-10"
                        : ""
                    }
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`${
                          header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : ""
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted() === "asc"
                          ? " ↑"
                          : header.column.getIsSorted() === "desc"
                          ? " ↓"
                          : ""}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell
                      key={cell.id}
                      className={
                        stickyFirstColumn && index === 0
                          ? "sticky left-0 bg-white z-10"
                          : ""
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center h-24"
                >
                  {emptyIcon}
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación cliente */}
      {/* {showPagination && (
        <div className="flex justify-between p-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>

          <span className="text-sm">
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      )} */}

      {/* paginacion serveer */}
      {showPagination && (
        <div className="flex justify-between items-center p-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(pageIndex! - 1)}
            disabled={pageIndex === 0}
          >
            Anterior
          </Button>

          <span className="text-sm">
            Página {pageIndex! + 1} de {pageCount}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(pageIndex! + 1)}
            disabled={pageIndex! + 1 >= (pageCount ?? 0)}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}
