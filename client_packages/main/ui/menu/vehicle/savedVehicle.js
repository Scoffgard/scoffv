const { registerPage, registerOption, deletePage, navigate, sendNotification, deleteOption, mutateOption } = require('main/systems/browser.js');

exports.registerSavedVehiclePage = async function registerSavedVehiclePage(veh, parentRoute) {
  const savedData = veh.data.savedData;
  const route = `vehicles/saved/${savedData.id}`;
  const pageTitle = `Saved - ${savedData.display_name}`;
  await registerPage(route, pageTitle);

  registerOption('input', route, 'Name', async (val) => {
    if (!(await mp.events.callRemoteProc('vehicle:saved:action', savedData.id, 'rename', val)))
      sendNotification('Couldn\'t change vehicle preset', 'red');
  }, { value: savedData.display_name, preserveValue: true }); 

  registerOption('checkbox', route, 'Public', async (val) => {
    if (!(await mp.events.callRemoteProc('vehicle:saved:action', savedData.id, 'public', val)))
      sendNotification('Couldn\'t change vehicle preset', 'red');
  }, { value: savedData.public });

  registerOption('confirm', route, 'Delete', async () => {
    if (await mp.events.callRemoteProc('vehicle:saved:action', savedData.id, 'delete')) {
      deletePage(route);
      mutateOption('route', route, parentRoute, 'button', 'Save Vehicle', () => {});
      navigate(parentRoute, true);
      deleteOption('vehicles/saved', 'id', savedData.id);
      sendNotification(`Vehicle preset deleted`, 'green');
    } else sendNotification('Vehicle preset couldn\'t be deleted', 'red');
  });

  registerOption('button', route, 'Save Modifications', async () => {
    if (
      await mp.events.callRemoteProc('vehicle:saved:action', savedData.id, 'data', JSON.stringify(veh.data.preset))
    ) sendNotification('Modifications saved', 'green');
    else sendNotification('Error while saving modifications', 'red');
  });
}