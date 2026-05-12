const { Vector2 } = require("main/defs/Vector2.js");
const { sendNotification } = require("main/systems/browser.js");

const defaultNoClipSpeed = 2.5;
const lerpDefinition = 30;

const wayLookupTable = {
  0x20: 'up',
  0xA2: 'down',
  0x5A: 'forward',
  0x51: 'left',
  0x53: 'back',
  0x44: 'right',
}

exports.toggleNoClip = function toggleNoClip() {
  const player = mp.players.local;

  if (!player.data) player.data = {};
  if (player.data.noClip != undefined) player.data.noClip = !player.data.noClip;
  else player.data.noClip = true; 

  mp.events.callRemote('noclip:toggle', player.data.noClip);

  if (player.data.noClip) {
    player.data.noClipSpeed = defaultNoClipSpeed;
    if (!player.vehicle) player.freezePosition(true);
    else player.vehicle.setCollision(false, false);
    mp.game.weapon.setPedCurrentVisible(player.handle, false, false, false, false);
    player.setCanSwitchWeapon(false);
    player.data.noClipPrevCam = mp.game.cam.getFollowPedViewMode();
    mp.game.cam.setFollowPedCamViewMode(0);
  } else {
    if (!player.vehicle) player.freezePosition(false);
    else player.vehicle.setCollision(true, true);
    mp.game.weapon.setPedCurrentVisible(player.handle, true, false, false, false);
    player.setCanSwitchWeapon(true);
    mp.game.cam.setFollowPedCamViewMode(player.data.noClipPrevCam || 1);

    const groundDistance = player.getHeightAboveGround();
    if (groundDistance <= 30) placeOnGround(groundDistance);
  }
}

exports.registerInput = function registerInput(key, way) {
  const player = mp.players.local;

  if (key === 0xA0) return player.data.noClipQuick = way;

  if (!player.data.noClipKeys) player.data.noClipKeys = {};
  player.data.noClipKeys[wayLookupTable[key]] = way;
}

exports.applyMovement = async function applyMovement() {
  const player = mp.players.local;
  if (!player.data?.noClip) return;
  if (!player.data.noClipKeys) return;

  const camRot = mp.game.cam.getGameplayCamRot(0);
  const entity = player.vehicle || player;
  const movementSpeed = player.data.noClipQuick ? player.data.noClipSpeed*2 : player.data.noClipSpeed;

  for (let key in player.data.noClipKeys) {
    if (!player.data.noClipKeys[key]) continue;
    switch (key) {
      case 'up': 
        await lerpPosition(entity, 'z', +movementSpeed, 100, lerpDefinition);
        break;
      case 'down':
        await lerpPosition(entity, 'z', -movementSpeed, 100, lerpDefinition);
        break;
      case 'forward':
        moveWithRotation(entity, new Vector2(0, movementSpeed), camRot.z);
        break;
      case 'back':
        moveWithRotation(entity, new Vector2(0, -movementSpeed), camRot.z);
        break;
      case 'left':
        moveWithRotation(entity, new Vector2(-movementSpeed, 0), camRot.z);
        break;
      case 'right':
        moveWithRotation(entity, new Vector2(movementSpeed, 0), camRot.z);
        break;
    }
  }
}

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
 * @param {mp.entity} entity The entity to movement
 * @param {Vector2} baseVector The base movement Vector2
 * @param {number} heading In degrees, the rotation around the Z axis
 */
function moveWithRotation(entity, baseVector, heading) {
  const newDisplacementVector = baseVector.rotate(-heading);
  lerpPosition(entity, 'x', newDisplacementVector.x, 100, lerpDefinition);
  lerpPosition(entity, 'y', newDisplacementVector.y, 100, lerpDefinition);
}

/**
 * Move the player on an axis for specified amount. Render it smooth by lerping the movement over time
 * @param {mp.entity} entity The entity to move
 * @param {('x' | 'y' | 'z')} axis The axis regarding the movement
 * @param {number} totalMovement The total amount of movement to be done
 * @param {number} time In ms, the time to perform the lerp on
 * @param {number} steps How many submovements should be done
 */
async function lerpPosition(entity, axis, totalMovement, time, steps) {
  for (let i = 0; i < steps; i++) {
    const localMovement = totalMovement/steps;
    const newVector = mutateVector(entity.position, axis, localMovement);
    entity.setCoordsNoOffset(newVector.x, newVector.y, newVector.z, false, false, false);
    await wait(time/steps);
  } 
}

/**
 * Teleport the player on the ground based on the distance given
 * @param {number} zOffset The distance to the ground
 */
function placeOnGround(zOffset) {
  const entity = mp.players.local.vehicle || mp.players.local;
  const newVector = mutateVector(entity.position, 'z', -(zOffset-1));
  entity.setCoordsNoOffset(newVector.x, newVector.y, newVector.z, false, false, false);
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