// src/shared/ui/DataTable.tsx
import type { ReactNode } from 'react';

export interface Column<T> {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  width?: string;
}

export interface DataTableProps<T> {
  rows: readonly T[];
  columns: readonly Column<T>[];
  getRowId: (row: T) => string;
  /** The seam. Caller decides what actions exist, and for whom. */
  rowActions?: (row: T) => ReactNode;
  isLoading?: boolean;
  emptyMessage?: ReactNode;
  caption?: string;
}

export function DataTable<T>({
  rows,
  columns,
  getRowId,
  rowActions,
  isLoading = false,
  emptyMessage = 'No results.',
  caption,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2" aria-busy="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded bg-slate-100" />
        ))}
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="rounded border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded border border-slate-200">
      <table className="w-full border-collapse text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            {columns.map((col) => (
              <th
                key={col.id}
                scope="col"
                style={col.width ? { width: col.width } : undefined}
                className="px-4 py-3 text-left font-medium text-slate-700"
              >
                {col.header}
              </th>
            ))}
            {rowActions && (
              <th scope="col" className="px-4 py-3 text-right font-medium text-slate-700">
                <span className="sr-only">Actions</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getRowId(row)} className="border-b border-slate-100 last:border-0">
              {columns.map((col) => (
                <td key={col.id} className="px-4 py-3">
                  {col.cell(row)}
                </td>
              ))}
              {rowActions && <td className="px-4 py-3 text-right">{rowActions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}