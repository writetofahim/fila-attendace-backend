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
      const { userName } = jwt.verify(token, "filasco");
      const query = `SELECT * FROM user WHERE userName = '${userName}' `;
      db.query(query, [], function (error, results, fields) {
        if (error) {
          return res.status(401).json({ message: "Something went wrong!" });
        }
        if (results.length < 1) {
          return res.status(404).send({ error: "No user found!" });
        }
        req.user = results[0];
        next();
      });
    } catch (error) {
      res.status(401).send({ message: "Unauthorized User" });
    }
  }
};

module.exports = requireAuth;
