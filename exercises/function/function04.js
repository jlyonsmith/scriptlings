import assert from "assert"

/*
Conditional invocation
*/

// I AM NOT DONE

function crazy(n) {
  return Math.random() > 0.5 ? () => 42 : null
}

const maybeFunc = crazy()

// TODO: Can you invoke maybeFunc in such a way that if it's null
// the call will not throw an exception?

maybeFunc
