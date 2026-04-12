import z from "zod"

export const designationValues = [
  "admin",
  "developer",
  "manager",
  "tester",
] as const

export const BaseSchema = z.object({
  body: z.object({
    email: z.email({ error: "A valid email required" }),
    password: z
      .string({ error: "Password cannot be empty" })
      .min(6, { error: "Password length must be 6 characters" }),
  }),
})

export const UserSchema = z.object({
  body: z.object({
    first_name: z.string({ error: "First name cannot be empty" }),
    last_name: z.string({ error: "Last name cannot be empty" }),
    email: z.email({ error: "A Valid email required" }),
    password: z
      .string({ error: "Password cannot be empty" })
      .min(6, { error: "Password length must be 6 characters" }),
    designation: z.enum(designationValues).nullable(),
  }),
})

export type UserInfo = z.infer<typeof UserSchema>["body"]
export type BSignIn = z.infer<typeof BaseSchema>["body"]

export interface UserRow {
  id: number
  first_name: string
  last_name: string
  email: string
  password_hash: string
  designation: string
  created_at: Date
}

export interface UserSignIn extends UserRow {
  token: string
  refreshToken: string
}
