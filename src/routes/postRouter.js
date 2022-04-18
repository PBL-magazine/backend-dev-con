const express = require("express");
const upload = require("../middlewares/imageUploadMiddleware");
const { protectorMiddleware } = require("../middlewares/protectorMiddleware");
const { postValidator } = require("../middlewares/validatorMiddleware");
const {
  getPosts,
  uploadPost,
  detailPost,
  editPost,
  removePost,
  toggleLike,
} = require("../controllers/postController");

const postRouter = express.Router();

/* 게시글 전체 조회, 게시글 작성 라우터 */
postRouter
  .route("/")
  .get(getPosts) // TODO: [요구사항 3-1] 로그인하지 않은 사용자도, 게시글 목록 조회 가능하도록 하기
  .post(protectorMiddleware, upload.single("image"), postValidator, uploadPost); // TODO: [요구사항 3-4] 로그인을 한 사람만 글쓰기 권한 (미들웨어 적용했음)
// postValidator 후에 upload.single("image")를 적용하면 request를 해석할 수 없어서 에러 발생

/* 특정 게시글 조회, 수정, 삭제 라우터 */
postRouter
  .route("/:post_id")
  .get(detailPost)
  .patch(protectorMiddleware, upload.single("image"), postValidator, editPost)
  .delete(protectorMiddleware, removePost);

// TODO: [요구사항 3-2] 로그인하지 않은 사용자가, 좋아요 누른 경우 예외처리 (미들웨어 적용했음)
postRouter.patch("/:post_id/like", protectorMiddleware, toggleLike);

module.exports = postRouter;
