import type { z } from 'zod';
import type {
    authResponseSchema,
    loginRequestSchema,
    roleSchema, 
    userSchema,
} from './schemas';

export type Role = z.infer<typeof roleSchema>;
export type User = z.infer<typeof userSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
