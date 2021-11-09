import assert from "assert"
/*
Destructuring function arguments.
*/

// I AM NOT DONE

// TODO: Complete this function using function argument destructuring
function vectorAdd(_) {
  return [x1 + x2, y1 + y2]
}

// TODO: Complete this more complex example

function vectorMultiply({ _, _, _, _ }, scalar) {
  return { x: x * scalar, y: y * scalar, z: z * scalar, ...props }
}

assert.deepEqual(vectorAdd([1, 2], [3, 4]), [4, 6])
assert.deepEqual(vectorMultiply({ x: 1, y: 2, w: -1 }, 2), {
  x: 2,
  y: 4,
  z: 0,
  w: -1,
})
