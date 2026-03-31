const { vehicleData } = require("main/consts/vehicleData.js");
const { sendNotification } = require("main/systems/browser.js");

/**
 * Try to spawn a synced vehicle from given model
 * @param {String} model Model of vehicle to spawn
 * @param {Function} [callback] Function to call after vehicle spawn (gives remoteId as parameter) 
 */
exports.trySpawnVehicle = async function trySpawnVehicle(model, callback = null) {
  if (vehicleData.filter(v => v.spawnname.toLowerCase() == model)[0]) {
    const vehicleId = await mp.events.callRemoteProc('vehicle:spawn', model);
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
exports.tryDeleteVehicle = async function tryDeleteVehicle(vehId, callback = null) {
  const vehicle = mp.vehicles.atRemoteId(vehId);
  if (vehicle.data.neverDirtyInterval) clearInterval(vehicle.data.neverDirtyInterval);
  if (vehicle.data.godmodeInterval) clearInterval(vehicle.data.godmodeInterval);

  const vehDeleteStatus = await mp.events.callRemoteProc('vehicle:delete', vehId);

  if (vehDeleteStatus) sendNotification(`Vehicle deleted`, 'green', 1);
  else sendNotification('Error while deleting vehicle', 'red', 1);

  if (callback) callback();
}