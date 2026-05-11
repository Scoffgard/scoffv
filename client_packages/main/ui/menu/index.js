const { registerConfigPage } = require("main/ui/menu/config/config.js");
const { registerVehiclePage } = require("main/ui/menu/vehicle/vehicle.js");

exports.registerMenuPages = async function registerMenuPages() {
  await registerVehiclePage();
  await registerConfigPage();
}