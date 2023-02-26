const db = require("../db");

const handlePunchIn = (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const { userid } = req.user;
  const date = new Date().toLocaleString("en-BD", { timeZone: "Asia/Dhaka" });
  const currentDate = new Date().toISOString().slice(0, 10);

  // check if a punch-in record already exists for the user on the current date
  const checkPunchInQuery = `SELECT attendanceid FROM attendance WHERE userid = '${userid}' AND DATE(punchin) = '${currentDate}'`;
  db.query(checkPunchInQuery, (error, results, fields) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Something went wrong in server side!" });
    }
    if (results.length > 0) {
      return res.status(400).json({
        error: ` ${req.user.username} has already punched in for the day!`,
      });
    }

    // insert the punch-in record into the attendance table
    const punchInQuery = `INSERT INTO attendance (userid, punchin, ipaddress) VALUES ('${userid}', STR_TO_DATE('${date}', '%m/%d/%Y, %h:%i:%s %p'), '${ip}')`;
    db.query(punchInQuery, (error, results, fields) => {
      if (error) {
        return res
          .status(500)
          .json({ error: "Something went wrong in server side!" });
      }
      res.send({ message: `Punch-in recorded for user ${req.user.username}` });
    });
  });
};

const handlePunchOut = (req, res) => {
  const { userid } = req.user;
  const date = new Date().toLocaleString("en-BD", { timeZone: "Asia/Dhaka" });
  // find the most recent punch-in record for the user
  const getLatestPunchInQuery = `SELECT MAX(attendanceid) AS attendanceid, punchout FROM attendance WHERE userid = ? AND DATE(punchin) = CURDATE()`;

  db.query(getLatestPunchInQuery, [userid], (error, results, fields) => {
    if (error) {
      res.status(500).send({
        error: "Something went wrong in server side!'",
      });
    }

    if (results.length > 0) {
      const punchInId = results[0].attendanceid;
      const punchOutTime = results[0].punchout;
      if (!punchInId && !punchOutTime) {
        return res
          .status(400)
          .send({ error: "You have not punched in yet today!" });
      } else if (punchOutTime) {
        return res
          .status(400)
          .send({ error: "You have already punched out for today!" });
      } else {
        // update the punch-in record with the punch-out time
        const punchOutQuery = `UPDATE attendance SET punchout = STR_TO_DATE('${date}', '%m/%d/%Y, %h:%i:%s %p') WHERE attendanceid = ${punchInId}`;
        db.query(punchOutQuery, (error, results, fields) => {
          if (error) {
            return res.status(400).send({
              error: `User ${req.user.username} has no recorded punch-in events`,
            });
          }
          return res.send({
            message: `Punch-out recorded for user ${req.user.username}`,
          });
        });
      }
    } else {
      res.status(400).send({
        error: `User ${req.user.username} has no recorded punch-in events`,
      });
    }
  });
};

module.exports = {
  handlePunchIn,
  handlePunchOut,
};
