import { ErrorRequestHandler, NextFunction, Request, Response } from "express"

export const GlobalErrorHandling = (
  error: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(error)
  res.status(500).json({
    message: error.toString(),
  })
  next()
}
