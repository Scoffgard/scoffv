const { sendNotification } = require("main/systems/browser.js");

const defaultNoClipSpeed = 2.5;

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
  
  if (player.vehicle && !player.vehicle.isStopped()) return sendNotification('You cannot use NoClip while you\'re moving', 'red', 3);

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
    if (groundDistance <= 30) mp.events.callRemote('noclip:placeOnGround', groundDistance);
  }
}

exports.registerInput = function registerInput(key, way) {
  const player = mp.players.local;
  if (!player.data?.noClip) return;

  if (key === 0xA0) return player.data.noClipQuick = way;

  if (!player.data.noClipKeys) player.data.noClipKeys = {};
  player.data.noClipKeys[wayLookupTable[key]] = way;
}

exports.applyMovement = function applyMovement() {
  const player = mp.players.local;
  if (!player.data?.noClip) return;
  if (!player.data.noClipKeys) return;

  const camRot = mp.game.cam.getGameplayCamRot(0);

  for (let key in player.data.noClipKeys) {
    if (!player.data.noClipKeys[key]) continue;
    mp.events.callRemote('noclip:movement', key, player.data.noClipQuick ? player.data.noClipSpeed*2 : player.data.noClipSpeed, camRot.z);
  }
}