import { client } from "@/db/pool"
import { UserInfo } from "@/types/User"
import { QueryResult } from "pg"
import bcrypt from "bcrypt"

export class UserRepository {
  static async hashSecret(plain: string): Promise<string> {
    return bcrypt.hash(plain, 12)
  }

  async isUserExists(email: string): Promise<QueryResult> {
    const result = await client.query(
      `
      SELECT * FROM users WHERE email = $1
      `,
      [email],
    )

    return result
  }

  async createUser(data: UserInfo["body"]): Promise<QueryResult> {
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

    return query
  }
}
