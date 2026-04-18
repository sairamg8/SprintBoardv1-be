import { client } from "@/db/pool"
import { CreateSprintT } from "@/types/sprint"

export default class SprintRepository {
  async FetchAllSprints(userId: string) {
    const query = await client.query(
      `SELECT * FROM sprints WHERE owner_id = $1`,
      [userId],
    )

    return query.rows
  }

  async CreateSprint(userId: string, data: CreateSprintT) {
    const values = Object.values(data)
    const query = await client.query(
      `INSERT INTO sprints
      (owner_id, name, project, start_date, due_date, goal)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [userId, ...values],
    )

    return query.rows
  }

  async UpdateSprint(userId: string, id: string, data: Partial<CreateSprintT>) {
    const columns = [
      "name",
      "project",
      "start_date",
      "due_date",
      "goal",
    ] as const

    const values: unknown[] = []
    const setClause: string[] = []

    for (const key of columns) {
      if (data[key] === undefined) continue

      values.push(data[key] ?? null)
      setClause.push(`${key} = $${values.length}`)
    }

    if (setClause.length === 0) {
      throw new Error("No fields to update")
    }

    const query = await client.query(
      `
    UPDATE sprints
    SET ${setClause.join(", ")}
    WHERE id = $${values.length + 1} AND owner_id = $${values.length + 2}
    RETURNING *
    `,
      [...values, id, userId],
    )

    return query.rows
  }

  async DeleteSprint(id: string, userId: string) {
    const query = await client.query(
      `
      DELETE FROM sprints
      WHERE id = $1 AND owner_id = $2
      RETURNING *
      `,
      [id, userId],
    )

    return query.rows
  }
}
