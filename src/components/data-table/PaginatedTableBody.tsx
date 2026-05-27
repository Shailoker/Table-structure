import type { Row, Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import type { Person } from "@/lib/generateData";
import { DataTableRow } from "@/components/data-table/DataTableRow";
import { buildGridTemplateColumns } from "@/components/data-table/gridTemplate";

type PaginatedTableBodyProps = {
  table: Table<Person>;
  rows: Row<Person>[];
  isRowDirty: (id: number) => boolean;
};

export function PaginatedTableBody({ table, rows, isRowDirty }: PaginatedTableBodyProps) {
  const gridTemplateColumns = buildGridTemplateColumns(table);

  return (
    <div>
      {rows.map((row) => (
        <DataTableRow
          key={row.id}
          row={row}
          isDirty={isRowDirty(row.original.id)}
          gridTemplateColumns={gridTemplateColumns}
          data-testid="data-table-row"
        />
      ))}
      <div className="flex items-center justify-between gap-2 px-3 py-2 text-sm">
        <div className="text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            «
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            ‹
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            ›
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            »
          </Button>
        </div>
      </div>
    </div>
  );
}
