// src/features/projects/model/types.ts
import type { z } from 'zod';
import type {
  createProjectSchema,
  projectListSchema,
  projectSchema,
  projectStatusSchema,
} from './schemas';

export type Project = z.infer<typeof projectSchema>;
export type ProjectStatus = z.infer<typeof projectStatusSchema>;
export type ProjectList = z.infer<typeof projectListSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;