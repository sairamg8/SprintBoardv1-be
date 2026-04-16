import { types } from "pg"

export default function registerTypeParser() {
  types.setTypeParser(20, Number) // bigint
  types.setTypeParser(1700, parseFloat) // numeric
  types.setTypeParser(1082, (v) => new Date(v)) // date
  types.setTypeParser(1114, (v) => new Date(v)) // timestamp
  types.setTypeParser(1184, (v) => new Date(v)) // timestamptz
}
