# Editable Data Table

A high-performance editable data table built with React, TanStack Table, and TanStack Virtual.

## Features

- Inline editing of text and numeric fields with per-row Save / Cancel / Undo
- Handles 10,000+ rows via row virtualization (TanStack Virtual)
- Pagination as a fallback rendering mode (toggle in toolbar)
- Multi-column sort (asc/desc/none toggle)
- Per-column text and numeric filtering, plus Clear Filters
- Unsaved-change tracking with row highlight + `beforeunload` prompt
- Export visible (filtered) rows to CSV
- Context-based state management for the table data

## Stack

- React 19 + TypeScript
- TanStack Router (route: `/`)
- TanStack Table v8 (sort, filter, pagination model)
- TanStack Virtual (windowed rendering)
- Tailwind CSS + shadcn/ui primitives

## Run

```
npm install
npm run dev
```

## Deploy to Vercel

This app uses [TanStack Start](https://tanstack.com/start) with the [Nitro](https://nitro.build) adapter (required for Vercel). Push to your connected Git repo and redeploy, or run `npx vercel --prod`.

In the Vercel project settings, use the defaults: **Build Command** `npm run build`, leave **Output Directory** empty (do not set `dist` or `dist/client`). Vercel detects TanStack Start and uses Nitro’s `.vercel/output` automatically.

## Approach

### Data layer (`src/context/`)

- **`tableReducer`**: Immutable updates via `useReducer`. Row lookups use `id - 1` (O(1)) because generated ids are contiguous (`src/lib/personRowIndex.ts`).
- **`TableProvider`**: Single source of truth for rows, dirty set, and undo snapshots. Updates copy only the changed row slot (`rows.slice()` + index write), skipping no-op patches.
- **API**: `isRowDirty(id)` stable callback for memoized row components.

### Table UI (`src/components/data-table/`)

- **Stable columns** (`columns.tsx` + `columnCells.tsx`): Column definitions never depend on draft state, so typing in a cell does not rebuild the entire column model.
- **`EditingProvider`**: Draft and `editingId` isolated from TanStack Table config.
- **`useDataTable`**: `useDeferredValue` on sort/filter state so 10k-row filter/sort work stays off the critical input path.
- **Virtual rows**: `DataTableRow` is `memo`’d with a custom comparator (row reference, dirty flag, layout only).
- **Virtual scroll**: TanStack Virtual with fixed row height, overscan, and ~20–40 DOM rows for 10k data. `observeScrollElementRect` prevents a 0px viewport (which would mount no rows).
- **Async dataset load**: 10k rows are generated in 500-row chunks so the UI stays responsive (`generatePeopleAsync`).

### Editing flow

- Save commits draft through context (original captured on first save). Cancel drops draft. Undo restores the pre-save snapshot.

### Filtering / sorting / export

- TanStack Table row models; numeric filters use `>=` lower bound. CSV exports visible (filtered or paginated) rows.

## Tests

```bash
npm test
```

`VirtualTableBody.test.tsx` verifies that with 10,000 records, the DOM contains far fewer than 500 row nodes (virtual window only).

## Known limitations

- Numeric filters are a simple lower-bound (`>= value`) instead of a full range UI.
- Department is a free-text input in edit mode rather than a typed select.
- Data is in-memory only; there is no backend persistence.
- `beforeunload` cannot intercept in-app route changes, only tab close / reload.
