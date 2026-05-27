import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Person } from "@/lib/generateData";
import { useTable } from "@/context/TableContext";

type DraftPatch = Partial<Pick<Person, "name" | "email" | "department" | "salary" | "quantity">>;

type EditingContextValue = {
  editingId: number | null;
  draft: DraftPatch;
  beginEdit: (row: Person) => void;
  cancelEdit: () => void;
  commitEdit: (id: number) => void;
  updateDraft: <K extends keyof DraftPatch>(field: K, value: DraftPatch[K]) => void;
};

const EditingCtx = createContext<EditingContextValue | null>(null);

function rowToDraft(row: Person): DraftPatch {
  return {
    name: row.name,
    email: row.email,
    department: row.department,
    salary: row.salary,
    quantity: row.quantity,
  };
}

export function EditingProvider({ children }: { children: ReactNode }) {
  const { saveRow } = useTable();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<DraftPatch>({});

  const beginEdit = useCallback((row: Person) => {
    setEditingId(row.id);
    setDraft(rowToDraft(row));
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setDraft({});
  }, []);

  const commitEdit = useCallback(
    (id: number) => {
      saveRow(id, draft);
      setEditingId(null);
      setDraft({});
    },
    [draft, saveRow],
  );

  const updateDraft = useCallback(<K extends keyof DraftPatch>(field: K, value: DraftPatch[K]) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }, []);

  const value = useMemo<EditingContextValue>(
    () => ({
      editingId,
      draft,
      beginEdit,
      cancelEdit,
      commitEdit,
      updateDraft,
    }),
    [editingId, draft, beginEdit, cancelEdit, commitEdit, updateDraft],
  );

  return <EditingCtx.Provider value={value}>{children}</EditingCtx.Provider>;
}

export function useEditing() {
  const ctx = useContext(EditingCtx);
  if (!ctx) throw new Error("useEditing must be used within EditingProvider");
  return ctx;
}
