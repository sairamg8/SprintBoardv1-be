import { client } from "@/db/pool"
import { CreateTaskT, UpdateTaskT } from "@/types/task"

const columns = [
  "name",
  "start_date",
  "due_date",
  "description",
  "project_id",
  "assigned_by",
  "type",
  "owner_id",
]

export class TasksRepository {
  async FetchAllTasks(userId: string) {
    const query = await client.query(
      `SELECT * FROM tasks WHERE owner_id = $1`,
      [userId],
    )
    return query.rows
  }

  async CreateTask(userId: string, data: CreateTaskT["body"]) {
    const payload = { ...data, owner_id: userId }

    // const setClause = []

    const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ")
    const values = columns.map((col) => {
      // setClause.push(
      //   `${col} => ${payload[col as keyof typeof payload] ?? null}`,
      // )
      return payload[col as keyof typeof payload] ?? null
    })

    const query = client.query(
      `
      INSERT INTO tasks
        (${columns.join(", ")})
      VALUES
        (${placeholders})
      RETURNING id, name, start_date, due_date, description, project_id, type, assigned_by, owner_id;
      `,
      values,
    )

    return (await query).rows
  }

  async GetTask(userId: string, taskId: string) {
    const query = await client.query(
      `
        SELECT id, name, start_date, due_date, description, project_id, type, assigned_by, owner_id FROM tasks WHERE id = $1 AND owner_id = $2
      `,
      [taskId, userId],
    )

    return query.rows
  }

  async UpdateTask(
    userId: string,
    taskId: string,
    data: Partial<UpdateTaskT["body"]>,
  ) {
    const setClause = []
    const values = []

    for (const col of columns) {
      const key = col as keyof typeof data
      if (!(key in data)) continue

      values.push(data[key])
      setClause.push(`${col} =  $${values.length}`)
    }

    if (setClause.length === 0) {
      throw new Error("No valid fields provided for update")
    }

    const query = await client.query(
      `
      UPDATE tasks SET 
      ${setClause.join(", ")}
      WHERE id = $${values.length + 1} and owner_id = $${values.length + 2}
      RETURNING id, name, start_date, due_date, description, project_id, type, assigned_by, owner_id
      `,
      [...values, taskId, userId],
    )

    return query.rows
  }

  async DeleteTask(userId: string, taskId: string) {
    const isTaskExist = await this.GetTask(userId, taskId)

    if (isTaskExist.length == 0) {
      throw new Error("No Task Associated with " + taskId)
    }

    const query = await client.query(
      `DELETE FROM tasks WHERE id = $1 AND owner_id = $2
      RETURNING name
      `,
      [taskId, userId],
    )

    return query.rows
  }
}
