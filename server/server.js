const express = require("express");
const authRouter = require("./routes/auth/auth-routes");
const postRouter = require("./routes/post/post-routes");
const db = require("./models/Connection");

const app = express();
const cookiesParser = require("cookie-parser");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookiesParser());

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "https://travel-2p74.vercel.app",
      "http://localhost:3000",
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Length", "Authorization"],
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(
  cors({
    Origins: ["https://travel-2p74.vercel.app", "http://localhost:3000"], // Allow React app
    methods: "GET , POST , PUT , DELETE ,PATCH, HEAD ",
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("Hey from backend");
});

app.use("/api/auth", authRouter);

app.use("/api/post", postRouter);

app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.use((req, res, next) => {
  console.log(`Request made to: ${req.originalUrl}`);
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
