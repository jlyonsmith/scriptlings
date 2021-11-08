import parseArgs from "minimist"
import { fullVersion } from "./version.js"
import JSON5 from "json5"
import fs from "fs"
import childProcess from "child_process"
import process from "process"
import * as readline from "node:readline/promises"
import path from "path"
import chokidar from "chokidar"

// Missing "I AM NOT DONE" is indication of being done (?!)
const reIAmNotDone = new RegExp(/^[ \t]*\/\/ *I +AM +NOT +DONE/, "gm")

export class ScriptlingsTool {
  constructor({ log, toolName }) {
    this.log = log
    this.toolName = toolName ?? "scriptlings"
    this.exercises = null
  }

  getExercises() {
    if (!this.exercises) {
      this.exercises = JSON5.parse(
        fs.readFileSync("exercises.json5", { encoding: "utf8" })
      )

      for (const exercise of this.exercises) {
        exercise.isDone = () => {
          reIAmNotDone.lastIndex = 0
          return !reIAmNotDone.test(
            fs.readFileSync(exercise.path, { encoding: "utf8" })
          )
        }
      }
    }

    return this.exercises
  }

  async list() {
    this.log.info(
      `${"Name".padEnd(17)}${"Path".padEnd(46)}${"Status".padEnd(7)}`
    )

    for (const exercise of this.getExercises()) {
      this.log.info(
        `${exercise.name.padEnd(17)}${exercise.path.padEnd(
          46
        )}${(exercise.isDone() ? "Done" : "Not Done").padEnd(7)}`
      )
    }
  }

  async watch() {
    const rli = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    let ac = new AbortController()
    const exercises = this.getExercises()
    let iterator = exercises[Symbol.iterator]()
    let result = iterator.next()
    let watcher = null

    while (!result.done) {
      const exercise = result.value

      if (exercise.isDone()) {
        result = iterator.next()
        continue
      }

      if (this.debug) {
        console.log(exercise)
      }

      if (!watcher) {
        watcher = chokidar
          .watch(exercise.path, {
            disableGlobbing: true,
            cwd: process.cwd(),
          })
          .on("change", (path) => {
            console.log(path)
            ac.abort()
          })
      } else {
        watcher.add(exercise.path)
      }

      console.clear()

      const child = childProcess.spawnSync(
        "node",
        [path.basename(exercise.path)],
        {
          cwd: path.dirname(exercise.path),
          stdio: ["inherit", "ignore", "inherit"],
        }
      )

      if (child.status === 0) {
        console.log(
          "Success! Remove the line containing I A NOT DONE to continue."
        )
      }

      while (true) {
        let answer = ""
        let abort = false

        try {
          answer = await rli.question("Type 'hint', 'skip' or 'quit'\n", {
            signal: ac.signal,
          })
        } catch {
          abort = true
          ac = new AbortController()
        }

        if (answer === "quit") {
          return
        } else if (abort || answer === "skip") {
          await watcher.unwatch(exercise.path)
          break
        } else if (answer === "hint") {
          console.log(exercise.hint)
        }
      }
    }

    console.log("That's All!")
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

Got all that? Great! To get started, run 'npm start -- watch' or 'scriptlings watch'
in order to get the first incomplete exercise. Make sure to have your editor open!

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
