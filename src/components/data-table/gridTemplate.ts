import type { Table } from "@tanstack/react-table";
import type { Person } from "@/lib/generateData";

const COLUMN_WIDTHS: Record<string, string> = {
  id: "70px",
  actions: "110px",
  email: "minmax(220px, 1.6fr)",
  salary: "minmax(120px, 1fr)",
  quantity: "minmax(120px, 1fr)",
};

const DEFAULT_WIDTH = "minmax(140px, 1fr)";

export function buildGridTemplateColumns(table: Table<Person>): string {
  return table
    .getAllLeafColumns()
    .map((col) => COLUMN_WIDTHS[col.id] ?? DEFAULT_WIDTH)
    .join(" ");
}
