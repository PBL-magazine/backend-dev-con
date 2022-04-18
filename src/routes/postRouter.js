const express = require("express");
const postRouter = express.Router();
const upload = require("../middlewares/imageUploadMiddleware");

const {
  getPosts,
  uploadPost,
  detailPost,
  editPost,
  removePost,
  toggleLike,
} = require("../controllers/postController");
const { postValidator } = require("../middlewares/validatorMiddleware");
const { protectorMiddleware } = require("../middlewares/protectorMiddleware");

postRouter
  .route("/")
  .get(getPosts)
  .post(protectorMiddleware, upload.single("image"), postValidator, uploadPost);
// .post(protectorMiddleware, postValidator, upload.single("image"), uploadPost); => 순서가 잘못되었던 문제의 코드

postRouter
  .route("/:post_id")
  .get(detailPost)
  .patch(protectorMiddleware, upload.single("image"), postValidator, editPost)
  .delete(protectorMiddleware, removePost);

postRouter.patch("/:post_id/like", protectorMiddleware, toggleLike);

module.exports = postRouter;
