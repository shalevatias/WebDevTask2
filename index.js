const express = require("express");
const mongoose = require("mongoose");

const postRoutes = require("./routes/postRoute");
const commentRoutes = require("./routes/commentRoute");

const app = express();
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/app";
const PORT = process.env.PORT || 3000;

app.use(express.json());

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("DB connection error:", err));

app.use("/post", postRoutes);
app.use("/comments", commentRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
