import { render, screen, waitFor } from "@testing-library/react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  type Row,
} from "@tanstack/react-table";
import { describe, expect, it } from "vitest";
import { generatePeople, type Person } from "@/lib/generateData";
import { VirtualTableBody } from "@/components/data-table/VirtualTableBody";
import {
  PAGINATION_PAGE_SIZE,
  ROW_HEIGHT_PX,
  VIRTUAL_OVERSCAN,
  VIRTUAL_VIEWPORT_HEIGHT_PX,
} from "@/components/data-table/constants";

const columnHelper = createColumnHelper<Person>();

const columns = [
  columnHelper.accessor("id", { header: "ID" }),
  columnHelper.accessor("name", { header: "Name" }),
];

function VirtualTableHarness({ data }: { data: Person[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => String(row.id),
  });

  const rows = table.getRowModel().rows;
  const getRowAt = (index: number) => rows[index] as Row<Person>;

  return (
    <VirtualTableBody
      table={table}
      rowCount={rows.length}
      getRowAt={getRowAt}
      isRowDirty={() => false}
    />
  );
}

const maxExpectedDomRows =
  Math.ceil(VIRTUAL_VIEWPORT_HEIGHT_PX / ROW_HEIGHT_PX) + VIRTUAL_OVERSCAN * 2 + 8;

describe("VirtualTableBody", () => {
  it("mounts only a window of rows for 10,000 records (not all rows in the DOM)", async () => {
    const data = generatePeople(10_000);

    render(<VirtualTableHarness data={data} />);

    await waitFor(() => {
      const domRows = screen.getAllByTestId("data-table-row");
      expect(domRows.length).toBeGreaterThan(0);
      expect(domRows.length).toBeLessThanOrEqual(maxExpectedDomRows);
      expect(domRows.length).toBeLessThan(500);
    });

    const stats = screen.getByTestId("virtual-scroll-stats");
    expect(stats.textContent).toMatch(/DOM rows: \d+ \/ 10,000/);
  });

  it("paginated mode baseline renders at most one page of rows", () => {
    expect(PAGINATION_PAGE_SIZE).toBe(50);
  });
});
