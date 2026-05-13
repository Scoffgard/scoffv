// EVENTS
require('./events/playerJoin.js');
require('./events/playerQuit.js');
require('./events/vehicleDeath.js');
require('./events/serverShutdown.js');
require('./events/playerDeath.js');

// SYSTEMS
require('./systems/vehicle.js');
require('./systems/auth.js');
require('./systems/database.js');
require('./systems/noClip.js');

// DISCORD
require('./discord/main.js');