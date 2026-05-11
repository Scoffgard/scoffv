
mp.events.add('render', () => {
  const player = mp.players.local;
  const browser = player.data.browser;

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
    mp.game.controls.disableControlAction(32, 261, true);
    mp.game.controls.disableControlAction(32, 262, true);
    mp.game.controls.disableControlAction(32, 81, true);
    mp.game.controls.disableControlAction(32, 82, true);
    mp.game.controls.disableControlAction(0, 25, true);
		mp.game.controls.disableControlAction(1, 25, true);
    mp.game.controls.disableControlAction(0, 30, true); // left/right
    mp.game.controls.disableControlAction(0, 31, true); // forward/back
    mp.game.controls.disableControlAction(0, 21, true); // sprint

    // Prevent player from playing falling/walking/standing anims
    if (!player.vehicle) {
      player.setVelocity(0, 0, 0);
      mp.game.ai.clearPedTasksImmediately(player.handle);
    } else {
      player.vehicle.setVelocity(0, 0, 0);
      player.vehicle.setRotation(0, 0, mp.game.cam.getGameplayCamRot(0).z, 0, false);
    }

    // Allow player to adjust speed of noclip by the mouse wheel
    if (mp.game.controls.getDisabledControlNormal(0, 241) > 0 && player.data.noClipSpeed > 0.2) player.data.noClipSpeed = player.data.noClipSpeed-0.1;
    if (mp.game.controls.getDisabledControlNormal(0, 242) > 0 && player.data.noClipSpeed < 100) player.data.noClipSpeed = player.data.noClipSpeed+0.1;
  }

  if (player.vehicle && !player.data.speedoOn) {
    browser.call('browser:speedo:setState', true);
    player.data.speedoOn = true;
  } else if (!player.vehicle && player.data.speedoOn) {
    browser.call('browser:speedo:setState', false);
    player.data.speedoOn = false;
  }

  if (player.vehicle && player.data.speedoOn) {
    browser.call(
      'browser:speedo:setSpeed',
      Math.floor(
        player.vehicle.getSpeed() *
        (player.data.speedoMode === 1 ? 2.236936 : 3.6)
      )
    );
    browser.call('browser:speedo:setGear', player.vehicle.gear || 'N');
    browser.call('browser:speedo:setRPM', player.vehicle.rpm);
  }
});