const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const punchRoutes = require("./routes/punchRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  const clientIp1 = req.ip;
  const clientIp2 =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const date = new Date().toLocaleString("en-BD", { timeZone: "Asia/Dhaka" });
  res.send({
    message: "App is working",
    clientIp1,
    clientIp2,
    date,
  });
});

/**
 * create database and users and attendance table command
 */
/*

CREATE DATABASE filascoattendance;

USE filascoattendance;

CREATE TABLE users (
  userid INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  fullname VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE attendance (
  attendanceid INT AUTO_INCREMENT PRIMARY KEY,
  userid INT NOT NULL,
  punchin DATETIME NOT NULL,
  punchout DATETIME DEFAULT NULL,
  ipaddress VARCHAR(255),
  FOREIGN KEY (userid) REFERENCES users(userid)
);

*/

// endpoint for punching in and out
app.use("/api", authRoutes);
app.use("/api", punchRoutes);
app.use("/api/attendance", attendanceRoutes);

app.listen(port, () => {
  console.log("Backend is running on ", port);
});
