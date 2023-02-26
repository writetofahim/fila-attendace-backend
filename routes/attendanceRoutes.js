const express = require("express");
const { getAttendances } = require("../controllers/attendanceController");
const requireAuth = require("../middleware/requireAuth");

// express router
const router = express();

router.get("/", getAttendances);

module.exports = router;
