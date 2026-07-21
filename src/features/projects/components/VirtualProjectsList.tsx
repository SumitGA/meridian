// src/features/projects/components/VirtualProjectsList.tsx
import dayjs from 'dayjs';
import { VirtualList } from '@/shared/ui/VirtualList';
import type { Project } from '../model/types';

const ROW_HEIGHT = 56;

export function VirtualProjectsList({ projects }: { projects: readonly Project[] }) {
  return (
    <div className="rounded border border-slate-200">
      <div className="flex border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
        <span className="flex-1">Project</span>
        <span className="w-24">Key</span>
        <span className="w-28">Status</span>
        <span className="w-32">Created</span>
      </div>

      <VirtualList
        items={projects}
        rowHeight={ROW_HEIGHT}
        height={600}
        getKey={(p) => p.id}
        renderRow={(p) => (
          <div className="flex items-center border-b border-slate-100 px-4 text-sm" style={{ height: ROW_HEIGHT }}>
            <span className="flex-1 font-medium text-slate-900">{p.name}</span>
            <span className="w-24 font-mono text-xs">{p.key}</span>
            <span className={`w-28 ${p.status === 'active' ? 'text-emerald-700' : 'text-slate-500'}`}>
              {p.status}
            </span>
            <span className="w-32 text-slate-500">{dayjs(p.createdAt).format('D MMM YYYY')}</span>
          </div>
        )}
      />
    </div>
  );
}