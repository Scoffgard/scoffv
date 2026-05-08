const mysql = require('mysql');
require('dotenv').config({quiet: true});

(async () => {
  console.log('[INFO] Creating connection to database');
  globalThis.connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'scoffv',
  });
  globalThis.connection.connect(err => {
    if (err) console.error(err);
  });
  console.log('[SUCCESS] Connection to database successful');
})();

async function queryAsync(request, reqFields) {
  return new Promise((resolve, reject) => {
    globalThis.connection.query(request, reqFields, (error, results, fields) => {
      if (error) reject(error);
      resolve([results, fields]);
    });
  });
}

module.exports = {
  queryAsync,
}