import parseArgs from "minimist"
import { fullVersion } from "./version.js"

export class ScriptlingsTool {
  constructor({ log, toolName }) {
    this.log = log
    this.toolName = toolName ?? "scriptlings"
  }

  async run(argv) {
    const options = {
      string: [],
      boolean: ["help", "version"],
      alias: {},
      default: {},
    }
    let args = parseArgs(argv, options)

    this.debug = args.debug

    if (args.version) {
      this.log.info(fullVersion)
      return 0
    }

    let command = "help"

    if (args._.length > 0) {
      command = args._[0].toLowerCase()
      args._.shift()
    }

    switch (command) {
      case "list":
        if (args.help) {
          this.log.info(`Usage: ${this.toolName} list

List all exercises and their status.
`)
          return 0
        }
        await this.list()
        break

      case "watch":
        if (args.help) {
          this.log.info(`Usage: ${this.toolName} watch

Run the next unfinished exercise and watch for changes.
`)
          return 0
        }
        await this.watch()
        break

      case "help":
      default:
        // NOTE: This banner was generated with https://github.com/patorjk/figlet-cli
        this.log.info(`Welcome to...
                _       _   _ _
  ___  ___ _ __(_)_ __ | |_| (_)_ __   __ _ ___
/ __|/ __| '__| | '_ \\| __| | | '_ \\ / _\` / __|
\\__ \\ (__| |  | | |_) | |_| | | | | | (_| \\__ \\
|___/\\___|_|  |_| .__/ \\__|_|_|_| |_|\\__, |___/
                |_|                  |___/

Thanks for installing Scriptlings! This package can teach you all about ECMAScript,
which is better known as JavaScript.

1. The central concept behind Scriptlings is that you solve exercises. These
    exercises usually have some sort of syntax error in them, which will cause
    them to fail compilation or testing. Sometimes there's a logic error instead
    of a syntax error. No matter what error, it's your job to find it and fix it!
    You'll know when you fixed it because then, the exercise will compile and
    Scriptlings will be able to move on to the next exercise.
2. If you run Scriptlings in watch mode, which is recommended, it will automatically
    start with the first incompleted exercise. Don't get confused by an error message
    popping up as soon as you run Scriptlings! This is part of the exercise that you're
    supposed to solve, so open the exercise file in an editor and start your
    detective work!
3. If you're stuck on an exercise, there is a helpful hint you can view by typing
    'hint' (in watch mode), or running 'scriptlings hint myexercise'.

Got all that? Great! To get started, run 'npm start' or 'scriptlings watch' in order
to get the first incomplete exercise. Make sure to have your editor open!

Command Line:

${this.toolName} [<options>] <file>

Options:

--help                      Displays help
--version                   Displays version

`)
        return 0
    }

    return 0
  }
}
