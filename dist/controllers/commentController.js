"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.updateComment = exports.getCommentsByPost = exports.getComment = exports.getComments = exports.createComment = void 0;
const commentModel_1 = __importDefault(require("../models/commentModel"));
const postModel_1 = __importDefault(require("../models/postModel"));
const createComment = async (req, res) => {
    try {
        const { postId, text } = req.body;
        const owner = req.userId;
        if (!postId || !text) {
            res.status(400).json({ error: 'Post ID and text are required' });
            return;
        }
        const post = await postModel_1.default.findById(postId);
        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        const comment = await commentModel_1.default.create({ postId, owner, text });
        res.status(201).json(comment);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.createComment = createComment;
const getComments = async (_req, res) => {
    try {
        const comments = await commentModel_1.default.find()
            .populate('owner', 'username email')
            .populate('postId', 'title');
        res.json(comments);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getComments = getComments;
const getComment = async (req, res) => {
    try {
        const comment = await commentModel_1.default.findById(req.params.id)
            .populate('owner', 'username email')
            .populate('postId', 'title');
        if (!comment) {
            res.status(404).json({ error: 'Comment not found' });
            return;
        }
        res.json(comment);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getComment = getComment;
const getCommentsByPost = async (req, res) => {
    try {
        const comments = await commentModel_1.default.find({ postId: req.params.postId })
            .populate('owner', 'username email');
        res.json(comments);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getCommentsByPost = getCommentsByPost;
const updateComment = async (req, res) => {
    try {
        const { text } = req.body;
        const comment = await commentModel_1.default.findById(req.params.id);
        if (!comment) {
            res.status(404).json({ error: 'Comment not found' });
            return;
        }
        if (String(comment.owner) !== String(req.userId)) {
            res.status(403).json({ error: 'Not authorized to update this comment' });
            return;
        }
        const updated = await commentModel_1.default.findByIdAndUpdate(req.params.id, { text }, { new: true }).populate('owner', 'username email');
        res.json(updated);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.updateComment = updateComment;
const deleteComment = async (req, res) => {
    try {
        const comment = await commentModel_1.default.findById(req.params.id);
        if (!comment) {
            res.status(404).json({ error: 'Comment not found' });
            return;
        }
        if (String(comment.owner) !== String(req.userId)) {
            res.status(403).json({ error: 'Not authorized to delete this comment' });
            return;
        }
        await commentModel_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'Comment deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteComment = deleteComment;
