const express = require("express");

const {
  registerUser,
  loginUser,
  verifyemail,
  Logout,
} = require("../../controllers/auth/auth-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/verify", verifyemail);

router.get("/register", (req, res) => {
  res.json({ message: "Register route is working!" });
});

router.get("/login", (req, res) => {
  res.json({ message: "Login route is working!" });
});

router.get("/verify", (req, res) => {
  res.json({ message: "verify route is working" });
});

router.post("/logout", authMiddleware, Logout);

module.exports = router;
