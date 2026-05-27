import { describe, expect, it } from "vitest";
import { generatePeopleAsync } from "@/lib/generateDataAsync";

describe("generatePeopleAsync", () => {
  it("produces the requested number of rows", async () => {
    const rows = await generatePeopleAsync(10_000);
    expect(rows).toHaveLength(10_000);
    expect(rows[0]?.id).toBe(1);
    expect(rows[9_999]?.id).toBe(10_000);
  });
});
