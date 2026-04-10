import { NextFunction, Request, Response } from "express"
import z, { ZodType } from "zod"

export const Validate = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    })

    if (!result.success) {
      const pretty = z.prettifyError(result.error)
      return res.status(400).json({ errors: pretty })
    }

    next()
  }
}
