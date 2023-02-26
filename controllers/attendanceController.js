const db = require("../db");
const getAttendances = (req, res) => {
  const q =
    "select * from attendance where EMP_name = ? order by SL DESC LIMIT 10";

  db.query(q, [req.user.user], (err, data) => {
    console.log(err);
    if (err) return res.status(500).json({ error: err.message });
    console.log(data);
    return res.status(200).json(data.reverse());
  });
};

module.exports = { getAttendances };
