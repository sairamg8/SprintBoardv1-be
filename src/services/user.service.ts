import { client } from "@/db/pool"
import { BSignIn, UserInfo, UserRow, UserSignIn } from "@/types/User"
import { QueryResult } from "pg"
import bcrypt from "bcrypt"
import jwt, { SignOptions } from "jsonwebtoken"
import "dotenv/config"
import { omit } from "@/utils/utils"
import { JWTPayload } from "@/types"

type extraOptions = {
  includePassword: boolean
}

export class UserRepository {
  static async hashSecret(plain: string): Promise<string> {
    return bcrypt.hash(plain, 12)
  }

  static async verifySecret(
    plain: string,
    encrypted: string,
  ): Promise<boolean> {
    return bcrypt.compare(plain, encrypted)
  }

  static async generateToken<T>(payload: Record<string, T>) {
    const secret = process.env.JWT_SECRET || "thisisalonglongsecrect"
    const options: SignOptions = {
      expiresIn: (process.env.TOKEN_EXPIRY ?? "1h") as SignOptions["expiresIn"],
    }

    return jwt.sign(payload, secret, options)
  }

  static verifyToken(token: string): JWTPayload {
    const secret = process.env.JWT_SECRET || "thisisalonglongsecrect"

    return jwt.verify(token, secret) as JWTPayload
  }

  static async generateRefreshToken<T>(payload: Record<string, T>) {
    const secret = process.env.JWT_REFRESH_SECRET || "thisisalongrefreshsecret"
    const options: SignOptions = {
      expiresIn: (process.env.REFRESH_EXPIRY ??
        "24hr") as SignOptions["expiresIn"],
    }

    return jwt.sign(payload, secret, options)
  }

  async isUserExists(
    email: string,
    options?: extraOptions,
  ): Promise<QueryResult<UserRow>> {
    const result = await client.query(
      `
      SELECT id, first_name, last_name, email, designation, created_at ${options?.includePassword ? ", password_hash" : ""}
      FROM users WHERE email = $1
      `,
      [email],
    )

    return result
  }

  async signup(data: UserInfo): Promise<UserRow> {
    const isUserExist = await this.isUserExists(data.email)

    if (isUserExist.rowCount) {
      throw new Error("User Already Existed")
    }

    const password_hash = data.password

    const query = await client.query(
      `INSERT INTO users (first_name, last_name, email, password_hash, designation)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, first_name, last_name, email, designation, created_at`,
      [
        data.first_name,
        data.last_name,
        data.email,
        password_hash,
        data.designation,
      ],
    )

    return query.rows[0]
  }

  async signin(data: BSignIn): Promise<UserSignIn> {
    const isEmailExist = (
      await this.isUserExists(data.email, { includePassword: true })
    ).rows[0]

    if (!isEmailExist) throw new Error("User Email / Password not found")

    const isPasswordMatch = await UserRepository.verifySecret(
      data.password,
      isEmailExist.password_hash,
    )

    if (!isPasswordMatch) {
      throw new Error("User Email / Password not found")
    }

    const payload = {
      id: isEmailExist?.id,
      email: isEmailExist?.email,
    }

    const token = await UserRepository.generateToken(payload)
    const refreshToken = await UserRepository.generateRefreshToken(payload)

    const resData = omit(isEmailExist, ["password_hash"])

    return {
      ...resData,
      token,
      refreshToken,
    }
  }
}
