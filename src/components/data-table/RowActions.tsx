import { memo } from "react";
import { Check, Pencil, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTable } from "@/context/TableContext";
import { useEditing } from "@/components/data-table/EditingContext";
import type { Person } from "@/lib/generateData";

type RowActionsProps = {
  row: Person;
};

export const RowActions = memo(function RowActions({ row }: RowActionsProps) {
  const { isRowDirty, undoRow } = useTable();
  const { editingId, beginEdit, cancelEdit, commitEdit } = useEditing();

  const isEditing = editingId === row.id;
  const isDirty = isRowDirty(row.id);

  return (
    <div className="flex items-center gap-1">
      {isEditing ? (
        <>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={() => commitEdit(row.id)}
            aria-label={`Save row ${row.id}`}
          >
            <Check className="h-4 w-4 text-green-600" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={cancelEdit}
            aria-label={`Cancel edit row ${row.id}`}
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={() => beginEdit(row)}
          aria-label={`Edit row ${row.id}`}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      {isDirty && !isEditing && (
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={() => undoRow(row.id)}
          aria-label={`Undo row ${row.id}`}
        >
          <RotateCcw className="h-4 w-4 text-amber-600" />
        </Button>
      )}
    </div>
  );
});
