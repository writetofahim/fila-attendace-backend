const db = require("../db");
const jwt = require("jsonwebtoken");

const handleLogin = (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE user = '${username}' AND password = '${password}'`;
  db.query(query, [], function (error, results, fields) {
    if (error) {
      return res.status(401).json({ message: "Something went wrong!" });
    }
    if (results.length < 1) {
      return res.status(404).send({ error: "No user found!" });
    }
    const user = {
      user: results[0].user,
      SL: results[0].SL,
    };
    const token = jwt.sign(user, "filasco", {
      expiresIn: "1d",
    });
    return res.send({ user, token });
  });
};

module.exports = { handleLogin };
