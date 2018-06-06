'use strict'

const replace1 = /^[\. ]*/
const replace2 = /[\. ]$/

// ** ATTENTION this is a custom trim that leaves the original type intact **

// ". J. Dallas.".replace(/^[\. ]*/, "").replace(/[\. ]$/, "") ==> "J. Dallas"
function trim (txt) {
  if (typeof txt !== 'string') { return } // leave this as is!
  return txt.replace(replace1, "").replace(replace2, "")
}

module.exports = trim
