// # Skema Zod (validasi form)
import { z } from "zod";

// Definisikan schema berdasarkan response API Golang lu
export const transactionSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  amount: z.number(),
  description: z.string().nullable().optional(),
  category: z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(), // "EXPENSE" atau "INCOME" atau "INVESTMENT"
    user_id: z.string().nullable().optional(),
  }),
  user: z
    .object({
      id: z.string(),
      email: z.string(),
      username: z.string(),
      user_role: z.string(),
    })
    .nullable()
    .optional(),
});

// Otomatis bikin tipe TypeScript-nya
export type ZTransaction = z.infer<typeof transactionSchema>;
