import { z } from "zod";
import { doctors } from "./clinic";
export const normalizeDigits = (s: string) =>
  s.replace(/[০-৯]/g, (x) => String(x.charCodeAt(0) - "০".charCodeAt(0)));
export const schema = z
  .object({
    name: z.string().trim().min(1).max(100),
    phone: z
      .string()
      .max(32)
      .transform((v) => normalizeDigits(v).replace(/[\s()-]/g, ""))
      .pipe(z.string().regex(/^(?:\+880|0)1[3-9]\d{8}$/))
      .transform((v) => (v.startsWith("+") ? v : "+88" + v)),
    age: z
      .string()
      .transform(normalizeDigits)
      .pipe(z.string().regex(/^\d{1,3}$/))
      .transform(Number)
      .pipe(z.number().min(0).max(120)),
    gender: z.enum(["male", "female", "other", "private"]),
    doctor: z
      .string()
      .refine((id) => id === "any" || doctors.some((d) => d.id === id)),
    concern: z.string().trim().min(1).max(500),
    website: z.literal(""),
    requestId: z.uuid(),
    submittedAt: z.iso.datetime(),
  })
  .strict();
