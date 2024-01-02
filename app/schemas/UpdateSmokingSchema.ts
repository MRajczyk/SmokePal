import { z } from "zod";

export const UpdateSmokingSchema = z.object({
  id: z.number(),
  title: z.string().min(1, "Title is required"),
  finished: z.boolean(),
  products: z
    .array(
      z.object({
        label: z.string().min(1, "Label is required"),
        value: z.string().min(1, "Value is required"),
      })
    )
    .min(1, "At least one product is required!"),
  woods: z
    .array(
      z.object({
        label: z.string().min(1, "Label is required"),
        value: z.string().min(1, "Value is required"),
      })
    )
    .min(1, "At least one wood is required!"),
  description: z.string().optional(),
  tempSensor1Name: z.string().min(1, "Name is required"),
  tempSensor2Name: z.string().min(1, "Name is required"),
  tempSensor3Name: z.string().min(1, "Name is required"),
});
export type UpdateSmokingSchemaType = z.infer<typeof UpdateSmokingSchema>;

export const UpdateSmokingSchemaForm = z.object({
  title: z.string().min(1, "Title is required"),
  products: z
    .array(
      z.object({
        label: z.string().min(1, "Label is required"),
        value: z.string().min(1, "Value is required"),
      })
    )
    .min(1, "At least one product is required!"),
  woods: z
    .array(
      z.object({
        label: z.string().min(1, "Label is required"),
        value: z.string().min(1, "Value is required"),
      })
    )
    .min(1, "At least one wood is required!"),
  description: z.string().optional(),
  tempSensor1Name: z.string().min(1, "Name is required"),
  tempSensor2Name: z.string().min(1, "Name is required"),
  tempSensor3Name: z.string().min(1, "Name is required"),
});
export type UpdateSmokingSchemaFormType = z.infer<
  typeof UpdateSmokingSchemaForm
>;
