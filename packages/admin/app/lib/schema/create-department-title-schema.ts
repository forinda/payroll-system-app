import { z } from 'zod';

export const createDepartmentTitleSchema = z.object({
  name: z.string().min(2, 'Name must be at least 3 characters'),
  description: z.string().min(3, 'Description must be at least 3 characters'),
});
export type CreateDepartmentTitleType = z.infer<
  typeof createDepartmentTitleSchema
>;
