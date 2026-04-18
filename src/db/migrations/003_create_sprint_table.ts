import { Migration } from "../migrator"
import { client } from "../pool"

export const up = async () => {
  await client.query(`
        CREATE TABLE IF NOT EXISTS sprints (
        id UUID PRIMARY KEY UNIQUE DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        project UUID NOT NULL,
        start_date TIMESTAMP NOT NULL DEFAULT NOW(),
        due_date TIMESTAMP NOT NULL DEFAULT NOW(),
        goal TEXT,
        owner_id UUID NOT NULL,

        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMP DEFAULT NULL,

        CONSTRAINT sprints_name_unique UNIQUE (name),


        CONSTRAINT fk_sprints_owner
        FOREIGN KEY (owner_id)
        REFERENCES users (id)
        ON DELETE RESTRICT,


        CONSTRAINT fk_sprints_project_id
        FOREIGN KEY (project)
        REFERENCES projects (id)
        ON DELETE RESTRICT
        )
        `)

  await client.query(`
          CREATE INDEX IF NOT EXISTS idx_sprints_name ON sprints (name)`)

  await client.query(`
          CREATE INDEX IF NOT EXISTS idx_sprints_owner_id ON sprints (owner_id)`)
}

export const down = async () => {
  await client.query(`DROP TABLE IF EXISTS sprints`)
}

const migration: Migration = {
  up,
  down,
}

export default migration
