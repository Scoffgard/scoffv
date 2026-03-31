const { vehicleData } = require('main/consts/vehicleData.js');
const { registerPage, registerOption, sendNotification } = require('main/systems/browser.js');
const { trySpawnVehicle } = require('main/systems/vehicles.js');
const { registerNewVehicle } = require('main/ui/menu/vehicle/myVehicles.js');

exports.registerSpawnVehiclePage = async function registerSpawnVehiclePage() {
  const pageTitle = 'Spawn a vehicle'
  await registerPage('vehicles/spawn', pageTitle);
  registerOption('link', 'vehicles', pageTitle, null, { route: 'vehicles/spawn' });

  registerOption('input', 'vehicles/spawn', 'Spawn by name', async (value) => {
    await trySpawnVehicle(value, registerNewVehicle);
  }, { regexMatch: (/[a-zA-Z0-9]/).source });
  
  await registerVehicleSpawnPages(pageTitle);
}

async function registerVehicleSpawnPages(pageTitle) {
  await registerPage('vehicles/spawn/class', `${pageTitle} - By Class`);
  await registerPage('vehicles/spawn/manufacturers', `${pageTitle} - By Manufacturers`);

  registerOption('link', 'vehicles/spawn', 'Classes', null, { route: 'vehicles/spawn/class'});
  registerOption('link', 'vehicles/spawn', 'Manufacturers', null, { route: 'vehicles/spawn/manufacturers'});

  const createdClass = [];
  const createdManu = [];
  
  for (let veh of vehicleData) {
    if (veh.class) {
      if (createdClass.indexOf(veh.class) == -1) {
        await registerPage(`vehicles/spawn/class/${veh.class}`, `${pageTitle} - ${veh.class}`);
        registerOption('link', 'vehicles/spawn/class', veh.class, null, { route: `vehicles/spawn/class/${veh.class}`});
        createdClass.push(veh.class);
      }
      registerOption('button', `vehicles/spawn/class/${veh.class}`, veh.name, async () => {
        await trySpawnVehicle(veh.spawnname, registerNewVehicle);
      });
    }
    if (veh.manufacturer) {
      if (createdManu.indexOf(veh.manufacturer) == -1) {
        await registerPage(`vehicles/spawn/manufacturers/${veh.manufacturer}`, `${pageTitle} - ${veh.manufacturer}`);
        registerOption('link', 'vehicles/spawn/manufacturers', veh.manufacturer, null, { route: `vehicles/spawn/manufacturers/${veh.manufacturer}`});
        createdManu.push(veh.manufacturer);
      }
      registerOption('button', `vehicles/spawn/manufacturers/${veh.manufacturer}`, veh.name, async () => {
        await trySpawnVehicle(veh.spawnname, registerNewVehicle);
      });
    }
  }
}