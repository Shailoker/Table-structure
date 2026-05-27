import type { Person } from "@/lib/generateData";
import { personIdToIndex, isValidPersonId } from "@/lib/personRowIndex";

export type TableState = {
  rows: Person[];
  dirtyIds: Set<number>;
  /** Snapshot of each row before its first save in the current edit cycle. */
  originals: Map<number, Person>;
};

export type TableAction =
  | { type: "INIT_ROWS"; rows: Person[] }
  | { type: "SAVE_ROW"; id: number; patch: Partial<Person> }
  | { type: "UNDO_ROW"; id: number }
  | { type: "RESET_ALL"; initialRows: Person[] };

function patchRow(rows: Person[], id: number, patch: Partial<Person>): Person[] | null {
  if (!isValidPersonId(id, rows.length)) return null;
  const index = personIdToIndex(id);
  const current = rows[index];
  const updated: Person = { ...current, ...patch };
  if (
    updated.name === current.name &&
    updated.email === current.email &&
    updated.department === current.department &&
    updated.salary === current.salary &&
    updated.quantity === current.quantity
  ) {
    return null;
  }
  const next = rows.slice();
  next[index] = updated;
  return next;
}

export function createInitialTableState(rows: Person[]): TableState {
  return {
    rows,
    dirtyIds: new Set(),
    originals: new Map(),
  };
}

export function tableReducer(state: TableState, action: TableAction): TableState {
  switch (action.type) {
    case "INIT_ROWS":
      return createInitialTableState(action.rows);
    case "SAVE_ROW": {
      const nextRows = patchRow(state.rows, action.id, action.patch);
      if (!nextRows) return state;

      const originals = new Map(state.originals);
      if (!originals.has(action.id)) {
        const index = personIdToIndex(action.id);
        originals.set(action.id, state.rows[index]);
      }

      const dirtyIds = new Set(state.dirtyIds);
      dirtyIds.add(action.id);

      return { rows: nextRows, dirtyIds, originals };
    }
    case "UNDO_ROW": {
      const original = state.originals.get(action.id);
      if (!original) return state;

      const index = personIdToIndex(action.id);
      if (!isValidPersonId(action.id, state.rows.length)) return state;

      const nextRows = state.rows.slice();
      nextRows[index] = original;

      const originals = new Map(state.originals);
      originals.delete(action.id);

      const dirtyIds = new Set(state.dirtyIds);
      dirtyIds.delete(action.id);

      return { rows: nextRows, dirtyIds, originals };
    }
    case "RESET_ALL": {
      return createInitialTableState(action.initialRows);
    }
    default:
      return state;
  }
}
