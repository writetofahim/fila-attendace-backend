const express = require("express");
const { handleLogin } = require("../controllers/authController");

// express router
const router = express();

router.post("/login", handleLogin);

module.exports = router;
