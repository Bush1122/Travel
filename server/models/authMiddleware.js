const authMiddleware = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  console.log("🔍 Received Token:", token);

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("✅ Token Decoded Successfully:", decoded);

    if (!req.user.id) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User ID missing in token" });
    }

    next();
  } catch (error) {
    console.log("❌ Token Verification Failed:", error.message);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
