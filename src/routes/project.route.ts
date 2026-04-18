import { ProjectCtrl } from "@/controller/Project/ProjectCtrl"
import Authenticate from "@/middleware/Authenticate"
import { Validate } from "@/middleware/Validate"
import {
  BulkProjectSchema,
  DeleteProjectSchema,
  GetProject,
  NewProjectSchema,
  UpdateProjectSchema,
} from "@/types/project"
import e from "express"

const project = e.Router()

project.get("/:id", Authenticate, Validate(GetProject), ProjectCtrl.getProject)
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
