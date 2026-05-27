import { createPersonAtIndex, type Person } from "@/lib/generateData";

const CHUNK_SIZE = 500;

/** Builds large datasets in chunks so the UI thread stays responsive. */
export function generatePeopleAsync(
  count: number,
  onProgress?: (loaded: number, total: number) => void,
): Promise<Person[]> {
  return new Promise((resolve) => {
    const rows: Person[] = new Array(count);
    let index = 0;

    const tick = () => {
      const end = Math.min(index + CHUNK_SIZE, count);
      for (let i = index; i < end; i++) {
        rows[i] = createPersonAtIndex(i);
      }
      index = end;
      onProgress?.(index, count);

      if (index < count) {
        requestAnimationFrame(tick);
      } else {
        resolve(rows);
      }
    };

    requestAnimationFrame(tick);
  });
}
