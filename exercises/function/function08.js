import assert from "assert"
/*
'this' is not scoped like other variables and nested functions do not
inherit 'this'!
*/

// I AM NOT DONE

const obj = {
  v: 7,
  m: function () {
    // TODO: This code is broken; fix it!

    function nestedFunc() {
      return this.v * 11
    }

    return nestedFunc()
  },
}

assert(obj.m(), 77)
