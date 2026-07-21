
type MockRole = 'admin' | 'manager' | 'user';

export interface MockUser {
    id: string;
    email: string;
    password: string;
    name: string;
    role: MockRole;
}

export interface MockProject {
    id: string;
    name: string;
    key: string;
    status: 'active' | 'archived';
    ownerId: string;
    createdAt: string;
}

export interface AuthCodeRecord {
  userId: string;
  challenge: string;
  redirectUri: string;
  expiresAt: number;
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

/**
 * MSW mock state lives in page memory, but OAuth is built on full-page
 * redirects — so this must survive one. Real providers keep codes server-side.
 * DEV ONLY.
 */
const CODES_KEY = 'meridian.mock.authCodes';

export const authCodes = {
  set(code: string, record: AuthCodeRecord): void {
    const all = this.readAll();
    all[code] = record;
    sessionStorage.setItem(CODES_KEY, JSON.stringify(all));
  },
  get(code: string): AuthCodeRecord | undefined {
    return this.readAll()[code];
  },
  delete(code: string): void {
    const all = this.readAll();
    delete all[code];
    sessionStorage.setItem(CODES_KEY, JSON.stringify(all));
  },
  readAll(): Record<string, AuthCodeRecord> {
    try {
      return JSON.parse(sessionStorage.getItem(CODES_KEY) ?? '{}') as Record<string, AuthCodeRecord>;
    } catch {
      return {};
    }
  },
};

// const ADJECTIVES = ['Apollo', 'Billing', 'Legacy', 'Quantum', 'Nimbus', 'Vertex', 'Atlas', 'Zephyr'];
// const NOUNS = ['Platform', 'Rewrite', 'Migration', 'Engine', 'Pipeline', 'Gateway', 'Service', 'Core'];

// function generateProjects(count: number): MockProject[] {
//   const out: MockProject[] = [];
//   for (let i = 0; i < count; i++) {
//     const adj = ADJECTIVES[i % ADJECTIVES.length]!;
//     const noun = NOUNS[Math.floor(i / ADJECTIVES.length) % NOUNS.length]!;
//     out.push({
//       id: `proj-${i.toString().padStart(6, '0')}`,
//       name: `${adj} ${noun} ${i}`,
//       key: `P${i.toString().padStart(4, '0')}`,
//       status: i % 5 === 0 ? 'archived' : 'active',
//       ownerId: `user-${i % 3}`,
//       createdAt: new Date(Date.now() - i * 86_400_000).toISOString(),
//     });
//   }
//   return out;
// }

// // Toggle scale here. Start at 50_000 to feel the pain.
// export const projects: MockProject[] = generateProjects(200);