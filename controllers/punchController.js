const db = require("../db");

const formateDate = (date) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  const formattedDate = date
    .toLocaleDateString("en-US", options)
    .split(" ")
    .map((part, index) => (index === 1 ? `${part.slice(0, 3)}-` : part))
    .join("");
  return formattedDate;
};

const formateTime = (date) => {
  // Create a new date object

  // Get hours, minutes and seconds from the date object
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // Format hours to include leading zero if necessary
  const formattedHours = hours < 10 ? `0${hours}` : hours;

  // Format minutes to include leading zero if necessary
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  // Format seconds to include leading zero if necessary
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  // Create a string with the desired format
  const timeString = `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${
    hours >= 12 ? "PM" : "AM"
  }`;
  return timeString;
};

const handlePunchIn = (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const { user } = req.user;
  const date = new Date().toLocaleString("en-BD", { timeZone: "Asia/Dhaka" });
  const currentDate = formateDate(new Date().toISOString().slice(0, 10));

  // check if a punch-in record already exists for the user on the current date
  const checkPunchInQuery = `SELECT SL FROM attendance WHERE user = '${user}' AND Date = '${currentDate}'`;
  db.query(checkPunchInQuery, (error, results, fields) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Something went wrong in server side!" });
    }
    if (results.length > 0) {
      return res.status(400).json({
        error: ` ${req.user.user} has already punched in for the day!`,
      });
    }

    const time = formateTime(date);
    // insert the punch-in record into the attendance table
    const punchInQuery = `INSERT INTO attendance (EMP_name, Punch_In, IP, date) VALUES ('${user}', '${time}' , '${ip}', '${currentDate}')`;
    db.query(punchInQuery, (error, results, fields) => {
      if (error) {
        return res
          .status(500)
          .json({ error: "Something went wrong in server side!" });
      }
      res.send({ message: `Punch-in recorded for user ${req.user.user}` });
    });
  });
};

const handlePunchOut = (req, res) => {
  const { user } = req.user;
  const date = new Date().toLocaleString("en-BD", { timeZone: "Asia/Dhaka" });
  const currentDate = formateDate(new Date().toISOString().slice(0, 10));
  // find the most recent punch-in record for the user
  const getLatestPunchInQuery = `SELECT MAX(SL) AS SL, Punch_out FROM attendance WHERE user = ? AND Date = ?`;

  db.query(
    getLatestPunchInQuery,
    [user, currentDate],
    (error, results, fields) => {
      if (error) {
        res.status(500).send({
          error: "Something went wrong in server side!'",
        });
      }

      if (results.length > 0) {
        const SL = results[0].SL;
        const Punch_out = results[0].Punch_out;
        if (!SL && !Punch_out) {
          return res
            .status(400)
            .send({ error: "You have not punched in yet today!" });
        } else if (Punch_out) {
          return res
            .status(400)
            .send({ error: "You have already punched out for today!" });
        } else {
          // update the punch-in record with the punch-out time
          const time = formateTime(date);
          const punchOutQuery = `UPDATE attendance SET Punch_out = '${time}' WHERE SL = ${SL}`;
          db.query(punchOutQuery, (error, results, fields) => {
            if (error) {
              return res.status(400).send({
                error: `User ${req.user.user} has no recorded punch-in events`,
              });
            }
            return res.send({
              message: `Punch-out recorded for user ${req.user.user}`,
            });
          });
        }
      } else {
        res.status(400).send({
          error: `User ${req.user.user} has no recorded punch-in events`,
        });
      }
    }
  );
};

module.exports = {
  handlePunchIn,
  handlePunchOut,
};
