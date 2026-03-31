const { tuningParts } = require('main/consts/tuningParts.js');
const { registerPage, registerOption } = require('main/systems/browser.js');

exports.registerTuningPage = async function registerTuningPage(rId) {
  const pageTitle = 'Tuning';
  const route = `vehicles/tuning-${rId}`;
  await registerPage(route, pageTitle);

  const vehicle = mp.vehicles.atRemoteId(rId);

  for (let [key, value] of Object.entries(tuningParts)) {
    const maxValue = getMaxNumOfTuningIndex(vehicle, Number(key));
    const currentValue = getTuningIndex(vehicle, Number(key));
    if (maxValue === 0) continue; // if no tuning part is available skip adding to menu

    registerOption('number', route, value, (val) => {
      requestSetVehicleMod(vehicle, Number(key), val);
    }, {
      min: currentValue,
      max: maxValue,
      value: currentValue,
    });
  }
}

function getMaxNumOfTuningIndex(vehicle, tuningType) {
  switch (tuningType) {
    case 53: //numplateindex
      return 5;
    case 55: //window tint
      return 3;
    default:
      return vehicle.getNumMods(tuningType);
  }
}

function getTuningIndex(vehicle, tuningType) {
  switch (tuningType) {
    case 55: //tint
      return vehicle.getWindowTint();
    case 53: //numplateindex
      return vehicle.getNumberPlateTextIndex();
    default:
      return vehicle.getMod(tuningType) + 1;
  }
}

function requestSetVehicleMod(vehicle, type, value) {
  switch (type) {
    case 14:
      vehicle.startHorn(3000, mp.game.joaat('HELDDOWN'), false);
    default:
      mp.events.callRemote('vehicle:setMod', vehicle.remoteId, type, value);
      break;
  }
}