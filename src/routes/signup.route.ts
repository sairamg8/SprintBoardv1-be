import { SignUpCtrl } from "@/controller/Signup/SignupCtrl"
import e from "express"

const signup = e.Router()

signup.post("/", SignUpCtrl.Signup)

export default signup
