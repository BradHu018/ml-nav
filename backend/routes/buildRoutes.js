const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createBuild,
    getMyBuilds,
    updateBuild,
    deleteBuild,
    getTopBuilds,
    searchBuildsByHero,
    upvoteBuild,
} = require("../controllers/buildController");

console.log("authMiddleware is:", authMiddleware);
console.log("createBuild is:", createBuild);


// public route: anyone can see community builds
router.get("/top", getTopBuilds);
router.get("/search", searchBuildsByHero);

// protected route: logged-in user creates a build
router.post("/", authMiddleware, createBuild);

// protected route: logged-in user sees only their builds
router.get("/my-builds", authMiddleware, getMyBuilds);

router.post("/:id/upvote", authMiddleware, upvoteBuild);

// protected route: logged-in user edits their own build
router.put("/:id", authMiddleware, updateBuild);

// protected route: logged-in user deletes their own build
router.delete("/:id", authMiddleware, deleteBuild);


module.exports = router;