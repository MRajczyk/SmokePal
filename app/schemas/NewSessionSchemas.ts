import z from "zod";

export const SelectOptionsSchema = z.object({
  label: z.string(),
  value: z.string(),
});
export type SelectOptionsSchemaType = z.infer<typeof SelectOptionsSchema>;

export const SessionSelectSchema = z.object({
  id: z.number(),
  name: z.string(),
});
export type SessionSelectSchemaType = z.infer<typeof SessionSelectSchema>;

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export type fileUploadSchemaType = {
  temporaryID: string;
  file?: File;
  b64String: string;
  dbId?: number;
};
