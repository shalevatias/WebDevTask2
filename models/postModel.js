const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
      required: true
    },
    title: String,
    content: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
