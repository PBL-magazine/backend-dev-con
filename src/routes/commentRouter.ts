import express from "express";
import { protectorMiddleware } from "../middlewares/protectorMiddleware";
import { commentValidator } from "../middlewares/validatorMiddleware";
import {
  editComment,
  getComments,
  removeComment,
  uploadComment,
} from "../controllers/commentController";

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

export default commentRouter;
