import { AuthCtrl } from "@/controller/Authentication/AuthCtrl"
import { Validate } from "@/middleware/Validate"
import { BaseSchema, UserSchema } from "@/types/User"
import e from "express"

const auth = e.Router()

auth.post("/signup", Validate(UserSchema), AuthCtrl.Signup)
auth.post("/signin", Validate(BaseSchema), AuthCtrl.Signin)

export default auth
