const { handlingOptions } = require('main/consts/handlingOptions.js');
const { registerPage, registerOption } = require('main/systems/browser.js');

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}


function roundTo(val, fractionDigits) {
  return parseFloat(val.toFixed(fractionDigits))
}


exports.registerHandlingPage = async function registerHandlingPage(rId) {
  const pageTitle = 'Handling';
  const route = `vehicles/handling-${rId}`;
  await registerPage(route, pageTitle);

  const vehicle = mp.vehicles.atRemoteId(rId);

  for (let option of handlingOptions) {
    switch (option.type) {
      case 'divider':
        registerOption('divider', route, option.hint, null);
        break;
      case 'number':
        registerOption('number', route, option.key, (val) => {
          vehicle.setHandling(option.key, option.toRage ? option.toRage(val) : val);
        }, {
          min: option.min,
          max: option.max,
          step: option.step,
          desc: option.hint,
          value: option.fromRage ? 
            roundTo(option.fromRage(vehicle.getHandling(option.key)) || 0, 3) :
            roundTo(vehicle.getHandling(option.key) || 0, 3),
          allowRotation: true,
        });
        break;
      case 'vector3':
        for (const axis of ['x', 'y', 'z']) {
          registerOption('number', route, `${option.key}${axis.toUpperCase()}`, (val) => {
            const newVector = {...vehicle.getHandling(option.key)};
            newVector[axis] = val;
            vehicle.setHandling(option.key, newVector);
          }, {
            min: option.min,
            max: option.max,
            step: option.step,
            desc: option.hint,
            value: roundTo(vehicle.getHandling(option.key)[axis], 3),
            allowRotation: true,
          })
        }
        break;
    }
  }
}