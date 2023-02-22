const jwt = require("jsonwebtoken");
const db = require("./db");
const express = require("express");
const cors = require("cors");
const requireAuth = require("./middleware/requireAuth");

const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("app is working");
});

app.get("/attendance", requireAuth, (req, res) => {
  const q = "select * from attendance WHERE username = ?";
  db.query(q, [req.user.userName], (err, data) => {
    console.log(data);
    console.log(err);
    if (err) return res.status(500).json(err);
    return res.status(200).json(data[0]);
  });
});

app.post("/attendance", requireAuth, (req, res) => {
  const { punchIn } = req.body;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const date = new Date().toLocaleString("en-BD", { timeZone: "Asia/Dhaka" });
  if (punchIn) {
    const query = ``;
  }
  console.log(`Client IP address: ${ip}`);
  console.log(data);
});

/**
Table: attendance
- id (int, primary key)
- userName (varchar, foreign key references users(userName))
- punch_in_time (varchar)
- punch_out_time (varchar)
- ip_address (varchar)
*/

// endpoint for punching in
app.post("/punchin", requireAuth, (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const { userName } = req.user;
  const date = new Date().toLocaleString("en-BD", { timeZone: "Asia/Dhaka" });
  // insert the punch-in record into the attendance table
  const punchInQuery = `INSERT INTO attendance (userName, punch_in_time, ip_address) VALUES ('${userName}', '${date}', '${ip}')`;
  connection.query(punchInQuery, (error, results, fields) => {
    if (error) throw error;
    res.send(`Punch-in recorded for user ${req.user.username}`);
  });
});

// endpoint for punching out
app.post("/punchout", requireAuth, (req, res) => {
  const { userName } = req.user;
  const date = new Date().toLocaleString("en-BD", { timeZone: "Asia/Dhaka" });

  // find the most recent punch-in record for the user
  const getLatestPunchInQuery = `SELECT MAX(id) AS id FROM attendance WHERE username = ? AND punch_out_time IS NULL`;

  connection.query(
    getLatestPunchInQuery,
    [userName],
    (error, results, fields) => {
      if (error) throw error;

      if (results.length > 0) {
        const punchInId = results[0].id;

        // update the punch-in record with the punch-out time
        const punchOutQuery = `UPDATE attendance SET punch_out_time = ? WHERE id = ${punchInId}`;
        connection.query(punchOutQuery, [date], (error, results, fields) => {
          if (error) throw error;
          res.send(`Punch-out recorded for user ${req.user.username}`);
        });
      } else {
        res
          .status(400)
          .send(`User ${req.user.userName} has no recorded punch-in events`);
      }
    }
  );
});

app.post("/login", (req, res) => {
  console.log(req);
  const { userName, password } = req.body;
  const query = `SELECT * FROM user WHERE userName = '${userName}' AND password = '${password}'`;
  db.query(query, [], function (error, results, fields) {
    if (error) {
      return res.status(401).json({ message: "Something went wrong!" });
    }
    if (results.length < 1) {
      return res.status(404).send({ error: "No user found!" });
    }
    const user = {
      userName: results[0].userName,
      fullName: results[0].fullName,
      id: results[0].id,
    };
    const token = jwt.sign({ userName: user.userName }, "filasco", {
      expiresIn: "1d",
    });
    return res.send({ user, token });
  });
});

app.listen(port, () => {
  console.log("Backend is running on ", port);
});
