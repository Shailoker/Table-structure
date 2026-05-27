# Editable Data Table

A fast and scalable editable data table built with React, TypeScript, and the TanStack ecosystem.

The main goal of this project was to build a table that still feels smooth and responsive even when working with large datasets (10,000+ rows), while supporting inline editing, filtering, sorting, and virtualization.

---

## Features

- Inline editing for text and numeric fields
- Row-level Save, Cancel, and Undo functionality
- Handles large datasets efficiently using virtualization
- Optional pagination mode
- Multi-column sorting
- Text and numeric filtering
- CSV export for visible rows
- Unsaved changes tracking
- Browser refresh / tab close protection
- Centralized state management using Context + Reducer

---

## Tech Stack

- React 19
- TypeScript
- TanStack Table v8
- TanStack Virtual
- TanStack Router
- Tailwind CSS
- shadcn/ui

---

# Getting Started

## Install dependencies

```bash
npm install
```

## Run the project

```bash
npm run dev
```

## Run tests

```bash
npm test
```

---

# Deployment

This project is configured using TanStack Start with the Nitro adapter, which makes deployment on Vercel straightforward.

```bash
npx vercel --prod
```

Recommended Vercel settings:

- Build Command: `npm run build`
- Output Directory: leave empty

Nitro automatically generates the required `.vercel/output` files.

---

# Project Overview

## State Management

The table data is managed using a reducer-based architecture inside a React Context provider.

A few implementation details:

- Rows are updated immutably
- Only modified rows are replaced
- Dirty rows are tracked separately
- Undo snapshots are stored for recovery

The provider acts as the single source of truth for:

- table rows
- edit state
- dirty tracking
- undo history

---

## Performance Optimizations

The biggest focus of the project was performance with large datasets.

### Virtualization

Instead of rendering all 10,000 rows into the DOM, only the visible rows are mounted.

This keeps scrolling smooth and avoids unnecessary DOM overhead.

### Stable Column Definitions

Column definitions are kept stable so typing in a cell does not rebuild the entire table configuration.

### Deferred Filtering & Sorting

Sorting and filtering operations are deferred to avoid blocking user input during heavy computations.

### Memoized Rows

Rows are memoized to minimize unnecessary re-renders while editing or scrolling.

---

# Editing Flow

Each row has its own editing lifecycle:

- Edit inline
- Save changes
- Cancel changes
- Undo saved edits

Unsaved changes are tracked automatically, and users are warned before refreshing or closing the tab.

---

# CSV Export

The export feature downloads only the currently visible rows.

This includes:

- filtered rows
- paginated rows
- sorted rows

---

# Testing

The project includes tests for virtualization behavior.

Example:

- ensuring that the DOM only renders a small subset of rows even when the dataset contains 10,000 records

---

# Current Limitations

Some areas that can still be improved:

- Numeric filtering currently supports only lower-bound filtering (`>=`)
- Department editing is still a free-text field
- Data is stored in memory only
- `beforeunload` protection does not block internal route navigation

---

# Possible Improvements

A few ideas for future enhancements:

- Backend persistence
- Server-side pagination
- Infinite scrolling
- Column resizing and reordering
- Keyboard navigation support
- Row selection and bulk actions
- Advanced numeric range filters
```