import { UserRepository } from "@/services/user.service"
import { UserSchema } from "@/types/User"
import { Request, Response } from "express"

const User = new UserRepository()
export class SignUpCtrl {
  static async Signup(req: Request, res: Response) {
    const isUserExist = await User.isUserExists(req.body.email)

    if (isUserExist.rowCount) {
      throw new Error("User Already Existed")
    }

    const hashed_password = await UserRepository.hashSecret(req.body.password)

    const data = UserSchema.parse(req)
    const createUser = await User.createUser({
      ...data["body"],
      password: hashed_password,
    })

    res.json(createUser.rows)
  }
}
