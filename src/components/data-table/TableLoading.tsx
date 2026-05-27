import { Progress } from "@/components/ui/progress";

type TableLoadingProps = {
  progress: number;
  rowTarget: number;
};

export function TableLoading({ progress, rowTarget }: TableLoadingProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 rounded-lg border bg-card px-6 py-16"
      data-testid="table-loading"
    >
      <p className="text-sm text-muted-foreground">Loading {rowTarget.toLocaleString()} rows…</p>
      <Progress value={progress} className="h-2 w-full max-w-md" />
      <p className="text-xs text-muted-foreground">{progress}%</p>
    </div>
  );
}
