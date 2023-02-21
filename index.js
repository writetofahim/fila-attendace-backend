const db = require("./db");
const express = require("express");
const cors = require("cors");

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
  console.log(data);
});
app.post("/login", (req, res) => {
  console.log(req);
  const data = req.body;
  console.log(data);
});
app.listen(port, () => {
  console.log("Backend is running on ", port);
});
