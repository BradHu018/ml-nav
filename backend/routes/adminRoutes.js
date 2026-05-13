const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const db = require("../config/db");

// Admin test route
router.get("/dashboard", authMiddleware, adminMiddleware, async (req, res) => {
  res.status(200).json({
    message: "Welcome to the admin dashboard",
    user: req.user,
  });
});

// Get all builds
router.get("/builds", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [builds] = await db.query(`
      SELECT 
        saved_builds.id,
        saved_builds.hero_name,
        saved_builds.build_name,
        saved_builds.description,
        saved_builds.emblem,
        saved_builds.battle_spell,
        saved_builds.upvotes,
        saved_builds.downvotes,
        saved_builds.created_at,
        users.username
      FROM saved_builds
      JOIN users ON saved_builds.user_id = users.id
      ORDER BY saved_builds.created_at DESC
    `);

    res.status(200).json({ builds });
  } catch (error) {
    console.error("Admin get builds error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

// Delete any user's build
router.delete("/builds/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const buildId = req.params.id;

    const [result] = await db.query(
      `
      DELETE FROM saved_builds
      WHERE id = ?
      `,
      [buildId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Build not found",
      });
    }

    res.status(200).json({
      message: "Build deleted by admin",
    });
  } catch (error) {
    console.error("Admin delete build error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;