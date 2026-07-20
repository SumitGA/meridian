// src/features/auth/model/permissions.test.ts
import { describe, it, expect } from 'vitest';
import { permissionsFor } from '../permissions';

describe('permissionsFor', () => {
  it('grants admin everything', () => {
    const admin = permissionsFor('admin');
    expect(admin.has('project:delete')).toBe(true);
    expect(admin.has('billing:manage')).toBe(true);
    expect(admin.has('admin:access')).toBe(true);
  });

  it('lets managers create but not delete projects', () => {
    const m = permissionsFor('manager');
    expect(m.has('project:create')).toBe(true);
    expect(m.has('project:delete')).toBe(false);
    expect(m.has('admin:access')).toBe(false);
  });

  it('restricts users to read-only', () => {
    const u = permissionsFor('user');
    expect(u.has('project:view')).toBe(true);
    expect(u.has('project:create')).toBe(false);
  });

  it('lets auditor to view but not edit delete projects', () => {
    //expect permissionFor to have role auditor first
    const a = permissionsFor('auditor');
    expect(a.has('project:view')).toBe(true);
    expect(a.has('member:view')).toBe(true);
    expect(a.has('member:remove')).toBe(false);
    expect(a.has('member:invite')).toBe(false);
    expect(a.has('project:create')).toBe(false);
    expect(a.has('project:delete')).toBe(false);
    expect(a.has('project:edit')).toBe(false);
    expect(a.has('project:archive')).toBe(false);
  });
});