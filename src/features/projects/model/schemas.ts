// src/features/projects/model/schemas.ts
import { z } from 'zod';

export const projectStatusSchema = z.enum(['active', 'archived']);

export const projectSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  key: z.string(),
  status: projectStatusSchema,
  ownerId: z.string().uuid(),
  createdAt: z.string().datetime(),
});

export const projectListSchema = z.object({
  items: z.array(projectSchema),
  total: z.number().int().nonnegative(),
});

export const createProjectSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  key: z
    .string()
    .min(2, 'Key must be at least 2 characters')
    .max(5)
    .regex(/^[A-Z]+$/, 'Key must be uppercase letters only'),
});