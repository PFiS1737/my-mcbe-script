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
            input: src.startsWith(".") ? src : `./src/${src}`,
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
    
    const output = {}
    
    
    // bundle.js
    output.bundled = _({
        src: "script/index.js",
        dest: "bundle.min.js",
        name: "bundle"
    })
    
   
    // single script
    output.scripts = []
    each(
        fs.readdirSync("./src/script", {
            withFileTypes: true
        }),
        dirent => {
            if (dirent.isDirectory()) {
                const name = dirent.name
                output.scripts.push(_({
                    src: `script/${name}/index.js`,
                    dest: `${name}.min.js`,
                    name
                }))
            }
        }
    )
    
    // libraries
    output.libraries = []
    each(
        fs.readdirSync("./src/lib", {
            withFileTypes: true
        }),
        dirent => {
            if (dirent.isDirectory()) {
                const name = dirent.name
                if (
                    name === "database" ||
                    name === "option-manager"
                ) {
                    output.libraries.push(_({
                        src: `lib/${name}/index.js`,
                        dest: `${name}.min.js`,
                        name
                    }))
                }
            }
        }
    )
    
    return output
}
