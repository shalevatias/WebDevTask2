const Comment = require("../models/commentModel");

const createComment = async (req, res) => {
  try {
    const comment = await Comment.create(req.body);
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const fetchComments = async (_, res) => {
  const comments = await Comment.find();
  res.json(comments);
};

const fetchComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: "Comment not found" });
  res.json(comment);
};

const modifyComment = async (req, res) => {
  const updated = await Comment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Comment not found" });
  res.json(updated);
};

const removeComment = async (req, res) => {
  const deleted = await Comment.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Comment not found" });
  res.json({ message: "Comment deleted" });
};

const fetchCommentsByPost = async (req, res) => {
  const comments = await Comment.find({ postId: req.params.postId });
  res.json(comments);
};

module.exports = {
  createComment,
  fetchComments,
  fetchComment,
  modifyComment,
  removeComment,
  fetchCommentsByPost
} 