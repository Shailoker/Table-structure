import { useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Row, Table } from "@tanstack/react-table";
import type { Person } from "@/lib/generateData";
import { observeScrollElementRect } from "@/lib/observeScrollElementRect";
import { DataTableRow } from "@/components/data-table/DataTableRow";
import { buildGridTemplateColumns } from "@/components/data-table/gridTemplate";
import {
  ROW_HEIGHT_PX,
  VIRTUAL_OVERSCAN,
  VIRTUAL_VIEWPORT_HEIGHT_PX,
} from "@/components/data-table/constants";

type VirtualTableBodyProps = {
  table: Table<Person>;
  rowCount: number;
  getRowAt: (index: number) => Row<Person>;
  isRowDirty: (id: number) => boolean;
};

export function VirtualTableBody({ table, rowCount, getRowAt, isRowDirty }: VirtualTableBodyProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const gridTemplateColumns = buildGridTemplateColumns(table);

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT_PX,
    overscan: VIRTUAL_OVERSCAN,
    initialRect: { width: 0, height: VIRTUAL_VIEWPORT_HEIGHT_PX },
    observeElementRect: (instance, cb) =>
      observeScrollElementRect(instance, cb, VIRTUAL_VIEWPORT_HEIGHT_PX),
  });

  useEffect(() => {
    virtualizer.measure();
  }, [rowCount, virtualizer]);

  const virtualItems = virtualizer.getVirtualItems();
  const mountedCount = virtualItems.length;
  const maxExpectedMounted = Math.ceil(VIRTUAL_VIEWPORT_HEIGHT_PX / ROW_HEIGHT_PX) + VIRTUAL_OVERSCAN * 2 + 4;

  return (
    <div
      ref={parentRef}
      className="relative overflow-auto"
      style={{ height: VIRTUAL_VIEWPORT_HEIGHT_PX }}
      data-testid="virtual-scroll-viewport"
    >
      <div
        style={{ height: virtualizer.getTotalSize(), position: "relative", width: "100%" }}
        data-testid="virtual-scroll-spacer"
      >
        {virtualItems.map((vi) => {
          const row = getRowAt(vi.index);
          if (!row) return null;
          return (
            <DataTableRow
              key={row.id}
              row={row}
              isDirty={isRowDirty(row.original.id)}
              gridTemplateColumns={gridTemplateColumns}
              className="absolute left-0 top-0"
              style={{
                transform: `translateY(${vi.start}px)`,
                height: vi.size,
              }}
              data-testid="data-table-row"
            />
          );
        })}
      </div>
      {import.meta.env.DEV && rowCount > 0 && (
        <div
          className="pointer-events-none absolute bottom-2 right-2 rounded bg-background/90 px-2 py-1 text-[10px] text-muted-foreground shadow-sm"
          data-testid="virtual-scroll-stats"
          aria-hidden
        >
          DOM rows: {mountedCount} / {rowCount.toLocaleString()} (max ~{maxExpectedMounted})
        </div>
      )}
    </div>
  );
}
