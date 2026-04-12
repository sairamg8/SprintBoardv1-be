import { UserRepository } from "@/services/user.service"
import { BaseSchema, UserSchema } from "@/types/User"
import { Request, Response } from "express"

const User = new UserRepository()
export class AuthCtrl {
  static async Signup(req: Request, res: Response) {
    const hashed_password = await UserRepository.hashSecret(req.body.password)

    const data = UserSchema.parse(req)
    const createUser = await User.signup({
      ...data["body"],
      password: hashed_password,
    })

    res.json({
      message: "Signup, successful",
      data: createUser,
    })
  }

  static async Signin(req: Request, res: Response) {
    const data = BaseSchema.parse(req)

    const response = await User.signin(data["body"])

    res.json({
      message: "Signin successful",
      data: response,
    })
  }
}
