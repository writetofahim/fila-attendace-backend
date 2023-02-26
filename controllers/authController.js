const db = require("../db");
const jwt = require("jsonwebtoken");

const handleLogin = (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE userName = '${username}' AND password = '${password}'`;
  db.query(query, [], function (error, results, fields) {
    if (error) {
      return res.status(401).json({ message: "Something went wrong!" });
    }
    if (results.length < 1) {
      return res.status(404).send({ error: "No user found!" });
    }
    const user = {
      username: results[0].username,
      fullname: results[0].fullname,
      userid: results[0].userid,
    };
    const token = jwt.sign({ userid: user.userid }, "filasco", {
      expiresIn: "1d",
    });
    return res.send({ user, token });
  });
};

module.exports = { handleLogin };
