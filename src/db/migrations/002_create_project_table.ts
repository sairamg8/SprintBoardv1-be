import { Migration } from "../migrator"
import { client } from "../pool"

export const up = async () => {
  await client.query(`
        CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        key VARCHAR(20) NOT NULL,
        status VARCHAR(20) DEFAULT 'idle' CHECK ( status IN ('idle', 'active', 'hold', 'in_progress')),
        due_date TIMESTAMP DEFAULT NULL,
        description TEXT DEFAULT NULL,

        owner_id UUID NOT NULL,

        CONSTRAINT projects_name_unique UNIQUE (name),
        CONSTRAINT projects_key_unique UNIQUE (key),
        
        CONSTRAINT fk_projects_owner
        FOREIGN KEY (owner_id)
        REFERENCES users (id)
        ON DELETE RESTRICT
        )`)

  await client.query(
    `CREATE INDEX IF NOT EXISTS idx_projects_name ON projects (name)`,
  )

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_projects_key ON projects (key)`)
}

export const down = async () => {
  await client.query(`DROP TABLE IF EXISTS projects CASCADE`)
}

const migration: Migration = { up, down }

export default migration
