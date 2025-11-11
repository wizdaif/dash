import { z } from 'zod';

const userSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email(),
  name: z.string().min(2).max(100).optional(),
  role: z.enum(['admin', 'user', 'guest']).default('user'),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.any()).optional()
});

type User = z.infer<typeof userSchema>;
