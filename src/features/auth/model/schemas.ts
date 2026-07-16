import { z } from 'zod';

export const roleSchema = z.enum(['admin', 'manager', 'user']);

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  role: roleSchema,
});

export const loginRequestSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export const authResponseSchema = z.object({
  accessToken: z.string().min(1),
  user: userSchema,
});