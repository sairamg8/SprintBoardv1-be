import { SignUpCtrl } from "@/controller/Signup/SignupCtrl"
import { Validate } from "@/middleware/Validate"
import { UserSchema } from "@/types/User"
import e from "express"

const signup = e.Router()

signup.post("/", Validate(UserSchema), SignUpCtrl.Signup)

export default signup
