import { UserRepository } from "@/services/user.service"
import { JWTPayload } from "@/types"
import { NextFunction, Request, Response } from "express"

declare global {
  namespace Express {
    interface Request {
      userInfo: JWTPayload
    }
  }
}

const Authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { authorization } = req.headers

  if (!authorization || !authorization.startsWith("Bearer")) {
    throw new Error("You do not have permission!")
  }

  const token = authorization.split(" ")[1]

  const isVerified = UserRepository.verifyToken(token)

  req.userInfo = { ...isVerified }

  next()
}

export default Authenticate
