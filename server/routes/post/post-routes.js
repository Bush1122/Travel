const express = require("express");
const {
  createPost,
  getUserPosts,
  deletepost,
  updatepost,
} = require("../../controllers/auth/auth-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.post("/create", authMiddleware, createPost);

router.get("/create", authMiddleware, (req, res) => {
  console.log(" User Info in Route:", req.user); // Debugging Log

  res.json({
    message: `Hello ${req.user.email},  ${req.user.id}  authorized!`,
  });
});

router.post("/postuser/:userId", authMiddleware, getUserPosts);
router.get("/postuser/:userId", authMiddleware, getUserPosts);

//router.delete("/deletepost/:id", authMiddleware, deletepost);

router.put("/updatepost/:id", authMiddleware, updatepost);

module.exports = router;
