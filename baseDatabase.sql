CREATE TABLE IF NOT EXISTS user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  discord_id VARCHAR(25),
  rk_id VARCHAR(25),
  username VARCHAR(25),
  username_data JSON,
  playtime FLOAT,
  last_connection TIMESTAMP,
  auth_level INT(2),
  connect_token VARCHAR(128),
  sanctions JSON
);

CREATE TABLE IF NOT EXISTS saved_vehicles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT,
  display_name VARCHAR(25),
  public BOOLEAN,
  data JSON,
  FOREIGN KEY (owner_id) REFERENCES user(id)
);