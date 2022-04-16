const express = require("express");
const postRouter = express.Router();
const upload = require("../middlewares/imageUploadMiddleware");

const {
  getPosts,
  uploadPost,
  detailPost,
  editPost,
  removePost,
} = require("../controllers/postController");
const { postValidator } = require("../middlewares/validatorMiddleware");
const { protectorMiddleware } = require("../middlewares/protectorMiddleware");

postRouter
  .route("/")
  .get(getPosts)
  .post(protectorMiddleware, upload.single("image"), postValidator, uploadPost);
// .post(protectorMiddleware, postValidator, upload.single("image"), uploadPost);
postRouter
  .route("/:post_id")
  .get(detailPost)
  .patch(protectorMiddleware, upload.single("image"), postValidator, editPost)
  .delete(protectorMiddleware, removePost);

module.exports = postRouter;
