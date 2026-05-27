import { memo } from "react";
import { Input } from "@/components/ui/input";

type EditableCellProps = {
  value: string | number;
  type: "text" | "number";
  onChange: (value: string | number) => void;
  label: string;
};

export const EditableCell = memo(function EditableCell({
  value,
  type,
  onChange,
  label,
}: EditableCellProps) {
  return (
    <Input
      type={type}
      value={value}
      aria-label={label}
      onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
      className="h-8"
    />
  );
});
