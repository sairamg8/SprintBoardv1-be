import { MigrateAll } from "./migrator"
import { client } from "./pool"

const [, , command, filename] = process.argv

async function main() {
  switch (command) {
    case "all":
      console.log(command, filename)
      await MigrateAll()

      break

    default:
      console.log(`
                Usage:
                    migrate.ts all
                `)

      process.exit(1)
  }

  await client.end()
}

main().catch((err) => {
  console.log(`Migration Failed`, err)
  client.end()
  process.exit(1)
})
