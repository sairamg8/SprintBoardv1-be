import e from "express"
import "dotenv/config"
import { GlobalErrorHandling } from "./middleware/GlobalErrorHandling"
import auth from "./routes/auth.route"
import project from "./routes/project.route"
import registerTypeParser from "./db/typeParser"
import sprint from "./routes/sprint.route"
import task from "./routes/task.route"

registerTypeParser()

const PORT = process.env.SERVER_PORT || 3001

const server = e()
server.use(e.json())
server.use(e.urlencoded({ extended: false }))

server.use("/auth", auth)
server.use("/project", project)
server.use("/sprints", sprint)
server.use("/tasks", task)

server.use(GlobalErrorHandling)

server.listen(PORT, () => console.log(`Server running on ${PORT}`))
