import { describe, it, expect } from 'vitest';
import { canEditProject } from '../policies';
import type { User } from '@/features/auth';
import type { Project } from '../types';

const owner: User = { id: 'user-1', email: 'a@x.io', name: 'Owner', role: 'user' };
const other: User = { id: 'user-2', email: 'b@x.io', name: 'Other', role: 'user' };
const project: Project = {
  id: 'proj-1',
  name: 'Test',
  key: 'TST',
  status: 'active',
  ownerId: 'user-1',        // owned by `owner`
  createdAt: '2026-01-01',
};

describe('canEditProject', () => {
  it('lets the owner edit their own project without permission', () => {
    expect(canEditProject(project, owner, false)).toBe(true);
  });
  it('lets the owner edit with permission too', () => {
    expect(canEditProject(project, owner, true)).toBe(true);
  });
  it('blocks a non-owner without permission', () => {
    expect(canEditProject(project, other, false)).toBe(false);
  });
  it('lets a non-owner WITH permission edit any project', () => {
    expect(canEditProject(project, other, true)).toBe(true);
  });
});