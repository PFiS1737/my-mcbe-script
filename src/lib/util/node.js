import nodePath from "node:path"
import { fileURLToPath } from "node:url"

export function isProduction() {
  return process.env.NODE_ENV === "production"
}

export function getFilename(importMeta) {
  return fileURLToPath(importMeta.url)
}

export function getDirname(importMeta) {
  return nodePath.dirname(getFilename(importMeta))
}

export function resolvePath(path, importMeta) {
  return nodePath.resolve(getDirname(importMeta), path)
}

export function getPathAlias({ baseUrl, paths }, importMeta) {
  return Object.entries(paths).map(([origin, [replacement]]) => {
    return {
      find: new RegExp(
        `^(${origin
          .replaceAll("/", "\\/")
          .replace(/\/\*$/, "/")})(.+)(?<!\\.ts)$`
      ),
      replacement: `${nodePath.resolve(
        resolvePath(baseUrl, importMeta),
        replacement.replace(/\/\*$/, "")
      )}/$2.ts`,
    }
  })
}
