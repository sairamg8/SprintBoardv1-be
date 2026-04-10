import { MigrateAll, rollbackAll } from "./migrator"
import { client } from "./pool"

const [, , command, filename] = process.argv

async function main() {
  switch (command) {
    case "all":
      console.log(command, filename)
      await MigrateAll()
      client.end()
      break

    case "undo":
      console.log(command, filename)
      await rollbackAll()
      client.end()
      break

    default:
      console.log(`
                Usage:
                    migrate.ts all
                `)

      process.exit(1)
  }
}

main().catch((err) => {
  console.log(`Migration Failed`, err)
  client.end()
  process.exit(1)
})
