import e from "express"
import "dotenv/config"
import { GlobalErrorHandling } from "./middleware/GlobalErrorHandling"
import signup from "./routes/signup.route"

const PORT = process.env.SERVER_PORT || 3001

const server = e()
server.use(e.json())
server.use(e.urlencoded({ extended: false }))

server.use("/signup", signup)
server.use(GlobalErrorHandling)

server.listen(PORT, () => console.log(`Server running on ${PORT}`))
