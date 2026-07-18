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
});