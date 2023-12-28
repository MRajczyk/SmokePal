import { z } from "zod";

export const NewSmokingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  products: z.array(
    z.object({
      label: z.string().min(1, "Label is required"),
      value: z.string().min(1, "Value is required"),
    })
  ),
  woods: z.array(
    z.object({
      label: z.string().min(1, "Label is required"),
      value: z.string().min(1, "Value is required"),
    })
  ),
  description: z.string().optional(),
  tempSensor1Name: z.string().min(1, "Name is required"),
  tempSensor2Name: z.string().min(1, "Name is required"),
  tempSensor3Name: z.string().min(1, "Name is required"),
});
export type NewSmokingSchemaType = z.infer<typeof NewSmokingSchema>;
