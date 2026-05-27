/** Person ids are contiguous 1..n from `generatePeople`, so index is O(1). */
export function personIdToIndex(id: number): number {
  return id - 1;
}

export function isValidPersonId(id: number, rowCount: number): boolean {
  const index = personIdToIndex(id);
  return index >= 0 && index < rowCount;
}
