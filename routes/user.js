const express = require("express");
const UserController = require("./../controllers/userController");
const authMiddleware = require("./../middleware/auth");
const { imageUploads } = require("./../utils/multer")


const router = express.Router();

router.route("/").get(UserController.getAllUsers);

router
.route("/profile")
.get(authMiddleware.protectRoute, UserController.getUserProfile)
.patch(authMiddleware.protectRoute, UserController.updateProfile);

router
.route("/update-profile-picture")
.patch(
    authMiddleware.protectRoute,
    imageUploads,
    UserController.updateProfilePicture
);

router
.route("/update-password")
.patch(authMiddleware.protectRoute, UserController.updatePassword);


module.exports = router;