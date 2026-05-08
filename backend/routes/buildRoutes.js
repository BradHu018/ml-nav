const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createBuild,
    getMyBuilds,
    // getAllBuilds,
    // updateBuild,
    // deleteBuild,
} = require("../controllers/buildController");

console.log("authMiddleware is:", authMiddleware);
console.log("createBuild is:", createBuild);


// public route: anyone can see community builds
// router.get("/", getAllBuilds);

// protected route: logged-in user creates a build
router.post("/", authMiddleware, createBuild);

// protected route: logged-in user sees only their builds
router.get("/my-builds", authMiddleware, getMyBuilds);

// protected route: logged-in user edits their own build
// router.put("/:id", authMiddleware, updateBuild);

// protected route: logged-in user deletes their own build
// router.delete("/:id", authMiddleware, deleteBuild);

module.exports = router;