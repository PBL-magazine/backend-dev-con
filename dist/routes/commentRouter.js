"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protectorMiddleware_1 = require("../middlewares/protectorMiddleware");
const validatorMiddleware_1 = require("../middlewares/validatorMiddleware");
const commentController_1 = require("../controllers/commentController");
const commentRouter = express_1.default.Router({ mergeParams: true });
/* 게시글에 달린 댓글 전체 조회, 댓글 작성 라우터 */
commentRouter
    .route("/")
    .get(commentController_1.getComments)
    .post(protectorMiddleware_1.protectorMiddleware, validatorMiddleware_1.commentValidator, commentController_1.uploadComment);
/* 게시글에 달린 댓글 수정, 삭제 라우터 */
commentRouter
    .route("/:comment_id")
    .patch(protectorMiddleware_1.protectorMiddleware, validatorMiddleware_1.commentValidator, commentController_1.editComment)
    .delete(protectorMiddleware_1.protectorMiddleware, commentController_1.removeComment);
exports.default = commentRouter;
