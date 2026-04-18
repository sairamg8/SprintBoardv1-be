import SprintCtrl from "@/controller/Sprint"
import Authenticate from "@/middleware/Authenticate"
import { Validate } from "@/middleware/Validate"
import { DeleteProjectSchema } from "@/types/project"
import { CreateSprint, UpdateSprint } from "@/types/sprint"
import e from "express"

const sprint = e.Router()

sprint.get("/", Authenticate, SprintCtrl.GetAllProjects)
sprint.post("/", Authenticate, Validate(CreateSprint), SprintCtrl.CreateProject)
sprint.put(
  "/:id",
  Authenticate,
  Validate(UpdateSprint),
  SprintCtrl.UpdateProject,
)

sprint.delete(
  "/:id",
  Authenticate,
  Validate(DeleteProjectSchema),
  SprintCtrl.DeleteProject,
)

export default sprint
