import { EditingProvider } from "@/components/data-table/EditingContext";
import { PaginatedTableBody } from "@/components/data-table/PaginatedTableBody";
import { TableHeader } from "@/components/data-table/TableHeader";
import { TableLoading } from "@/components/data-table/TableLoading";
import { TableToolbar } from "@/components/data-table/TableToolbar";
import { useDataTable } from "@/components/data-table/useDataTable";
import { VirtualTableBody } from "@/components/data-table/VirtualTableBody";
import { DEFAULT_DATASET_SIZE } from "@/components/data-table/constants";
import { cn } from "@/lib/utils";

function EditableTableView() {
  const {
    table,
    displayRows,
    rowCount,
    virtualRowCount,
    getRowAt,
    maxMountedRows,
    dirtyCount,
    isRowDirty,
    mode,
    setMode,
    columnFilters,
    handleFilterChange,
    clearFilters,
    resetAll,
    handleExport,
    isFilteringStale,
    isSortingStale,
    isLoading,
    loadProgress,
  } = useDataTable();

  if (isLoading) {
    return <TableLoading progress={loadProgress} rowTarget={rowCount || DEFAULT_DATASET_SIZE} />;
  }

  return (
    <div className="space-y-4">
      <TableToolbar
        visibleCount={displayRows.length}
        totalCount={rowCount}
        dirtyCount={dirtyCount}
        mode={mode}
        onModeChange={setMode}
        onClearFilters={clearFilters}
        onResetAll={resetAll}
        onExport={handleExport}
        mountedRowHint={
          mode === "virtual"
            ? `~${maxMountedRows} rows rendered (virtual)`
            : `${displayRows.length} rows rendered (page)`
        }
      />

      <div
        className={cn(
          "rounded-lg border bg-card",
          (isFilteringStale || isSortingStale) && "opacity-90",
        )}
        aria-busy={isFilteringStale || isSortingStale}
      >
        <TableHeader
          table={table}
          columnFilters={columnFilters}
          onFilterChange={handleFilterChange}
        />
        {mode === "virtual" ? (
          <VirtualTableBody
            table={table}
            rowCount={virtualRowCount}
            getRowAt={getRowAt}
            isRowDirty={isRowDirty}
          />
        ) : (
          <PaginatedTableBody table={table} rows={displayRows} isRowDirty={isRowDirty} />
        )}
      </div>
    </div>
  );
}

export function EditableTable() {
  return (
    <EditingProvider>
      <EditableTableView />
    </EditingProvider>
  );
}
