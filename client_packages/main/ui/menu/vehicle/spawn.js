const { vehicleData } = require('main/consts/vehicleData.js');
const { registerPage, registerOption, sendNotification } = require('main/systems/browser.js');
const { trySpawnVehicle } = require('main/systems/vehicles.js');
const { registerNewVehicle } = require('main/ui/menu/vehicle/myVehicles.js');
const { registerSavedVehiclePage } = require('main/ui/menu/vehicle/savedVehicle.js');

exports.registerSpawnVehiclePage = async function registerSpawnVehiclePage() {
  const pageTitle = 'Spawn a vehicle'
  await registerPage('vehicles/spawn', pageTitle);
  registerOption('link', 'vehicles', pageTitle, async () => {
    await registerSavedVehiclesPage();
    await registerPublicVehiclesPage();
  }, { route: 'vehicles/spawn' });

  registerOption('input', 'vehicles/spawn', 'Spawn by name', async (value) => {
    await trySpawnVehicle(value, registerNewVehicle);
  }, { regexMatch: (/[a-zA-Z0-9]/).source });

  registerOption('link', 'vehicles/spawn', 'Saved Vehicles', null, { route: 'vehicles/saved' });
  registerOption('link', 'vehicles/spawn', 'Public Vehicles', null, { route: 'vehicles/public' });
  
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

async function registerSavedVehiclesPage() {
  const pageTitle = 'Saved Vehicles';
  const route = `vehicles/saved`;
  await registerPage(route, pageTitle);

  const vehiclesSaved = JSON.parse(await mp.events.callRemoteProc('vehicle:getSavedVehicles'));

  registerOption('button', route, 'You\'ve no vehicles saved', null, { default: true });
  
  for (let veh of vehiclesSaved) {
    const data = JSON.parse(veh.data)
    registerOption('button', route, veh.display_name, async () => {
      await trySpawnVehicle(data.model, (vId) => {
        const vehicle = mp.vehicles.atRemoteId(vId);
        if (!vehicle.data) vehicle.data = {};
        vehicle.data.savedData = {
          id: veh.id,
          display_name: veh.display_name,
          public: veh.public,
        };
        vehicle.data.preset = data;
        registerNewVehicle(vId);
      });
    }, { id: veh.id });
  }
}

async function registerPublicVehiclesPage() {
  const pageTitle = 'Public Vehicles';
  const route = `vehicles/public`;
  await registerPage(route, pageTitle);

  const [ownId, vehiclesSaved] = await mp.events.callRemoteProc('vehicle:getPublicVehicles');

  registerOption('button', route, 'There is no public vehicles saved', null, { default: true });
  
  for (let veh of JSON.parse(vehiclesSaved)) {
    const data = JSON.parse(veh.data)
    registerOption('button', route, veh.display_name, async () => {
      await trySpawnVehicle(data.model, (vId) => {
        const vehicle = mp.vehicles.atRemoteId(vId);
        if (!vehicle.data) vehicle.data = {};
        vehicle.data.savedData = {
          id: veh.id,
          display_name: veh.display_name,
          public: veh.public,
          isOwn: veh.owner_id == ownId,
        };
        vehicle.data.preset = data;
        registerNewVehicle(vId);
      });
    }, { id: veh.id });
  }
}