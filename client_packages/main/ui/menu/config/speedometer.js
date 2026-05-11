const { registerPage, registerOption } = require('main/systems/browser.js');

exports.registerSpeedometerPage = async function registerSpeedometerPage() {
  const pageTitle = 'Speedometer';
  const route = `config/speedometer`;
  await registerPage(route, pageTitle);
  registerOption('link', 'config', pageTitle, null, { route: route });

  registerOption('option', route, 'Mode', (val) => {
    let mode = 0;
    if (val === 'MPH') mode = 1;
    mp.storage.data.speedoMode = mode;
    mp.players.local.data.speedoMode = mode;
    mp.players.local.data.browser.call('browser:speedo:setMode', mode);
  }, {availableOptions: ['KMH', 'MPH'], value: mp.storage.data.speedoMode || 'KMH'});

  registerOption('option', route, 'Design', (val) => {
    mp.storage.data.speedoDesign = val;
    mp.players.local.data.browser.call('browser:speedo:setDesign', val);
  }, {availableOptions: ['FH4', 'FH5'], value: mp.storage.data.speedoDesign || 'FH5'});
}