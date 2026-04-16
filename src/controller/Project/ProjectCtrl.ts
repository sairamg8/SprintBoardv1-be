import ProjectRepository from "@/services/project.service"
import {
  BNewProject,
  BulkProjectSchema,
  DeleteProjectSchema,
  NewProjectSchema,
  ProjectT,
  UpdateProjectSchema,
} from "@/types/project"
import { Request, Response } from "express"

const Project = new ProjectRepository()

export class ProjectCtrl {
  static async getAllProjects(req: Request, res: Response) {
    const userId = req.userInfo.id

    const response = await ProjectRepository.FetchAllProjects(userId)

    res.json({
      message: "Project fetched successfully",
      data: response,
    })
  }

  static async createProject(req: Request, res: Response) {
    const userId = req.userInfo.id

    const data = NewProjectSchema.parse(req)

    const response = await ProjectRepository.CreateProject(userId, data["body"])

    return res.json({
      message: "Project Created Successfully",
      data: response,
    })
  }

  static async BulkProjectCreation(req: Request, res: Response) {
    const userId = req.userInfo.id

    const data = BulkProjectSchema.parse(req)["body"]

    const response = await ProjectRepository.BulkInsert(userId, data)

    return res.json({
      message: "All the projects created",
      data: response,
    })
  }

  static async updateProject(req: Request, res: Response) {
    const userId = req.userInfo.id
    const data = UpdateProjectSchema.parse(req)

    const body = data["body"]
    const { id } = data["params"]

    const response = await ProjectRepository.UpdateProject(userId, id, body)
    return res.json({
      message: "Project updated successfully",
      data: response,
    })
  }

  static async deleteProject(req: Request, res: Response) {
    const userId = req.userInfo.id
    const { id } = DeleteProjectSchema.parse(req).params

    const response = await ProjectRepository.DeleteProject(userId, id)

    return res.json({
      message: "Project deleted successfully",
      data: response,
    })
  }
}
