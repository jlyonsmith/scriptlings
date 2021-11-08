import assert from "assert"

/*
A literal is a data value that appears directly in a program.
Fix the following code so it works.
 */

// I AM NOT DONE

// TODO: Declare a number that is an integer
const n1 = _

// TODO: Declare a number that is NOT an integer
const n2 = _

// TODO: Declare a number that is NOT a number!
const n3 = _

// TODO: Declare a boolean
const b = _

// TODO: Declare a null value
const x = _

// TODO: Declare a string
const s = _

// TODO: Make this variable be undefined!
const u = 1

assert(typeof n1 === "number")
assert(Number.isInteger(n1))
assert(typeof n2 === "number")
assert(!Number.isInteger(n2))
assert(typeof n3 === "number")
assert(Number.isNaN(n3))
assert(typeof b === "boolean")
assert(typeof x === "object")
assert(x === null)
assert(typeof s === "string")
assert(typeof u === "undefined")
