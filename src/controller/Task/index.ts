import { TasksRepository } from "@/services/tasks.service"
import { CreateTask, GetTask, UpdateTask } from "@/types/task"
import { Request, Response } from "express"

const task = new TasksRepository()

export class TaskCtrl {
  static async getAllTasks(req: Request, res: Response) {
    const data = await task.FetchAllTasks(req.userInfo.id)

    return res.json(data)
  }

  static async getTask(req: Request, res: Response) {
    const { params } = GetTask.parse(req)
    const data = await task.GetTask(req.userInfo.id, params.id)

    return res.json(data)
  }

  static async createTasks(req: Request, res: Response) {
    const body = CreateTask.parse(req)["body"]

    const response = await task.CreateTask(req.userInfo.id, body)
    return res.json({
      data: response,
    })
  }

  static async updateTask(req: Request, res: Response) {
    const { body, params } = UpdateTask.parse(req)

    const response = await task.UpdateTask(req.userInfo.id, params.id, body)

    return res.json({ data: response })
  }

  static async deleteTask(req: Request, res: Response) {
    const { params } = GetTask.parse(req)

    const data = await task.DeleteTask(req.userInfo.id, params.id)

    return res.json({
      message: `${data[0]} deleted successfully`,
    })
  }
}
