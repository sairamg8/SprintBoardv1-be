import { Migration } from "../migrator"
import { client } from "../pool"

export const up = async (): Promise<void> => {
  await client.query(`
        CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password_hash TEXT NOT NULL,
        designation VARCHAR(20) DEFAULT NULL CHECK (designation IN ('admin', 'developer', 'manager', 'tester', null)),
        reset_token TEXT DEFAULT NULL,
        reset_token_expiry TIMESTAMP DEFAULT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMP DEFAULT NULL,

        CONSTRAINT users_email_unique UNIQUE (email)
        )
        `)

  await client.query(
    `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,
  )
  await client.query(
    `CREATE INDEX IF NOT EXISTS idx_users_first_name ON users(first_name)`,
  )
  await client.query(
    `CREATE INDEX IF NOT EXISTS idx_users_last_name ON users(last_name)`,
  )
}

export const down = async () => {
  await client.query(`DROP TABLE IF EXISTS users CASCADE`)
}

const migration: Migration = { up, down }

export default migration
