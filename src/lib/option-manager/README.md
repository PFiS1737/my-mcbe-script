# option-manager

快捷的选项管理模块

## Usage

### Initialize

```javascript
// option.js
import { optionManager } from "./index.js"

export const myOption = optionManager
    .registerNamesapace("my-option")
    .addItem({
        name: "option1",
        description: "some description about this option",
        values: [
            [ true, "Yes" ],
            [ false, "No" ],
            // [ "value3", "description..." ]
            // other value ...
        ],
        defaultValue: true,
        events: {
            changed: (selected, original, player) => {
                // emited when `changed` and `inited`
                console.warn("option1 -> from", original, "to", selected)
                // other action ...
            },
            selected: (selected, original, player) => {
                // emited after selected other value
                player.sendMessage("option selected ...")
            },
            inited: (selected, player) => {
                // emited after inited (construct)
            }
        }
    })
    .addItem({
        // other options ...
    })

// index.js
import { world } from "@minecraft/server"
import { myOption } from "./option.js"

myOption.applyMainPlayer()        // apply to the first player jioned the world
    .then(() => {                 // after other players jioned, run "/reload" to apply to them
        for (const player of world.getAllPlayers()) {
            myOption.applyPlayer(player)
        }
    })
    .then(() => myOption.init())  // init the manager
    .then(optMap => {
        // optMap {
        //     <player id>: {
        //         option1: true,
        //         // other ...
        //     },
        //     // other
        // }
    })
    .catch(console.error)
```

### Management

```javascript
async player => {
    const playerOpt = myOption.getPlayer(player)
    
    // set
    playerOpt.setItemVal("option1", false)
    await myOption.done()
    
    // get
    playerOpt.getItemVal("option1")
    
    // show dialog
    await playerOpt.showDialog()
    
    // global dialog
    await optionManager.showDialog(player)
}
```
