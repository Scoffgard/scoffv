const Vector2 = require("../defs/Vector2.js");

const lerpDefinition = 30;

// Actions on noclip toggle to be done server-side
mp.events.add('noclip:toggle', (player, state) => {
  if (state) {
    player.alpha = 0;
  } else {
    player.alpha = 255;
  }
});

// The application of the movement due to no clip
mp.events.add('noclip:movement', async (player, way, movementSpeed, heading) => {
  switch (way) {
    case 'up': 
      await lerpPosition(player, 'z', +movementSpeed, 100, lerpDefinition);
      break;
    case 'down':
      await lerpPosition(player, 'z', -movementSpeed, 100, lerpDefinition);
      break;
    case 'forward':
      moveWithRotation(player, new Vector2(0, movementSpeed), heading);
      break;
    case 'back':
      moveWithRotation(player, new Vector2(0, -movementSpeed), heading);
      break;
    case 'left':
      moveWithRotation(player, new Vector2(-movementSpeed, 0), heading);
      break;
    case 'right':
      moveWithRotation(player, new Vector2(movementSpeed, 0), heading);
      break;
  }
});

// Event to be called with the distance to ground of the player
mp.events.add('noclip:placeOnGround', (player, zOffset) => {
  player.position = mutateVector(player.position, 'z', -(zOffset-1));
});

/**
 * Modify a Vector3 by adding or substracting a number to one of the axis
 * @param {mp.Vector3} baseVector The vector to mutateVector
 * @param {('x' | 'y' | 'z')} axis The axis to apply mutation on
 * @param {number} addition The addition (or substraction) to be made to the selected axis
 * @returns {mp.Vector3} The modified Vector3
 */
function mutateVector(baseVector, axis, addition) {
  return new mp.Vector3(
    axis === 'x' ? baseVector.x+addition : baseVector.x,
    axis === 'y' ? baseVector.y+addition : baseVector.y,
    axis === 'z' ? baseVector.z+addition : baseVector.z
  )
}

/**
 * Move a player based on a Vector2 modified by the heading (rotation on Z axis)
 * @param {mp.player} player The player to movement
 * @param {Vector2} baseVector The base movement Vector2
 * @param {number} heading In degrees, the rotation around the Z axis
 */
function moveWithRotation(player, baseVector, heading) {
  const newDisplacementVector = baseVector.rotate(-heading);
  lerpPosition(player, 'x', newDisplacementVector.x, 100, lerpDefinition);
  lerpPosition(player, 'y', newDisplacementVector.y, 100, lerpDefinition);
}

/**
 * Move the player on an axis for specified amount. Render it smooth by lerping the movement over time
 * @param {mp.player} player The player to move
 * @param {('x' | 'y' | 'z')} axis The axis regarding the movement
 * @param {number} totalMovement The total amount of movement to be done
 * @param {number} time In ms, the time to perform the lerp on
 * @param {number} steps How many submovements should be done
 */
async function lerpPosition(player, axis, totalMovement, time, steps) {
  for (let i = 0; i < steps; i++) {
    const localMovement = totalMovement/steps;
    player.position = mutateVector(player.position, axis, localMovement);
    await wait(time/steps);
  } 
}

/**
 * While awaiting this function, the thread will be halted for selected ms
 * @param {number} ms The number of ms to wait for
 * @returns {void}
 */
function wait(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), ms);
  });
}