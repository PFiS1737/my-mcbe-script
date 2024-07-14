// @ts-check

import gulp from "gulp"

import { rollup } from "rollup"
import rollupConfig from "./rollup.config.js"

// @ts-ignore
function createTask(config) {
  const fn = async () => {
    const result = await rollup({
      input: config.input,
      plugins: config.plugins,
      onwarn({ loc, frame, message, code }) {
        if (loc) {
          console.warn(
            `${loc.file} (${loc.line}:${loc.column}) ${message} (${code})`
          )
          if (frame) console.warn("\x1b[2m%s\x1b[0m", frame)
        } // else console.warn(message)
      },
    })
    await result.write(config.output)
  }
  Object.defineProperty(fn, "name", {
    value: config.name,
  })
  return fn
}

export default gulp.series(...rollupConfig.map(createTask))
