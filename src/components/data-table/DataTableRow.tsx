import { memo, type CSSProperties } from "react";
import { flexRender, type Row } from "@tanstack/react-table";
import type { Person } from "@/lib/generateData";
import { cn } from "@/lib/utils";

type DataTableRowProps = {
  row: Row<Person>;
  gridTemplateColumns: string;
  isDirty: boolean;
  className?: string;
  style?: CSSProperties;
  "data-testid"?: string;
};

export const DataTableRow = memo(
  function DataTableRow({
    row,
    gridTemplateColumns,
    isDirty,
    className,
    style,
    "data-testid": dataTestId,
  }: DataTableRowProps) {
    return (
      <div
        data-testid={dataTestId}
        className={cn(
          "grid w-full items-center border-b text-sm",
          isDirty && "bg-amber-50 dark:bg-amber-950/20",
          className,
        )}
        style={{ gridTemplateColumns, ...style }}
      >
        {row.getVisibleCells().map((cell) => (
          <div key={cell.id} className="truncate px-3 py-1.5">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </div>
        ))}
      </div>
    );
  },
  (prev, next) =>
    prev.row.id === next.row.id &&
    prev.row.original === next.row.original &&
    prev.isDirty === next.isDirty &&
    prev.gridTemplateColumns === next.gridTemplateColumns &&
    prev.style?.transform === next.style?.transform &&
    prev.style?.height === next.style?.height,
);
