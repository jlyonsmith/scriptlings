import assert from "assert"
/*
Different method invocation syntax
*/

// I AM NOT DONE

const object = {
  value: 1,
  method1: function () {
    return this.value
  },
}

// TODO: Use the dot method syntax
const a = ...;

// TODO: Use the property access syntax
const b = ...;

assert.equal(a, b)