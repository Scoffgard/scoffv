
mp.events.add('render', () => {
  const player = mp.players.local;
  if (player.data.lockControls) {
    mp.game.controls.disableAllControlActions(0);
    mp.game.controls.disableControlAction(32, 80, true);
  }
  if (player.data.menuActive) {
    mp.game.controls.disableControlAction(32, 199, true);
    mp.game.controls.disableControlAction(32, 200, true);
  }

  if (player.data.noClip) {
    // Disable all inputs that can defer the noclip
    mp.game.player.disableFiring(true);
    mp.game.controls.disableControlAction(32, 0, true);
    mp.game.controls.disableControlAction(0, 25, true);
		mp.game.controls.disableControlAction(1, 25, true);
    mp.game.controls.disableControlAction(0, 30, true); // left/right
    mp.game.controls.disableControlAction(0, 31, true); // forward/back
    mp.game.controls.disableControlAction(0, 21, true); // sprint

    // Prevent player from playing falling/walking/standing anims
    player.setVelocity(0, 0, 0);
    mp.game.ai.clearPedTasksImmediately(player.handle);

    // Allow player to adjust speed of noclip by the mouse wheel
    if (mp.game.controls.getDisabledControlNormal(0, 241) > 0 && player.data.noClipSpeed > 0.2) player.data.noClipSpeed = player.data.noClipSpeed-0.1;
    if (mp.game.controls.getDisabledControlNormal(0, 242) > 0 && player.data.noClipSpeed < 100) player.data.noClipSpeed = player.data.noClipSpeed+0.1;
  }
})