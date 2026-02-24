import { z } from 'zod';

export const SignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const CreateTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be at most 255 characters'),
  description: z.string().optional().transform(val => val && val.trim() ? val.trim() : undefined),
  dueDate: z.string().optional().transform(val => {
    if (!val || !val.trim()) return undefined;
    const date = new Date(val);
    return isNaN(date.getTime()) ? undefined : date.toISOString();
  }),
});

export const UpdateTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be at most 255 characters').optional(),
  description: z.string().optional().transform(val => val && val.trim() ? val.trim() : undefined),
  status: z.enum(['pending', 'completed']).optional(),
  dueDate: z.string().optional().transform(val => {
    if (!val || !val.trim()) return undefined;
    const date = new Date(val);
    return isNaN(date.getTime()) ? undefined : date.toISOString();
  }),
});

export type SignupInput = z.infer<typeof SignupSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type CreateTodoInput = z.infer<typeof CreateTodoSchema>;
export type UpdateTodoInput = z.infer<typeof UpdateTodoSchema>;
