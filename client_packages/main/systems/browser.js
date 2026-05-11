let currentKeyInterval;

let callbacks = {};

exports.registerBrowser = function registerBrowser() {
  return new Promise((resolve, reject) => {
    const browser = mp.browsers.new('package://main/html/index.html');

    browser.inputEnabled = true;
  
    mp.players.local.data.browser = browser;

    mp.events.add('browser:menu:lockControls', (state) => mp.players.local.data.lockControls = state);
    mp.events.add('browser:menu:lockMouse', (state) => mp.gui.cursor.show(state, state));
    mp.events.add('browser:menu:active', (state) => mp.players.local.data.menuActive = state);

    mp.events.add('browserDomReady', () => resolve());

    mp.events.add('browser:menu-interact', (name, ...args) => {
      if (!callbacks[name]) return mp.console.logWarning(`Event : ${name} was called from CEF but is not registered by the game`);
      
      callbacks[name](...args);
    });

    mp.events.add('browser:login:tryLogin', username => mp.events.callRemote('auth:tryDiscordLogin', username));

    mp.events.add('auth:discordLoginError', message => browser.call('browser:login:error', message));
    mp.events.add('auth:discordLoginSuccess', () => {
      browser.call('browser:login:setState', false)
      
      mp.players.local.data.lockControls = false;
      mp.gui.cursor.show(false, false)
    });
  });
}

/**
 * Create a page and adds it to the CEF menu
 * @param {string} route Id of the page to create
 * @param {string} title Title displayed on the page
 * @returns {Promise} Resolve when page is created
 */
exports.registerPage = function registerPage(route, title) {
  return new Promise((resolve, reject) => {
    const browser = mp.players.local.data.browser;

    mp.events.add(`browser:menu-done:registerPage-${route}`, () => {
      mp.events.remove(`browser:menu-done:registerPage-${route}`);
      resolve();
    });

    browser.call('browser:menu:registerPage', route, title);
  });
}

/**
 * Create an option for a page and adds it to the CEF menu
 * @param {('link' | 'confirm' | 'button' | 'checkbox' | 'input' | 'number' | 'color' | 'divider' | 'option')} type Type of the option to create
 * @param {string} route Route of the page to add option
 * @param {string} label Label of the option
 * @param {Function} interactFunction Function called when option is interacted with (can return value if appliable), null if no callback is needed
 * @param {Object} options Options to pass to the option
 */
exports.registerOption = function registerOption(type, route, label, interactFunction, options = {}) {
  const browser = mp.players.local.data.browser;
  
  const eventName = `${route}-${type}-${label.replace(/[^a-zA-Z0-9]/g, '')}`;
  
  browser.call('browser:menu:registerOption', route, type, label, eventName, JSON.stringify(options));
  
  if (interactFunction) callbacks[eventName] = interactFunction;
}

/**
 * Mutate an option on a page of the CEF menu
 * @param {String} iden Value to do the check on
 * @param {any} val Value of the iden where element should be mutated
 * @param {string} route Route of the page to mutate option
 * @param {('link' | 'confirm' | 'button' | 'checkbox' | 'input' | 'number' | 'color' | 'divider')} type Type of the option to create
 * @param {string} label Label of the option
 * @param {Function} interactFunction Function called when option is interacted with (can return value if appliable), null if no callback is needed
 * @param {Object} options Options to pass to the option
 */
exports.mutateOption = function mutateOption(iden, val, route, type, label, interactFunction, options = {}) {
  const browser = mp.players.local.data.browser;
  
  const eventName = `${route}-${type}-${label.replace(/[^a-zA-Z0-9]/g, '')}`;
  
  browser.call('browser:menu:mutateOption', route, iden, val, type, label, eventName, JSON.stringify(options));
  
  if (interactFunction) callbacks[eventName] = interactFunction;
}

/**
 * Create a notification in CEF to display message to user
 * @param {string} content The text to show
 * @param {('red' | 'green' | 'blue' | 'yellow')} color The color of the notification
 * @param {number} delay The delay to delete notification 
 */
function sendNotification(content, color = '', delay = 3) {
  const browser = mp.players.local.data.browser;
  browser.call('browser:notif:send', content, color, delay);
}
mp.events.add('hud:notification', sendNotification);
exports.sendNotification = sendNotification;

/**
 * Navigate in the menu
 * @param {String} route The route to navigate to
 * @param {Boolean} [back] Whether this is to go back or not
 */
exports.navigate = function navigate(route, back = false) {
  const browser = mp.players.local.data.browser;
  browser.call('browser:menu:navigate', route, back);
}

/**
 * Delete a page from the menu
 * @param {String} route Route of page
 * @param {String} linkRoute Route of link to the page
 */
exports.deletePage = function deletePage(route, linkRoute) {
  const browser = mp.players.local.data.browser;
  browser.call('browser:menu:deletePage', route, linkRoute);
}

/**
 * Delete an option from specified page with specific value on an identificator
 * @param {String} route Route of the element
 * @param {String} iden Value to do the check on
 * @param {any} val Value of the iden where element should be deleted
 */
exports.deleteOption = function deleteOption(route, iden, val) {
  const browser = mp.players.local.data.browser;
  browser.call('browser:menu:deleteOption', route, iden, val);
}