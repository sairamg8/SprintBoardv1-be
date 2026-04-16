import e from "express"
import "dotenv/config"
import { GlobalErrorHandling } from "./middleware/GlobalErrorHandling"
import auth from "./routes/auth.route"
import project from "./routes/project.route"
import registerTypeParser from "./db/typeParser"

registerTypeParser()

const PORT = process.env.SERVER_PORT || 3001

const server = e()
server.use(e.json())
server.use(e.urlencoded({ extended: false }))

server.use("/auth", auth)
server.use("/project", project)

server.use(GlobalErrorHandling)

server.listen(PORT, () => console.log(`Server running on ${PORT}`))
