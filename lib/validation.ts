import { z } from 'zod';

// Login form validation schema
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Registration form validation schema
export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
  nickname: z.string().min(3, 'Nickname must be at least 3 characters'),
  completeName: z.string().min(3, 'Complete name must be at least 3 characters'),
  telephone: z.string().min(10, 'Telephone number must be at least 10 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  profileImage: z.string().min(5, 'Profile image is required').optional(),
}).refine(data => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// Reset password form validation schema
export const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;