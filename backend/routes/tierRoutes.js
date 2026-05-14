const express = require("express");
const router = express.Router();

const { getTierList } = require("../controllers/tierController");

router.get("/", getTierList);

module.exports = router;