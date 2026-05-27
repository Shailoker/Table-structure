import { useCallback, useDeferredValue, useMemo, useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import { useTable } from "@/context/TableContext";
import { DATA_TABLE_COLUMNS } from "@/components/data-table/columns";
import {
  CSV_COLUMNS,
  PAGINATION_PAGE_SIZE,
  ROW_HEIGHT_PX,
  VIRTUAL_OVERSCAN,
  VIRTUAL_VIEWPORT_HEIGHT_PX,
  type RenderMode,
} from "@/components/data-table/constants";
import { exportToCsv } from "@/lib/exportCsv";

export type { RenderMode };

export function useDataTable() {
  const { rows, rowCount, dirtyIds, isRowDirty, resetAll, isLoading, loadProgress } = useTable();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [mode, setMode] = useState<RenderMode>("virtual");

  const deferredSorting = useDeferredValue(sorting);
  const deferredColumnFilters = useDeferredValue(columnFilters);
  const isFilteringStale = columnFilters !== deferredColumnFilters;
  const isSortingStale = sorting !== deferredSorting;

  const table = useReactTable({
    data: rows,
    columns: DATA_TABLE_COLUMNS,
    state: {
      sorting: deferredSorting,
      columnFilters: deferredColumnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: mode === "paginated" ? getPaginationRowModel() : undefined,
    getRowId: (row) => String(row.id),
    enableMultiSort: true,
    initialState: { pagination: { pageSize: PAGINATION_PAGE_SIZE } },
  });

  const displayRows = table.getRowModel().rows;
  const virtualRowCount = displayRows.length;

  const getRowAt = useCallback(
    (index: number) => displayRows[index],
    [displayRows],
  );

  const handleFilterChange = useCallback((columnId: string, value: string, filterFn: unknown) => {
    setColumnFilters((prev) => {
      const without = prev.filter((f) => f.id !== columnId);
      if (!value) return without;
      const filterValue =
        filterFn === "inNumberRange" ? [Number(value), Number.POSITIVE_INFINITY] : value;
      return [...without, { id: columnId, value: filterValue }];
    });
  }, []);

  const clearFilters = useCallback(() => {
    setColumnFilters([]);
    table.resetColumnFilters();
  }, [table]);

  const handleExport = useCallback(() => {
    const source =
      mode === "paginated" ? table.getRowModel().rows : table.getFilteredRowModel().rows;
    const visible = source.map((r) => r.original);
    exportToCsv("table-export.csv", visible, CSV_COLUMNS);
  }, [mode, table]);

  const maxMountedRows = useMemo(
    () => Math.ceil(VIRTUAL_VIEWPORT_HEIGHT_PX / ROW_HEIGHT_PX) + VIRTUAL_OVERSCAN * 2 + 4,
    [],
  );

  return {
    table,
    displayRows,
    rowCount,
    virtualRowCount,
    getRowAt,
    maxMountedRows,
    dirtyCount: dirtyIds.size,
    isRowDirty,
    mode,
    setMode,
    sorting,
    columnFilters,
    handleFilterChange,
    clearFilters,
    resetAll,
    handleExport,
    isFilteringStale,
    isSortingStale,
    isLoading,
    loadProgress,
  };
}
