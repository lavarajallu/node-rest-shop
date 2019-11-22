const express = require("express");
const router = express.Router();

const UsersController = require("../controllers/user");
const checkAuth = require("../middleware/check-auth");

//User Authentication as signUp
router.post("/signup", UsersController.user_signup);

//User Authentication as signIn
router.post("/signin", UsersController.user_signin);

//User should be delete by user Id
router.delete("/:userId", checkAuth, UsersController.user_delete);

module.exports = router;
