import { client } from "@/db/pool"
import { QueryResult } from "pg"

export class UserRepository {
  async isUserExists(email: string): Promise<QueryResult> {
    const result = await client.query(
      `
            SELECT * FROM users WHERE email = $1
            `,
      [email],
    )

    return result
  }
}
