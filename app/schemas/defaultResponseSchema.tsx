import { z } from "zod";

export const defaultResponseSchema = z.object({
  message: z.string().optional(),
});

export type DefaultResponseSchemaType = z.infer<typeof defaultResponseSchema>;

export default defaultResponseSchema;
