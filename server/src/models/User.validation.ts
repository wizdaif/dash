import z from "zod";

const userSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email(),
  name: z.string().min(2).max(100).optional(),
  role: z.enum(["admin", "user", "guest"]).default("user"),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

const authenticateUserSchema = z.object({
  type: z.enum(["discord", "roblox"]),
  id: z.string(),
  email: z.string().optional(),
  username: z.string().optional(),
});

const removeUserLinkSchema = z.object({
  type: z.enum(["discord", "roblox"]),
});

type User = z.infer<typeof userSchema>;
type AuthenticateUserOptions = z.infer<typeof authenticateUserSchema>;

export {
  userSchema,
  authenticateUserSchema,
  removeUserLinkSchema,
  type User,
  type AuthenticateUserOptions,
};
