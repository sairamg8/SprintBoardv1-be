import { client } from "./pool"
import path, { dirname } from "node:path"
import fs from "fs"
import { fileURLToPath } from "node:url"
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export interface Migration {
  up: () => Promise<void>
  down: () => Promise<void>
}

/** Utility functions for migration */
async function ensureMigrationsTable() {
  return await client.query(`
        CREATE TABLE IF NOT EXISTS migrations(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            runs_at TIMESTAMP DEFAULT NOW()
        )
        `)
}

async function getAppliedMigrations() {
  const result = await client.query(`
        SELECT name from migrations ORDER BY name
        `)

  return new Set(result.rows.map((r) => r.name))
}

async function getMigrationFiles() {
  const dir = path.join(__dirname, "migrations")

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".ts"))
    .sort()
}

async function loadMigrationFile(filename: string): Promise<Migration> {
  const filepath = path.join(__dirname, "migrations", filename)
  return await import(filepath)
}

async function markApplied(name: string) {
  await client.query("INSERT INTO migrations (name) VALUES ($1)", [name])
}

async function markReverted(file: string) {
  await client.query(`DELETE FROM migrations WHERE (name) = $1`, [file])
}

/** Utility functions for migration end */

export async function MigrateAll() {
  await ensureMigrationsTable()
  const applied = await getAppliedMigrations()
  const files = await getMigrationFiles()

  const pending = files.filter((f) => !applied.has(f))

  if (pending.length === 0) {
    console.log(`Migrations are upto date`)
    return
  }

  for (const file of pending) {
    console.log(`Running migration ${file}`)

    const migration = await loadMigrationFile(file)
    await migration.up()
    await markApplied(file)

    console.log(`Applied ${file}`)
  }

  console.log(`\n ${pending.length} migrations applied`)
}

export async function rollbackAll() {
  await ensureMigrationsTable()
  const applied = await getAppliedMigrations()

  const toRollback = [...applied].sort().reverse()

  if (toRollback.length === 0) {
    console.log(`Nothing to rollback, No migrations have applied.`)
    return
  }

  for (const file of toRollback) {
    console.log(`Rolling back ${file}`)
    const migration = await loadMigrationFile(file)
    await migration.down()
    await markReverted(file)
  }
}

export async function rollbackSingle(filename: string) {
  await ensureMigrationsTable()

  const applied = await getAppliedMigrations()

  if (!applied.has(filename)) console.log(`Nothing to rollback: ${filename}`)

  const migration = await loadMigrationFile(filename)
  await migration.down()
  await markReverted(filename)
  console.log(`Reverted: ${filename}`)
}
