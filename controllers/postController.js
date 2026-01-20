const Post = require("../models/postModel");

exports.createPost = async (req, res) => {
  try {
    const post = await Post.create(req.body);
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.fetchPost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
};

exports.fetchPosts = async (req, res) => {
  const filter = {};

  if (req.query.sender) {
    filter.senderId = req.query.sender;
  }

  const posts = await Post.find(filter);
  res.json(posts);
};

exports.modifyPost = async (req, res) => {
  const updated = await Post.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Post not found" });
  res.json(updated);
};
