const { registerVehiclePage } = require("main/ui/menu/vehicle/vehicle.js");

exports.registerMenuPages = async function registerMenuPages() {
  await registerVehiclePage();
}