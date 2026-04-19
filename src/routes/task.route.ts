import { TaskCtrl } from "@/controller/Task"
import Authenticate from "@/middleware/Authenticate"
import { Validate } from "@/middleware/Validate"
import { CreateTask, GetTask, UpdateTask } from "@/types/task"
import e from "express"

const task = e.Router()

task.get("/", Authenticate, TaskCtrl.getAllTasks)
task.get("/:id", Authenticate, Validate(GetTask), TaskCtrl.getTask)
task.post("/", Authenticate, Validate(CreateTask), TaskCtrl.createTasks)
task.put("/:id", Authenticate, Validate(UpdateTask), TaskCtrl.updateTask)
task.delete("/:id", Authenticate, Validate(GetTask), TaskCtrl.deleteTask)

export default task
