export type RenderMode = "virtual" | "paginated";

export const DEFAULT_DATASET_SIZE = 10000;

export const ROW_HEIGHT_PX = 44;
export const VIRTUAL_VIEWPORT_HEIGHT_PX = 560;
export const VIRTUAL_OVERSCAN = 12;
export const PAGINATION_PAGE_SIZE = 50;

export const CSV_COLUMNS = [
  { key: "id" as const, header: "ID" },
  { key: "name" as const, header: "Name" },
  { key: "email" as const, header: "Email" },
  { key: "department" as const, header: "Department" },
  { key: "salary" as const, header: "Salary" },
  { key: "quantity" as const, header: "Quantity" },
];
