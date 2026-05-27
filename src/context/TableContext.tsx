import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Person } from "@/lib/generateData";
import { generatePeopleAsync } from "@/lib/generateDataAsync";
import { createInitialTableState, tableReducer } from "@/context/tableReducer";

type TableContextValue = {
  rows: Person[];
  rowCount: number;
  isLoading: boolean;
  loadProgress: number;
  dirtyIds: Set<number>;
  isRowDirty: (id: number) => boolean;
  saveRow: (id: number, patch: Partial<Person>) => void;
  undoRow: (id: number) => void;
  resetAll: () => void;
  hasUnsaved: boolean;
};

const TableCtx = createContext<TableContextValue | null>(null);

const emptyState = createInitialTableState([]);

export function TableProvider({ children, size = 10000 }: { children: ReactNode; size?: number }) {
  const initialRowsRef = useRef<Person[] | null>(null);
  const [state, dispatch] = useReducer(tableReducer, emptyState);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;

    generatePeopleAsync(size, (loaded, total) => {
      if (!cancelled) setLoadProgress(Math.round((loaded / total) * 100));
    }).then((rows) => {
      if (cancelled) return;
      initialRowsRef.current = rows;
      dispatch({ type: "INIT_ROWS", rows });
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [size]);

  const saveRow = useCallback((id: number, patch: Partial<Person>) => {
    dispatch({ type: "SAVE_ROW", id, patch });
  }, []);

  const undoRow = useCallback((id: number) => {
    dispatch({ type: "UNDO_ROW", id });
  }, []);

  const resetAll = useCallback(() => {
    if (initialRowsRef.current) {
      dispatch({ type: "RESET_ALL", initialRows: initialRowsRef.current });
    }
  }, []);

  const isRowDirty = useCallback((id: number) => state.dirtyIds.has(id), [state.dirtyIds]);

  const value = useMemo<TableContextValue>(
    () => ({
      rows: state.rows,
      rowCount: state.rows.length,
      isLoading,
      loadProgress,
      dirtyIds: state.dirtyIds,
      isRowDirty,
      saveRow,
      undoRow,
      resetAll,
      hasUnsaved: state.dirtyIds.size > 0,
    }),
    [state.rows, state.dirtyIds, isLoading, loadProgress, isRowDirty, saveRow, undoRow, resetAll],
  );

  return <TableCtx.Provider value={value}>{children}</TableCtx.Provider>;
}

export function useTable() {
  const ctx = useContext(TableCtx);
  if (!ctx) throw new Error("useTable must be used within TableProvider");
  return ctx;
}
