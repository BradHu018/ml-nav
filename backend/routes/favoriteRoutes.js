const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    saveBuild,
    unsaveBuild,
    getSavedBuilds,
} = require("../controllers/favoriteController");

router.get("/", authMiddleware, getSavedBuilds);

router.post("/:id", authMiddleware, saveBuild);

router.delete("/:id", authMiddleware, unsaveBuild);

module.exports = router;