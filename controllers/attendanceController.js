const db = require("../db");
const getAttendances = (req, res) => {
  const q = "select * from attendance ";

  db.query(q, [], (err, data) => {
    console.log(err);
    if (err) return res.status(500).json({ error: err.message });
    console.log(data);
    return res.status(200).json(data.reverse());
  });
};

module.exports = { getAttendances };
