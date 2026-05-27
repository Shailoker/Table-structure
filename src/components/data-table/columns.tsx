import { createColumnHelper } from "@tanstack/react-table";
import type { Person } from "@/lib/generateData";
import {
  ActionsCell,
  DepartmentCell,
  EmailCell,
  IdCell,
  NameCell,
  QuantityCell,
  SalaryCell,
} from "@/components/data-table/columnCells";

const columnHelper = createColumnHelper<Person>();

/** Stable column definitions — edit state lives in EditingContext, not in column deps. */
export const DATA_TABLE_COLUMNS = [
  columnHelper.accessor("id", {
    header: "ID",
    cell: IdCell,
    size: 70,
    enableColumnFilter: false,
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: NameCell,
    filterFn: "includesString",
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: EmailCell,
    filterFn: "includesString",
  }),
  columnHelper.accessor("department", {
    header: "Department",
    cell: DepartmentCell,
    filterFn: "includesString",
  }),
  columnHelper.accessor("salary", {
    header: "Salary",
    cell: SalaryCell,
    filterFn: "inNumberRange",
  }),
  columnHelper.accessor("quantity", {
    header: "Quantity",
    cell: QuantityCell,
    filterFn: "inNumberRange",
  }),
  columnHelper.display({
    id: "actions",
    header: "",
    size: 110,
    cell: ActionsCell,
    enableColumnFilter: false,
    enableSorting: false,
  }),
];
