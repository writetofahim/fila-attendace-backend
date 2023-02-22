const jwt = require("jsonwebtoken");
const db = require("./db");
const express = require("express");
const cors = require("cors");
const { JsonWebTokenError } = require("jsonwebtoken");

const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("app is working");
});
app.get("/attendance", (req, res) => {
  const q = "select * from attendance";
  db.query(q, [], (err, data) => {
    console.log(data);
    console.log(err);
    if (err) return res.status(500).json(err);

    return res.status(200).json(data[0]);
  });
});
app.post("/attendance", (req, res) => {
  const data = req.body;
  const ip = req.headers["x-forwarded-for"];
  console.log(`Client IP address: ${ip}`);
  console.log(data);
});
app.post("/login", (req, res) => {
  console.log(req);
  const { userName, password } = req.body;
  const query = `SELECT * FROM user WHERE userName = '${userName}' AND password = '${password}'`;
  db.query(query, [], function (error, results, fields) {
    if (error) throw error;
    console.log(results);
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
