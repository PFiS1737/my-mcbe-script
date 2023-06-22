// This file is to resolve the `crypto.randomBytes` module used by `serialize-javascript`.

import getRandomValues from "polyfill-crypto.getrandomvalues"

export function randomBytes(size) {
    return getRandomValues(new Uint8Array(size))
}

export default randomBytes
