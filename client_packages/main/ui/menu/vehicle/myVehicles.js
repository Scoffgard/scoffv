const { registerPage, registerOption, navigate, deletePage } = require("main/systems/browser.js");
const { vehicleData } = require("main/consts/vehicleData.js");
const { tryDeleteVehicle, toggleSirens } = require("main/systems/vehicles.js");
const { registerPaintJobPage } = require("main/ui/menu/vehicle/paintJob.js");
const { registerTuningPage } = require("main/ui/menu/vehicle/tuning.js");
const { registerNeonLightsPage } = require("main/ui/menu/vehicle/neonLights.js");
const { registerHandlingPage } = require("main/ui/menu/vehicle/handling.js");
const { registerExtrasPage } = require("main/ui/menu/vehicle/extras.js");


exports.registerNewVehicle = async function registerNewVehicle(rId) {
  const vehicle = mp.vehicles.atRemoteId(rId);

  if (!vehicle) return mp.console.logWarning('[WARN] Tried to add vehicle to menu that does not exists');
  
  const route = `vehicles/${rId}`;

  const vehName = vehicleData.filter(v => v.hash == vehicle.model)[0].name;

  await registerPage(route, vehName);
  registerOption('link', 'vehicles', vehName, null, { route });

  await registerPaintJobPage(rId);
  registerOption('link', route, 'Paintjob', null, { route: `vehicles/paintjob-${rId}`});

  await registerTuningPage(rId);
  registerOption('link', route, 'Tuning', null, { route: `vehicles/tuning-${rId}`});

  await registerNeonLightsPage(rId);
  registerOption('link', route, 'Neon & Lights', null, { route: `vehicles/neonlights-${rId}`});

  registerOption('confirm', route, 'Delete', async () => await tryDeleteVehicle(rId, () => {
    navigate('vehicles', true);
    deletePage(route, 'vehicles');
    deletePage(`vehicles/paintjob-${rId}`);
    deletePage(`vehicles/tuning-${rId}`);
    deletePage(`vehicles/neonlights-${rId}`);
  }));

  registerOption('checkbox', route, 'Godmode', (val) => {
    mp.events.callRemote('vehicle:syncOption', 'godmode', vehicle.remoteId, val);
    if (val) {
      vehicle.setFixed();
      vehicle.setEngineCanDegrade(false);
      vehicle.setTyresCanBurst(false);
      for (let i = 0; i <= 5; i++) {
        vehicle.setDoorBreakable(i, false);
      }
      mp.game.vehicle.setHasUnbreakableLights(vehicle.handle, true);
      mp.game.vehicle.setDisableWindowCollisions(vehicle.handle, true);
      vehicle.setProofs(true, true, true, true, true, true, true, true);

      if (!vehicle.data) vehicle.data = {};
      if (vehicle.data.godmodeInterval) return;
      vehicle.data.godmodeInterval = setInterval(() => {
        mp.game.graphics.removeDecalsFromVehicle(vehicle.handle);
        vehicle.setDeformationFixed(true);
        vehicle.fixBumper(true);
        vehicle.fixBumper(false);
      }, 100)
    }
    else {
      if (!vehicle.data || !vehicle.data.godmodeInterval) return;
      clearInterval(vehicle.data.godmodeInterval);
      vehicle.data.godmodeInterval = null;
      
      vehicle.setEngineCanDegrade(true);
      vehicle.setTyresCanBurst(true);
      for (let i = 0; i <= 5; i++) {
        vehicle.setDoorBreakable(i, true);
      }
      mp.game.vehicle.setHasUnbreakableLights(vehicle.handle, false);
      mp.game.vehicle.setDisableWindowCollisions(vehicle.handle, false);
      vehicle.setProofs(false, false, false, false, false, false, false, false);
    }
  });

  registerOption('checkbox', route, 'Never dirty', (val) => {
    mp.events.callRemote('vehicle:syncOption', 'neverdirty', vehicle.remoteId, val);
    if (val) {
      if (!vehicle.data) vehicle.data = {};
      if (vehicle.data.neverDirtyInterval) return;
      vehicle.data.neverDirtyInterval = setInterval(() => {
        vehicle.setDirtLevel(0);
      }, 100)
    }
    else {
      if (!vehicle.data || !vehicle.data.neverDirtyInterval) return;
      clearInterval(vehicle.data.neverDirtyInterval);
      vehicle.data.neverDirtyInterval = null;
    }
  });

  if (vehicle.getClass() == 18) {
    registerOption('checkbox', route, 'Mute Siren Sound', (val) => {
      mp.events.call('vehicle:syncOption', 'siren', vehicle.remoteId, val);
      vehicle.setSirenSound(val);
    });
  }

  registerOption('checkbox', route, 'Drift Mode', (val) => {
    mp.events.callRemote('vehicle:syncOption', 'drift', vehicle.remoteId, val);
    mp.game.vehicle.setDriftTyresEnabled(vehicle.handle, val);
  });

  registerOption('input', route, 'Numberplate Text', (val) => {
    if (val) vehicle.setNumberPlateText(val);
  }, { maxLen: 8 });

  registerOption('link', route, 'Engine Sound', () => {
    mp.players.local.data.menuSelectedVehicleRId = rId;
  }, { route: 'vehicles/enginesound'});

  // registerOption('color', route, 'Tire Smoke Color', (val) => {
  //   const rgb = JSON.parse(val);
  //   mp.game.vehicle.setTyreSmokeColor(vehicle.handle, rgb.r, rgb.g, rgb.b);
  // }, {
  //   value: vehicle.getTyreSmokeColor(1, 1, 1),
  // });

  await registerHandlingPage(rId);
  registerOption('link', route, 'Handling', null, { route: `vehicles/handling-${rId}`});

  await registerExtrasPage(rId);
  registerOption('link', route, 'Extras', null, { route: `vehicles/extras-${rId}`})

  navigate(route);
}