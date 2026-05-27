import { flexRender, type Table } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Person } from "@/lib/generateData";
import { cn } from "@/lib/utils";
import { buildGridTemplateColumns } from "@/components/data-table/gridTemplate";

type TableHeaderProps = {
  table: Table<Person>;
  columnFilters: { id: string; value: unknown }[];
  onFilterChange: (columnId: string, value: string, filterFn: unknown) => void;
};

export function TableHeader({ table, columnFilters, onFilterChange }: TableHeaderProps) {
  const gridTemplateColumns = buildGridTemplateColumns(table);

  return (
    <div className="grid" style={{ gridTemplateColumns }}>
      {table.getHeaderGroups().map((hg) =>
        hg.headers.map((header) => {
          const sorted = header.column.getIsSorted();
          const canSort = header.column.getCanSort();
          const filterEntry = columnFilters.find((f) => f.id === header.column.id);
          const filterValue =
            filterEntry?.value != null && Array.isArray(filterEntry.value)
              ? String(filterEntry.value[0] ?? "")
              : String(filterEntry?.value ?? "");

          return (
            <div
              key={header.id}
              className="border-b bg-muted/40 px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground"
            >
              <button
                type="button"
                disabled={!canSort}
                onClick={header.column.getToggleSortingHandler()}
                className={cn("flex items-center gap-1", canSort && "hover:text-foreground")}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
                {canSort &&
                  (sorted === "asc" ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : sorted === "desc" ? (
                    <ArrowDown className="h-3 w-3" />
                  ) : (
                    <ArrowUpDown className="h-3 w-3 opacity-40" />
                  ))}
              </button>
              {header.column.getCanFilter() && (
                <Input
                  value={filterValue}
                  onChange={(e) =>
                    onFilterChange(
                      header.column.id,
                      e.target.value,
                      header.column.columnDef.filterFn,
                    )
                  }
                  placeholder="Filter…"
                  aria-label={`Filter ${String(header.column.columnDef.header)}`}
                  className="mt-1 h-7 text-xs font-normal normal-case tracking-normal"
                />
              )}
            </div>
          );
        }),
      )}
    </div>
  );
}
