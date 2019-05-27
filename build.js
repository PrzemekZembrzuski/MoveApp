"use strict"

const builder = require("electron-builder")
const Platform = builder.Platform
const config = {
    "appId": "com.move.app",
    "extraFiles": [
      "./config/*.json",
      "./listitems.json"
    ]
  }


// Promise is returned
builder.build({
  targets: Platform.WINDOWS.createTarget("portable"),
  config
})
  .then(() => {
    console.log('Builded')
  })
  .catch((error) => {
    console.log(error)
  })