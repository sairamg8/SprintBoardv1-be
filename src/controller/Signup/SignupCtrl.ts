import { UserRepository } from "@/services/user.service"
import { Request, Response } from "express"

const User = new UserRepository()
export class SignUpCtrl {
  static async Signup(req: Request, res: Response) {
    const isUserExist = await User.isUserExists(req.body.email)

    return res.send(isUserExist.rowCount)
  }
}
