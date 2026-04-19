import z from "zod"

const BaseSchema = z.object({
  name: z.string({ error: "Task name cannot be empty" }),
  start_date: z.iso.datetime({ error: "Start date cannot be empty" }),
  due_date: z.iso.datetime({ error: "Due date cannot be empty" }),
  description: z.string().optional(),
  assigned_by: z.uuidv4().nullable().optional(),
  owner_id: z.uuidv4({ error: "Task owner required" }),
  project_id: z.uuidv4({ error: "Project ID cannot be empty" }),
  type: z
    .enum(["not_started", "in_progress", "completed", "in_review", "in_test"])
    .optional(),
})

export const CreateTask = z.object({
  body: BaseSchema.extend({
    assigned_by: z.uuidv4().nullable().optional().default(null),
    type: z
      .enum(["not_started", "in_progress", "completed", "in_review", "in_test"])
      .default("not_started"),
  }),
})

export type CreateTaskT = z.infer<typeof CreateTask>

export const UpdateTask = z.object({
  body: BaseSchema.partial(),
  params: z.object({
    id: z.string({ error: "Task ID required to update" }),
  }),
})

export type UpdateTaskT = z.infer<typeof UpdateTask>

export const GetTask = z.object({
  params: z.object({
    id: z.string({ error: "Task id required" }),
  }),
})

export type GetTaskT = z.infer<typeof GetTask>["params"]
