const router = require("express").Router();
const {
  createComment,
  fetchComments,
  fetchComment,
  modifyComment,
  removeComment,
  fetchCommentsByPost
} = require("../controllers/commentController");

router.post("/", createComment);
router.get("/", fetchComments);
router.get("/:id", fetchComment);
router.put("/:id", modifyComment);
router.delete("/:id", removeComment);
router.get("/post/:postId", fetchCommentsByPost);

module.exports = router;
