const express = require("express");
const {
  getComments,
  uploadComment,
  editComment,
  removeComment,
} = require("../controllers/commentController");
const { commentValidator } = require("../middlewares/validatorMiddleware");
const { protectorMiddleware } = require("../middlewares/protectorMiddleware");

const commentRouter = express.Router({ mergeParams: true });

/* 게시글에 달린 댓글 전체 조회, 댓글 작성 라우터 */
commentRouter
  .route("/")
  .get(getComments)
  .post(protectorMiddleware, commentValidator, uploadComment);

/* 게시글에 달린 댓글 수정, 삭제 라우터 */
commentRouter
  .route("/:comment_id")
  .patch(protectorMiddleware, commentValidator, editComment)
  .delete(protectorMiddleware, removeComment);

module.exports = commentRouter;
