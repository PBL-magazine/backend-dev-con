"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const imageUploadMiddleware_1 = __importDefault(require("../middlewares/imageUploadMiddleware"));
const postController_1 = require("../controllers/postController");
const validatorMiddleware_1 = require("../middlewares/validatorMiddleware");
const protectorMiddleware_1 = require("../middlewares/protectorMiddleware");
const express_1 = __importDefault(require("express"));
const postRouter = express_1.default.Router();
/* 게시글 전체 조회, 게시글 작성 라우터 */
postRouter
    .route("/")
    .get(postController_1.getPosts) // TODO: [요구사항 3-1] 로그인하지 않은 사용자도, 게시글 목록 조회 가능하도록 하기
    .post(protectorMiddleware_1.protectorMiddleware, imageUploadMiddleware_1.default.single("image"), validatorMiddleware_1.postValidator, postController_1.uploadPost); // TODO: [요구사항 3-4] 로그인을 한 사람만 글쓰기 권한 (미들웨어 적용했음)
// postValidator 후에 upload.single("image")를 적용하면 request를 해석할 수 없어서 에러 발생
/* 특정 게시글 조회, 수정, 삭제 라우터 */
postRouter
    .route("/:post_id")
    .get(postController_1.detailPost)
    .patch(protectorMiddleware_1.protectorMiddleware, imageUploadMiddleware_1.default.single("image"), validatorMiddleware_1.postValidator, postController_1.editPost)
    .delete(protectorMiddleware_1.protectorMiddleware, postController_1.removePost);
// TODO: [요구사항 3-2] 로그인하지 않은 사용자가, 좋아요 누른 경우 예외처리 (미들웨어 적용했음)
postRouter.put("/:post_id/like", protectorMiddleware_1.protectorMiddleware, postController_1.toggleLike);
exports.default = postRouter;
