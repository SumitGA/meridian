import type { Role } from '@/features/auth';

export interface MockUser {
    id: string;
    email: string;
    password: string;
    name: string;
    role: Role;
}

export interface MockProject {
    id: string;
    name: string;
    key: string;
    status: 'active' | 'archived';
    ownerId: string;
    createdAt: string;
}

export const users: MockUser[] = [
  { id: '11111111-1111-4111-8111-111111111111', email: 'admin@meridian.io',   password: 'password', name: 'Ada Admin',      role: 'admin' },
  { id: '22222222-2222-4222-8222-222222222222', email: 'manager@meridian.io', password: 'password', name: 'Mo Manager',     role: 'manager' },
  { id: '33333333-3333-4333-8333-333333333333', email: 'user@meridian.io',    password: 'password', name: 'Uma User',       role: 'user' },
];

export const projects: MockProject[] = [
  { id: 'aaaaaaaa-0000-4000-8000-000000000001', name: 'Apollo Platform', key: 'APO', status: 'active',   ownerId: users[0]!.id, createdAt: '2026-01-14T09:00:00.000Z' },
  { id: 'aaaaaaaa-0000-4000-8000-000000000002', name: 'Billing Rewrite', key: 'BIL', status: 'active',   ownerId: users[1]!.id, createdAt: '2026-02-02T09:00:00.000Z' },
  { id: 'aaaaaaaa-0000-4000-8000-000000000003', name: 'Legacy Migration', key: 'LEG', status: 'archived', ownerId: users[0]!.id, createdAt: '2025-11-20T09:00:00.000Z' },
];

export const refreshTokens = new Map<string, { userId: string; family: string }>();
export const revokedFamilies = new Set<string>();
