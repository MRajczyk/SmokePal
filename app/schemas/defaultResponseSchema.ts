import { z } from "zod";

export const defaultResponseSchema = z.object({
  message: z.string().optional(),
});

export type DefaultResponseSchemaType = z.infer<typeof defaultResponseSchema>;

export const defaultStatusResponseSchema = z.object({
  status: z.boolean().optional(),
  message: z.string().optional(),
});

export type DefaultStatusResponseSchemaType = z.infer<
  typeof defaultStatusResponseSchema
>;

export default defaultResponseSchema;
