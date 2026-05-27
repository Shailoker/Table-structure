import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { RenderMode } from "@/components/data-table/constants";

type TableToolbarProps = {
  visibleCount: number;
  totalCount: number;
  dirtyCount: number;
  mode: RenderMode;
  onModeChange: (mode: RenderMode) => void;
  onClearFilters: () => void;
  onResetAll: () => void;
  onExport: () => void;
  mountedRowHint?: string;
};

export function TableToolbar({
  visibleCount,
  totalCount,
  dirtyCount,
  mode,
  onModeChange,
  onClearFilters,
  onResetAll,
  onExport,
  mountedRowHint,
}: TableToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-col gap-0.5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-2">
        <span>
          {visibleCount.toLocaleString()} / {totalCount.toLocaleString()} rows in view
        </span>
        {mountedRowHint && (
          <span className="text-xs" data-testid="mounted-row-hint">
            · {mountedRowHint}
          </span>
        )}
        {dirtyCount > 0 && (
          <Badge variant="default" className="bg-amber-500 hover:bg-amber-500">
            {dirtyCount} unsaved
          </Badge>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-md border bg-background p-0.5">
          <Button
            size="sm"
            variant={mode === "virtual" ? "default" : "ghost"}
            onClick={() => onModeChange("virtual")}
          >
            Virtual
          </Button>
          <Button
            size="sm"
            variant={mode === "paginated" ? "default" : "ghost"}
            onClick={() => onModeChange("paginated")}
          >
            Paginated
          </Button>
        </div>
        <Button size="sm" variant="outline" onClick={onClearFilters}>
          Clear filters
        </Button>
        <Button size="sm" variant="outline" onClick={onResetAll}>
          Reset all
        </Button>
        <Button size="sm" onClick={onExport}>
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>
    </div>
  );
}
