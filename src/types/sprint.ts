import z from "zod"

export const CreateSprint = z.object({
  body: z.object({
    name: z.string({ error: "Sprint name cannot be empty" }),
    project: z.string({ error: "Project name required for sprint" }),
    start_date: z.iso.datetime({ error: "Project start name required" }),
    due_date: z.iso.datetime({ error: "Project due date is required" }),
    goal: z.string().optional(),
  }),
})

export type CreateSprintT = z.infer<typeof CreateSprint>["body"]

export const UpdateSprint = z.object({
  body: CreateSprint.shape.body.partial(),
  params: z.object({
    id: z.string({ error: "Required sprint id to update" }),
  }),
})

export type UpdateSprintT = z.infer<typeof UpdateSprint>

export const DeleteSprint = z.object({
  params: z.object({
    id: z.string({ error: "Project ID required" }),
  }),
})

export type DeleteSprintT = z.infer<typeof DeleteSprint>["params"]
