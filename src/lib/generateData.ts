export type Department = "Engineering" | "Sales" | "Marketing" | "Support" | "Finance" | "HR";

export type Person = {
  id: number;
  name: string;
  email: string;
  department: Department;
  salary: number;
  quantity: number;
};

const firstNames = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Jamie", "Avery", "Quinn", "Sky", "Drew", "Reese", "Cameron", "Sasha", "Devon", "Harper"];
const lastNames = ["Smith", "Johnson", "Lee", "Brown", "Garcia", "Miller", "Davis", "Wilson", "Martinez", "Anderson", "Thomas", "Moore", "Jackson", "White", "Harris", "Clark"];
const departments: Department[] = ["Engineering", "Sales", "Marketing", "Support", "Finance", "HR"];

export function createPersonAtIndex(i: number): Person {
  const first = firstNames[i % firstNames.length];
  const last = lastNames[(i * 7) % lastNames.length];
  const name = `${first} ${last}`;
  return {
    id: i + 1,
    name,
    email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@example.com`,
    department: departments[i % departments.length],
    salary: 40000 + ((i * 137) % 120000),
    quantity: (i * 13) % 500,
  };
}

export function generatePeople(count: number): Person[] {
  const rows: Person[] = new Array(count);
  for (let i = 0; i < count; i++) {
    rows[i] = createPersonAtIndex(i);
  }
  return rows;
}
