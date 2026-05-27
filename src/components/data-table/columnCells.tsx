import { memo } from "react";
import type { CellContext } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { Person } from "@/lib/generateData";
import { EditableCell } from "@/components/data-table/EditableCell";
import { useEditing } from "@/components/data-table/EditingContext";
import { RowActions } from "@/components/data-table/RowActions";

type PersonCell = CellContext<Person, unknown>;

function useIsEditingRow(rowId: number) {
  const { editingId } = useEditing();
  return editingId === rowId;
}

export const IdCell = memo(function IdCell({ getValue }: PersonCell) {
  return <span className="text-muted-foreground tabular-nums">{getValue<number>()}</span>;
});

export const NameCell = memo(function NameCell({ row, getValue }: PersonCell) {
  const { draft, updateDraft } = useEditing();
  const isEditing = useIsEditingRow(row.original.id);

  if (isEditing) {
    return (
      <EditableCell
        type="text"
        label="Name"
        value={draft.name ?? ""}
        onChange={(v) => updateDraft("name", String(v))}
      />
    );
  }
  return getValue<string>();
});

export const EmailCell = memo(function EmailCell({ row, getValue }: PersonCell) {
  const { draft, updateDraft } = useEditing();
  const isEditing = useIsEditingRow(row.original.id);

  if (isEditing) {
    return (
      <EditableCell
        type="text"
        label="Email"
        value={draft.email ?? ""}
        onChange={(v) => updateDraft("email", String(v))}
      />
    );
  }
  return <span className="text-muted-foreground">{getValue<string>()}</span>;
});

export const DepartmentCell = memo(function DepartmentCell({ row, getValue }: PersonCell) {
  const { draft, updateDraft } = useEditing();
  const isEditing = useIsEditingRow(row.original.id);

  if (isEditing) {
    return (
      <EditableCell
        type="text"
        label="Department"
        value={draft.department ?? ""}
        onChange={(v) => updateDraft("department", String(v) as Person["department"])}
      />
    );
  }
  return <Badge variant="secondary">{getValue<string>()}</Badge>;
});

export const SalaryCell = memo(function SalaryCell({ row, getValue }: PersonCell) {
  const { draft, updateDraft } = useEditing();
  const isEditing = useIsEditingRow(row.original.id);

  if (isEditing) {
    return (
      <EditableCell
        type="number"
        label="Salary"
        value={draft.salary ?? 0}
        onChange={(v) => updateDraft("salary", Number(v))}
      />
    );
  }
  return <span className="tabular-nums">${getValue<number>().toLocaleString()}</span>;
});

export const QuantityCell = memo(function QuantityCell({ row, getValue }: PersonCell) {
  const { draft, updateDraft } = useEditing();
  const isEditing = useIsEditingRow(row.original.id);

  if (isEditing) {
    return (
      <EditableCell
        type="number"
        label="Quantity"
        value={draft.quantity ?? 0}
        onChange={(v) => updateDraft("quantity", Number(v))}
      />
    );
  }
  return <span className="tabular-nums">{getValue<number>()}</span>;
});

export const ActionsCell = memo(function ActionsCell({ row }: PersonCell) {
  return <RowActions row={row.original} />;
});
