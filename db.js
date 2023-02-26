const mysql = require("mysql");

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "filascoattendance",
// });
// module.exports = db;

const db = mysql.createConnection({
  host: "107.180.26.71",
  port: "3306",
  user: "appdev",
  password: "F1l@T3ch#8062$",
  database: "apptimecard",
});
module.exports = db;
