import { client } from "@/db/pool"
import { BNewProject, ProjectT } from "@/types/project"

class ProjectRepository {
  static async FetchAllProjects(userId: string) {
    const data = await client.query(
      `SELECT * FROM projects WHERE owner_id = $1`,
      [userId],
    )

    return data.rows
  }

  static async CreateProject(userId: string, data: BNewProject) {
    const keys = Object.keys(data)
    const values = Object.values(data)
    const placeholder = keys.map((_, i) => `$${i + 2}`).join(", ")

    const query = await client.query(
      `
      INSERT INTO projects (owner_id, ${keys.join(", ")})
      VALUES ($1, ${placeholder})
      RETURNING owner_id, ${keys.join(", ")}
      `,
      [userId, ...values],
    )

    return query.rows
  }

  static async UpdateProject(
    userId: string,
    projectId: string,
    data: Partial<BNewProject>,
  ) {
    const entries = Object.entries(data).filter(([_, val]) => val !== undefined)

    if (entries.length === 0) {
      throw new Error("Nothing to update")
    }

    const setClause = entries.map(([key], i) => `${key} = $${i + 1}`).join(", ")
    const values = entries.map(([_, value]) => value)

    console.log(setClause.length)

    const query = await client.query(
      `
    UPDATE projects
    SET ${setClause}
    WHERE id = $${entries.length + 1} AND owner_id = $${entries.length + 2}
    RETURNING *
    `,
      [...values, projectId, userId],
    )

    return query.rows
  }

  static async DeleteProject(
    userId: string,
    projectId: string,
  ): Promise<ProjectT[]> {
    const query = await client.query(
      `
      DELETE FROM projects
      WHERE id = $1 AND owner_id = $2
      RETURNING *
      `,
      [projectId, userId],
    )

    return query.rows
  }

  static async BulkInsert(userId: string, data: BNewProject[]) {
    const values: unknown[] = []
    const rows: string[] = []

    const columns = [
      "name",
      "key",
      "status",
      "due_date",
      "description",
    ] as const

    for (const project of data) {
      const placeholder = []

      values.push(userId)
      placeholder.push(`$${values.length}`)

      for (const col of columns) {
        values.push(
          col === "status" ? (project[col] ?? "idle") : (project[col] ?? null),
        )
        placeholder.push(`$${values.length}`)
      }

      rows.push(`(${placeholder.join(", ")})`)
    }

    const query = await client.query(
      `
    INSERT INTO projects
    (owner_id, ${columns.join(", ")})
    VALUES ${rows.join(", ")}
    RETURNING *
    `,
      values,
    )

    return query.rows
  }
}

export default ProjectRepository
