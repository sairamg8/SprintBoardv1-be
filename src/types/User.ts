import z from "zod"

export const designationValues = [
  "admin",
  "developer",
  "manager",
  "tester",
] as const

export const UserSchema = z.object({
  body: z.object({
    first_name: z.string({ error: "First name cannot be empty" }),
    last_name: z.string({ error: "Last name cannot be empty" }),
    email: z.email({ error: "A Valid email required" }),
    password: z.string({ error: "Password cannot be empty" }).min(6),
    designation: z.enum(designationValues).nullable(),
  }),
})

export type UserInfo = z.infer<typeof UserSchema>
