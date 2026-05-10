const { applyMovement } = require("main/systems/noClip.js")

setInterval(() => {
  applyMovement();
}, 100)