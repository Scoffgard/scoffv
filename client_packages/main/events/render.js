
mp.events.add('render', () => {
  if (mp.players.local.data.lockControls) {
    mp.game.controls.disableAllControlActions(0);
    mp.game.controls.disableControlAction(32, 80, true);
  }
  if (mp.players.local.data.menuActive) {
    mp.game.controls.disableControlAction(32, 199, true);
    mp.game.controls.disableControlAction(32, 200, true);
  }
})