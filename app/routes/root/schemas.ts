import { z } from "zod";

export const queryParamsSchema = z.object({
  desiredPension: z.string().catch("1"),
  personalContribution: z.string().catch("2"),
  employerContribution: z.string().catch("3"),
  retirementAge: z.string().catch("4"),
});
export type QueryParamsSchema = z.infer<typeof queryParamsSchema>;

export const formFieldSchema = z.object({
  desiredPension: z.string().min(1).pipe(z.coerce.number().int().nonnegative()),
  personalContribution: z.string().min(1).pipe(z.coerce.number().int().nonnegative()),
  employerContribution: z.string().min(1).pipe(z.coerce.number().int().nonnegative()),
  retirementAge: z.string().min(1).pipe(z.coerce.number().int().positive()),
});