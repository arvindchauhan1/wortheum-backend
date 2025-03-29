const express = require("express");
const router = express.Router();
const {
    getUsers,
    getUserById,
    getReporters,
    getReaders,
    createUser,
    updateUser,
    deleteUser,
    getMyProfile
} = require("../controllers/userController");
const auth = require("../middlewares/auth");
const authorizeRole = require("../middlewares/authorizeRole");
const upload = require("../middlewares/uploadMiddleware");

// User routes

router.get("/profile",
    auth,
    getMyProfile
);


// get all users (Admin) || only fetch reader & reporter
router.get("/all",
    auth,
    authorizeRole(["admin", "super_admin"]),
    getUsers
);

// (loggen in user)
router.get("/user/:id",
    auth,
    getUserById
);


// (Admin)
router.get("/reporters",
    auth,
    authorizeRole(["admin", "super_admin"]),
    getReporters
);

router.get("/readers",
    auth,
    authorizeRole(["admin", "super_admin"]),
    getReaders
);

router.post("/",
    auth,
    authorizeRole(["admin", "super_admin"]),
    createUser
);

// (any logged in user)
router.put("/",
    auth,
    upload.single("imageUrl"),
    updateUser
);
// (admin)
router.delete("/:id",
    auth,
    authorizeRole(["admin", "super_admin"]),
    deleteUser
);

module.exports = router;
