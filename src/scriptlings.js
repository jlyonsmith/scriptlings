#!/usr/bin/env node
import chalk from "chalk"
import { ScriptlingsTool } from "./ScriptlingsTool.js"
import path from "path"

const log = {
  info: console.error,
  error: function () {
    console.error(chalk.red("error:", [...arguments].join(" ")))
  },
  warning: function () {
    console.error(chalk.yellow("warning:", [...arguments].join(" ")))
  },
}

const tool = new ScriptlingsTool({
  toolName: path.basename(process.argv[1], ".js"),
  log,
})
tool
  .run(process.argv.slice(2))
  .then((exitCode) => {
    process.exit(exitCode)
  })
  .catch((err) => {
    console.error(err)
  })
