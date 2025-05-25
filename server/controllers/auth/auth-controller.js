const Usermodel = require("../../models/User");
const Postmodel = require("../../models/Post");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
require("dotenv").config();

dotenv.config();

// Step 1  Register User

const registerUser = async (req, res) => {
  const { name, email } = req.body;
  console.log("Registration attempt for:", name, email);

  try {
    // Check for existing user
    const existingUser = await Usermodel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Generate and save verification code with expiration
    const emailCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

    const newUser = new Usermodel({
      name,
      email,
      emailCode,
      codeExpiry,
      isVerified: false,
    });

    await newUser.save();
    console.log("Verification code saved to DB:", emailCode);

    // Email configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
      // Recommended settings for production:
      pool: true,
      maxConnections: 1,
      rateDelta: 20000, // 20 seconds between emails
      maxMessages: 3,
    });

    const mailOptions = {
      from: `"Your App Name" <${process.env.EMAIL}>`,
      to: email,
      subject: "Verify Your Email",
      text: `Your verification code is: ${emailCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Your verification code is: <strong style="font-size: 18px;">${emailCode}</strong></p>
          <p style="color: #666;">This code will expire in 15 minutes.</p>
        </div>
      `,
    };

    // Send email with proper error handling
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("Email send failed:", err);
          // Delete the user if email fails to prevent orphaned records
          Usermodel.deleteOne({ email }).catch(console.error);
          reject(err);
        } else {
          console.log("Email sent successfully:", info.response);
          resolve(info);
        }
      });
    });

    return res.json({
      success: true,
      message: "Verification code sent to email",
      emailCode, // Only include in development for testing
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// Step 2  Verify email
const verifyemail = async (req, res) => {
  try {
    const { email, emailCode, password } = req.body;
    console.log("email, password +verify", email, password, emailCode);

    console.log("Verifying email:", email, "Code:", emailCode);

    const user = await Usermodel.findOne({ email });

    if (!user) {
      console.log("Email not found:", email);
      return res.status(400).json({ message: "Email not found" });
    }

    console.log("Stored Code:", user.emailCode, "Entered Code:", emailCode);

    if (!user.emailCode || user.emailCode.toString() !== emailCode.toString()) {
      console.log("Invalid verification code");
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Hash password and update user
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.isVerified = true;
    await user.save();

    console.log("User verified and password set:", user);

    // Generate token
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "60h" }
    );

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({ message: "Email verified. Password set!", token });
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//  Step 3  Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("email, password ", email, password);

  if (!email || !password) {
    return res.status(400).json({ message: "Email or password missing!" });
  }

  try {
    let usercheck = await Usermodel.findOne({ email });

    if (!usercheck) {
      return res.status(400).json({
        success: false,
        message: "User does not exist! Please register first",
      });
    }

    // 🔹 Check if email is verified
    if (!usercheck.isVerified) {
      // ✅ Fixed field name
      return res.status(403).json({
        success: false,
        message: "Email not verified! Check your email for verification link",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, usercheck.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password! Please try again",
      });
    }

    const token = jwt.sign(
      {
        id: usercheck._id,
        role: usercheck.role,
        email: usercheck.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "60h" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        maxAge: 60 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "Logged in successfully",
        token,
        user: {
          name: usercheck.name,
          email: usercheck.email,
          role: usercheck.role,
          id: usercheck._id,
        },
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Login failed", error: error.message });
  }
};

// Step 4  Logout User

const Logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.clearCookie("sessionId");

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Server error during logout" });
  }
};
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }
    const user = await Usermodel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.posts) {
      user.posts = [];
    }

    const newPost = new Postmodel({ title, content, user: user._id });
    await newPost.save();

    user.posts.push(newPost._id); // ✅ Push the new post
    await user.save();

    res.status(201).json({
      success: true,
      message: "Post created successfully!",
      post: newPost,
    });
  } catch (error) {
    console.error("❌ Error in createPost:", error);
    res.status(500).json({ error: "Server error: " + error.message });
  }
};

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  console.log("🔍 Received Token:", token);

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ✅ Assign decoded user info
    console.log("✅ Token Decoded Successfully:", decoded);
    next();
  } catch (error) {
    console.log("❌ Token Verification Failed:", error.message);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

const getUserPosts = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    const userId = req.params.userId.trim();
    console.log("🔍 Fetching posts for user ID:", userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const posts = await Postmodel.find({ user: userId })
      .populate("user", "name email")
      .exec();

    res.json({
      message: `Posts for user ${req.user.email}`,
      posts: posts,
    });
  } catch (error) {
    console.error("❌ Error fetching user posts:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching posts", error: error.message });
  }
};

const deletepost = async (req, res) => {
  try {
    const id = req.params.id.trim();
    const userId = req.user.id;

    // 1. First check if post exists at all
    const post = await Postmodel.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
        debug: { attemptedId: id },
      });
    }

    // 2. Check ownership (admin can delete any post)
    const isAdmin = req.user.role === "admin"; // Add this to your JWT if needed
    if (post.user.toString() !== userId && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Permission denied",
        details: {
          postOwner: post.user.toString(),
          currentUser: userId,
          isAdmin: isAdmin,
        },
      });
    }

    // 3. Perform deletion
    const deletedPost = await Postmodel.findByIdAndDelete(id);

    // 4. Clean up user's posts array
    await Usermodel.findByIdAndUpdate(post.user, {
      $pull: { posts: deletedPost._id },
    });

    res.json({
      success: true,
      message: "Post deleted successfully",
      deletedPost: {
        id: deletedPost._id,
        title: deletedPost.title,
      },
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting post",
      error: error.message,
    });
  }
};

const updatepost = async (req, res) => {
  try {
    const id = req.params.id.trim();
    const { title, content } = req.body;
    const userId = req.user.id; // From authMiddleware

    // 1. Validate input
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    // 2. Check if post exists
    const post = await Postmodel.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // 3. Check ownership (or admin role)
    const isAdmin = req.user.role === "admin"; // Add role to your JWT if needed
    if (post.user.toString() !== userId && !isAdmin) {
      return res.status(403).json({ error: "Permission denied" });
    }

    // 4. Update the post
    const updatedPost = await Postmodel.findByIdAndUpdate(
      id,
      { title, content, updatedAt: Date.now() },
      { new: true } // Return the updated document
    );

    res.json({
      success: true,
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyemail,
  createPost,
  authMiddleware,
  getUserPosts,
  deletepost,
  updatepost,
  Logout,
};
