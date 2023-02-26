const jwt = require("jsonwebtoken");
const db = require("../db");

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).send({ message: "Unauthorized User" });
  }

  if (authorization && authorization.startsWith("Bearer")) {
    try {
      const token = authorization.split(" ")[1];
      const { user } = jwt.verify(token, "filasco");
      const query = `SELECT * FROM users WHERE user = '${user}' `;
      db.query(query, [], function (error, results, fields) {
        if (error) {
          return res
            .status(500)
            .json({ error: "Something went wrong in server side!" });
        }
        if (results.length < 1) {
          return res.status(404).send({ error: "No user found!" });
        }
        req.user = results[0];
        next();
      });
    } catch (error) {
      res.status(401).send({ error: "Unauthorized User" });
    }
  }
};

module.exports = requireAuth;
