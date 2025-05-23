const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  content: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Postmodel", postSchema); // Capitalized model name
