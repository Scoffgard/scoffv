mp.events.add('auth:saveConnection', (token, id) => {
  mp.storage.data.connection = {
    token,
    id,
  };
});