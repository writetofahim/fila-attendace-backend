const express = require("express");
const {
  handlePunchIn,
  handlePunchOut,
} = require("../controllers/punchController");
const requireAuth = require("../middleware/requireAuth");

// express router
const router = express();

router.post("/punchin", requireAuth, handlePunchIn);
router.post("/punchout", requireAuth, handlePunchOut);

module.exports = router;
