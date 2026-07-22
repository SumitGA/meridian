// src/features/projects/components/BulkActionBar.tsx
import { useSelectionStore } from '../stores/selectionStore';
import { useBulkArchive } from '../api/useBulkArchive';

export function BulkActionBar() {
  const count = useSelectionStore((s) => s.selectedIds.size);
  const selectedIds = useSelectionStore((s) => s.selectedIds);
  const clear = useSelectionStore((s) => s.clear);
  const { mutate, isPending } = useBulkArchive();

  if (count === 0) return null; // no selection → no bar

  return (
    <div className="mb-4 flex items-center justify-between rounded border border-slate-300 bg-slate-50 px-4 py-3">
      <span className="text-sm font-medium text-slate-700">
        {count} selected
      </span>
      <div className="flex gap-2">
        <button
          onClick={clear}
          className="rounded px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
        >
          Clear
        </button>
        <button
          onClick={() => mutate([...selectedIds])}
          disabled={isPending}
          className="rounded bg-slate-900 px-3 py-1.5 text-sm text-white disabled:opacity-50"
        >
          {isPending ? 'Archiving…' : `Archive ${count}`}
        </button>
      </div>
    </div>
  );
}