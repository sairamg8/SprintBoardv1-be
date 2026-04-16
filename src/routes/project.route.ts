import { ProjectCtrl } from "@/controller/Project/ProjectCtrl"
import Authenticate from "@/middleware/Authenticate"
import { Validate } from "@/middleware/Validate"
import {
  BulkProjectSchema,
  DeleteProjectSchema,
  NewProjectSchema,
  UpdateProjectSchema,
} from "@/types/project"
import e from "express"

const project = e.Router()

project.get("/", Authenticate, ProjectCtrl.getAllProjects)
project.post(
  "/",
  Authenticate,
  Validate(NewProjectSchema),
  ProjectCtrl.createProject,
)

project.post(
  "/bulk",
  Authenticate,
  Validate(BulkProjectSchema),
  ProjectCtrl.BulkProjectCreation,
)
project.put(
  "/:id",
  Authenticate,
  Validate(UpdateProjectSchema),
  ProjectCtrl.updateProject,
)

project.delete(
  "/:id",
  Authenticate,
  Validate(DeleteProjectSchema),
  ProjectCtrl.deleteProject,
)

export default project
