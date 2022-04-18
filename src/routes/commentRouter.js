const express = require("express");
const commentRouter = express.Router({ mergeParams: true });

const {
  getComments,
  uploadComment,
  editComment,
  removeComment,
} = require("../controllers/commentController");
const { commentValidator } = require("../middlewares/validatorMiddleware");
const { protectorMiddleware } = require("../middlewares/protectorMiddleware");

commentRouter
  .route("/")
  .get(getComments)
  .post(protectorMiddleware, commentValidator, uploadComment);

commentRouter
  .route("/:comment_id")
  .patch(protectorMiddleware, commentValidator, editComment)
  .delete(protectorMiddleware, removeComment);

module.exports = commentRouter;
