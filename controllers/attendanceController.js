const db = require("../db");
const getAttendances = (req, res) => {
  const q = "select * from attendance WHERE userid = ?";
  db.query(q, [req.user.userid], (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.status(200).json(data.reverse());
  });
};

module.exports = { getAttendances };
