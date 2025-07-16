import { z } from 'zod';

export const userInputSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Birthday is required'),
  country: z.string().min(2, 'Country is required'),
});

export type ValidatedUserInput = z.infer<typeof userInputSchema>;