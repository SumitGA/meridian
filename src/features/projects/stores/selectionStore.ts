// src/features/projects/stores/selectionStore.ts
import { create } from 'zustand';

interface SelectionState {
  // A Set, not an array. O(1) has/add/delete instead of O(n).
  selectedIds: Set<string>;

  toggle: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clear: () => void;
  isSelected: (id: string) => boolean;
  count: () => number;
}

export const useSelectionStore = create<SelectionState>((set, get) => ({
  selectedIds: new Set<string>(),

  toggle: (id) =>
    set((state) => {
      const next = new Set(state.selectedIds); // new Set → new reference → triggers re-render
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { selectedIds: next };
    }),

  selectAll: (ids) =>
    set((state) => {
      const allSelected = ids.every((id) => state.selectedIds.has(id));
      // If everything visible is already selected, clicking "select all" clears it (toggle behavior).
      return { selectedIds: allSelected ? new Set() : new Set(ids) };
    }),

  clear: () => set({ selectedIds: new Set() }),

  isSelected: (id) => get().selectedIds.has(id),
  count: () => get().selectedIds.size,
}));