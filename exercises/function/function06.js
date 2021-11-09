import assert from "assert"
/*
Method syntax and 'this'
*/

// I AM NOT DONE

function simpleFunc(a) {
  return this.value + a
}

// TODO: Create two objects that satisfy the assertions below
const object1 = ...;
const object2 = ...;

assert(object1.simpleFunc(5), 15)
assert(object2.simpleFunc(-5), -15)
