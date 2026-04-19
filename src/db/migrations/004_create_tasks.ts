import { client } from "../pool"

export const up = async () => {
  await client.query(`
        CREATE TYPE task_status AS ENUM ('not_started', 'in_progress', 'completed', 'in_review', 'in_test');
        CREATE TYPE task_type AS ENUM ('task', 'bug');

        CREATE TABLE IF NOT EXISTS tasks (
        id UUID PRIMARY KEY UNIQUE DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        start_date TIMESTAMP NOT NULL DEFAULT NOW(),
        due_date TIMESTAMP NOT NULL DEFAULT NOW(),
        description TEXT,
        owner_id UUID NOT NULL,
        project_id UUID NOT NULL,
        assigned_by UUID DEFAULT NULL,
        status task_status DEFAULT 'not_started',
        type task_type DEFAULT 'task',

        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMP DEFAULT NULL,

        CONSTRAINT tasks_name_unique UNIQUE (name, project_id),

        CONSTRAINT fk_project_owner
        FOREIGN KEY(owner_id)
        REFERENCES users (id)
        ON DELETE RESTRICT,

        CONSTRAINT fk_task_assignee
        FOREIGN KEY(assigned_by)
        REFERENCES users (id)
        ON DELETE RESTRICT,

        CONSTRAINT fk_project_ref
        FOREIGN KEY (project_id)
        REFERENCES projects (id)
        ON DELETE RESTRICT
        )
        `)

  await client.query(`
            CREATE INDEX IF NOT EXISTS idx_tasks_name ON tasks (name)
            `)
}

export const down = async () => {
  await client.query(`DROP TABLE IF EXISTS tasks`)
  await client.query(`DROP TYPE IF EXISTS task_status`)
  await client.query(`DROP TYPE IF EXISTS task_type`)
}

const migration = {
  up,
  down,
}

export default migration
