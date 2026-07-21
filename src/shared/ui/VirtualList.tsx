// src/shared/ui/VirtualList.tsx
import { useRef, useState, type ReactNode } from 'react';

interface VirtualListProps<T> {
  items: readonly T[];
  rowHeight: number;        // FIXED height per row — the key simplification
  height: number;           // viewport height
  overscan?: number;        // extra rows above/below, to hide scroll gaps
  renderRow: (item: T, index: number) => ReactNode;
  getKey: (item: T, index: number) => string;
}

export function VirtualList<T>({
  items,
  rowHeight,
  height,
  overscan = 5,
  renderRow,
  getKey,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalHeight = items.length * rowHeight;

  // Which slice is visible?
  const firstVisible = Math.floor(scrollTop / rowHeight);
  const visibleCount = Math.ceil(height / rowHeight);

  // Clamp with overscan.
  const start = Math.max(0, firstVisible - overscan);
  const end = Math.min(items.length, firstVisible + visibleCount + overscan);

  const visibleItems = items.slice(start, end);
  const offsetY = start * rowHeight; // push the window down to its real position

  return (
    <div
      ref={containerRef}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      style={{ height, overflow: 'auto', position: 'relative' }}
    >
      {/* Spacer that gives the scrollbar the full height of all rows */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* The window of real rows, absolutely positioned at the right offset */}
        <div style={{ transform: `translateY(${offsetY}px)`, position: 'absolute', top: 0, left: 0, right: 0 }}>
          {visibleItems.map((item, i) => (
            <div key={getKey(item, start + i)} style={{ height: rowHeight }}>
              {renderRow(item, start + i)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}