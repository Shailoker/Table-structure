import { createFileRoute } from "@tanstack/react-router";
import { EditableTable } from "@/components/EditableTable";
import { TableProvider, useTable } from "@/context/TableContext";
import { useBeforeUnload } from "@/hooks/useBeforeUnload";

export const Route = createFileRoute("/")({
  component: Index,
});

function UnsavedGuard() {
  const { hasUnsaved } = useTable();
  useBeforeUnload(hasUnsaved);
  return null;
}

function Index() {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <h1 className="text-xl font-semibold tracking-tight">Editable Data Table</h1>
          <p className="text-sm text-muted-foreground">10,000 rows · inline editing · virtual scrolling · sort &amp; filter</p>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-6">
        <TableProvider size={10000}>
          <UnsavedGuard />
          <EditableTable />
        </TableProvider>
      </main>
    </div>
  );
}
