import SprintRepository from "@/services/sprint.service"
import { DeleteProjectSchema, UpdateProjectSchema } from "@/types/project"
import { CreateSprint, UpdateSprint } from "@/types/sprint"
import { Request, Response } from "express"

const Sprint = new SprintRepository()

export default class SprintCtrl {
  static async GetAllProjects(req: Request, res: Response) {
    const { id } = req.userInfo

    const response = await Sprint.FetchAllSprints(id)

    return res.json({
      data: response,
    })
  }

  static async CreateProject(req: Request, res: Response) {
    const { id } = req.userInfo

    const data = CreateSprint.parse(req)
    const response = await Sprint.CreateSprint(id, data["body"])

    return res.json({
      data: response,
    })
  }

  static async UpdateProject(req: Request, res: Response) {
    const { id } = req.userInfo

    const { body, params } = UpdateSprint.parse(req)

    const response = await Sprint.UpdateSprint(id, params.id, body)

    return res.json({
      data: response,
    })
  }

  static async DeleteProject(req: Request, res: Response) {
    const { id } = req.userInfo

    const { params } = DeleteProjectSchema.parse(req)

    const response = await Sprint.DeleteSprint(params.id, id)

    return res.json({
      data: response,
    })
  }
}
