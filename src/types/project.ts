import z from "zod"

export const NewProjectSchema = z.object({
  body: z.object({
    name: z.string({ error: "Project name must be required" }),
    key: z.string({ error: "A unique Key Required, eg. TP1" }),
    status: z.enum(["idle", "active", "hold", "in_progress"]),
    due_date: z.iso.datetime({ error: "Due date required" }),
    description: z.string().optional(),
  }),
})

export type BNewProject = z.infer<typeof NewProjectSchema>["body"]

export const GetProject = z.object({
  params: z.object({
    id: z.string({ error: "Project ID Required" }),
  }),
})

export type GetProjectT = z.infer<typeof GetProject>["params"]

export const BulkProjectSchema = z.object({
  body: z.array(NewProjectSchema.shape.body),
})

export interface ProjectT {
  id: string
  name: string
  key: string
  status: string
  due_date: Date
  description: string
  owner_id: string
}

export const UpdateProjectSchema = z.object({
  body: NewProjectSchema.shape.body.partial(),
  params: z.object({
    id: z.string({ error: "Project id required" }),
  }),
})

export type UpdateProjectSchema = z.infer<typeof UpdateProjectSchema>

export const DeleteProjectSchema = z.object({
  params: z.object({
    id: z.string({ error: "Project id required" }),
  }),
})

export type DeleteProject = z.infer<typeof DeleteProjectSchema>
