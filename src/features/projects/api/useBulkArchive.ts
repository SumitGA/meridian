// src/features/projects/api/useBulkArchive.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bulkArchiveProjects } from './projectsApi';
import { projectKeys } from './projectKeys';
import { useSelectionStore } from '../stores/selectionStore';
import type { ProjectList } from '../model/types';

export function useBulkArchive() {
  const qc = useQueryClient();
  const clearSelection = useSelectionStore((s) => s.clear);

  return useMutation({
    mutationFn: (ids: string[]) => bulkArchiveProjects(ids),

    // onMutate = "before the request". This is your thunk's pre-dispatch snapshot.
    onMutate: async (ids) => {
      // 1. Cancel in-flight refetches so they don't overwrite our optimistic write.
      await qc.cancelQueries({ queryKey: projectKeys.lists() });

      // 2. Snapshot EVERY cached list variant, for rollback. (Redux: capture prior state.)
      const previous = qc.getQueriesData<ProjectList>({ queryKey: projectKeys.lists() });

      // 3. Optimistically archive: update every cached list immediately.
      qc.setQueriesData<ProjectList>({ queryKey: projectKeys.lists() }, (old) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((p) =>
            ids.includes(p.id) ? { ...p, status: 'archived' as const } : p,
          ),
        };
      });

      // 4. Clear the selection immediately — the action "happened" from the user's view.
      clearSelection();

      // 5. Return the snapshot so onError can restore it. (This is the thunk's rollback data.)
      return { previous };
    },

    // onError = the request failed. Restore the snapshot. (Your thunk's catch → revert.)
    onError: (_err, _ids, context) => {
      context?.previous.forEach(([queryKey, data]) => {
        qc.setQueryData(queryKey, data); // put every list back exactly as it was
      });
    },

    // onSettled = success OR failure. Reconcile with the server's truth.
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}