const { vehicleData } = require("main/consts/vehicleData.js");
const { sendNotification, navigate, deletePage } = require("main/systems/browser.js");

/**
 * Try to spawn a synced vehicle from given model
 * @param {String} model Model of vehicle to spawn
 * @param {Function} [callback] Function to call after vehicle spawn (gives remoteId as parameter) 
 */
exports.trySpawnVehicle = async function trySpawnVehicle(model, callback = null) {
  if (vehicleData.filter(v => v.spawnname.toLowerCase() == model)[0]) {
    const spawnPos = mp.players.local.vehicle ? findSpawnPoint(mp.players.local) : mp.players.local.position;
    if (!spawnPos) return sendNotification(`No position found to spawn vehicle`, 'red', 2);
    const vehicleId = await mp.events.callRemoteProc('vehicle:spawn', model, spawnPos);
    sendNotification(`Vehicle : "${model}" spawned successfuly`, 'green', 1);

    const vehicle = mp.vehicles.atRemoteId(vehicleId);
    vehicle.data = {};

    if (vehicle.handle) mp.players.local.setIntoVehicle(vehicle.handle, -1);
    else mp.players.local.data.vehicleToEnter = vehicleId;

    if (callback) callback(vehicleId);
  }
  else sendNotification(`"${model}" is not a proper vehicle name`, 'red', 2);
}

/**
 * Try to delete a synced vehicle
 * @param {Number} vehId The remote id of the vehicle to delete
 * @param {Function} callback Function to call after vehicle deletation
 */
async function tryDeleteVehicle(vehId, callback = null) {
  const vehicle = mp.vehicles.atRemoteId(vehId);
  if (vehicle.data.neverDirtyInterval) clearInterval(vehicle.data.neverDirtyInterval);
  if (vehicle.data.godmodeInterval) clearInterval(vehicle.data.godmodeInterval);

  const vehDeleteStatus = await mp.events.callRemoteProc('vehicle:delete', vehId);

  if (vehDeleteStatus) sendNotification(`Vehicle deleted`, 'green', 1);
  else sendNotification('Error while deleting vehicle', 'red', 1);

  if (callback) callback();
}
exports.tryDeleteVehicle = tryDeleteVehicle;

exports.saveVehicle = async function saveVehicle(vehicle, name, data) {
  if (await mp.events.callRemoteProc('vehicle:canSaveVehicle')) {
    const newSave = await mp.events.callRemoteProc('vehicle:save', name, JSON.stringify(data));
    const newSaveData = await mp.events.callRemoteProc('vehicle:saved:getData', newSave);
    return JSON.parse(newSaveData);
  }
}

function findSpawnPoint(player) {
  const base = player.position;
  
  for (let angle = 0; angle < 360; angle += 30) {
    
    const rad = angle * Math.PI / 180;
    
    const pos = new mp.Vector3(
      base.x + Math.cos(rad) * 4,
      base.y + Math.sin(rad) * 4,
      base.z
    );
    
    // Check line of sight
    const hit = mp.raycasting.testPointToPoint(
      base,
      pos,
      [player, player.vehicle],
      1
    );
    
    if (hit) continue;
    
    // Check nearby vehicles
    if (mp.game.vehicle.isAnyVehicleNearPoint(
      pos.x,
      pos.y,
      pos.z,
      3.0
    )) continue;
    
    return pos;
  }
  
  return null;
}


mp.events.add('vehicle:deleteOwn', async (rId) => {
  await tryDeleteVehicle(rId);

  navigate('vehicles', true);
  deletePage(`vehicles/${rId}`, 'vehicles');
  deletePage(`vehicles/paintjob-${rId}`);
  deletePage(`vehicles/tuning-${rId}`);
  deletePage(`vehicles/neonlights-${rId}`);
});