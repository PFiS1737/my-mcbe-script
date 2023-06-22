import fs from "node:fs"
import { resolvePath } from "./src/lib/util/node.js"
import { each } from "./src/lib/util/index.js"

import commonjs from "@rollup/plugin-commonjs"
import alias from "@rollup/plugin-alias"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import terser from "@rollup/plugin-terser"

export default function(banner, pkg) {
    function _({ src, dest, name: _name }) {
        const name = `${pkg.name}${ _name ? `-${_name}` : "" }.js`
        return {
            name, 
            input: src.startsWith(".") ? src : `./src/script/${src}`,
            output: {
                file: dest.startsWith(".") ? dest : `./dist/${dest}`,
                strict: true,
                sourcemap: true,
                format: "es",
                banner: banner(name)
            },
            plugins: [
                alias({
                    entries: [
                        {
                            find: /^\@\/src\//,
                            replacement: resolvePath("./src", import.meta) + "/"
                        },
                        {
                            find: /^\@\/lib\//,
                            replacement: resolvePath("./src/lib", import.meta) + "/"
                        },
                        {
                            find: /^\@\/util\//,
                            replacement: resolvePath("./src/lib/util", import.meta) + "/"
                        },
                        {
                            find: /^serialize-javascript$/,
                            replacement: resolvePath("./src/lib/serialize-javascript/index.js", import.meta)
                        }
                    ]
                }),
                commonjs(),
                nodeResolve({
                    preferBuiltins: false
                }),
                // terser({
                //     maxWorkers: 4
                // })
            ]
        }
    }
    
    const output = [
        // bundle.js
        _({
            src: "index.js",
            dest: "bundle.min.js",
            name: "bundle"
        })
    ]
    
    // single script
    const result = fs.readdirSync("./src/script", {
        withFileTypes: true
    })
    each(result, dirent => {
        if (dirent.isDirectory()) {
            output.push(_({
                src: `${dirent.name}/index.js`,
                dest: `${dirent.name}.min.js`,
                name: dirent.name
            }))
        }
    })
    
    return output
}
