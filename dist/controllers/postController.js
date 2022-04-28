"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleLike = exports.removePost = exports.editPost = exports.detailPost = exports.uploadPost = exports.getPosts = void 0;
const post_1 = __importDefault(require("../models/post"));
const user_1 = __importDefault(require("../models/user"));
const like_1 = __importDefault(require("../models/like"));
/* 게시글 전체 조회 기능 */
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 포스트, 라이크 테이블 조회를 병렬적으로 처리하기 위해 Promise.all 적용
        const [allPosts, allLikes] = yield Promise.all([
            // @ts-ignore
            post_1.default.findAll({
                attributes: { exclude: ["user_id", "deletedAt"] },
                include: {
                    model: user_1.default,
                    as: "author",
                    attributes: ["user_id", "email", "nickname", "role"],
                },
            }),
            // @ts-ignore
            like_1.default.findAll({}),
        ]);
        // 좋아요 데이터 포스트에 저장하기
        // 1. 좋아요 테이블 생성
        // 2. 좋아요 테이블 돌면서, 좋아요 테이블에 post_id 별 좋아요 로우를 배열로 저장
        // 3. 포스트 테이블 돌면서, post_id 별 좋아요 배열을 할당
        const likesTable = {}; // { '1': [like] }
        allLikes.forEach((like) => {
            // @ts-ignore
            if (!likesTable[like.post_id]) {
                // @ts-ignore
                likesTable[like.post_id] = [like];
            }
            else {
                // @ts-ignore
                likesTable[like.post_id].push(like);
            }
        });
        allPosts.forEach((post) => {
            // @ts-ignore
            post.dataValues.likes = likesTable[String(post.dataValues.post_id)] || []; // 라이크없으면 빈 배열이라도 발송
        });
        return res.json({ ok: true, rows: allPosts });
    }
    catch (error) {
        // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
        return res.status(400).json({ ok: false, message: error.message });
    }
});
exports.getPosts = getPosts;
/* 게시글 등록 기능 */
const uploadPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user: { user_id }, } = res.locals;
    const { content } = req.body;
    // @ts-ignore
    const { path: image } = req.file;
    try {
        // @ts-ignore
        yield post_1.default.create({ content, image, user_id });
        // 포스트 생성 완료되었으므로 => 201 Created
        return res.status(201).json({ ok: true });
    }
    catch (error) {
        // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
        return res.status(400).json({ ok: false, message: error.message });
    }
});
exports.uploadPost = uploadPost;
/* 특정 게시글 조회 기능 */
const detailPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { post_id } = req.params;
    try {
        const [post, likes] = yield Promise.all([
            // @ts-ignore
            post_1.default.findOne({
                attributes: { exclude: ["deletedAt"] },
                where: { post_id },
                include: {
                    model: user_1.default,
                    as: "author",
                    attributes: ["user_id", "email", "nickname", "role"],
                },
            }),
            // @ts-ignore
            like_1.default.findAll({ where: { post_id } }),
        ]);
        if (!post) {
            return res
                .status(400)
                .json({ ok: false, message: "게시글이 존재하지 않습니다." });
        }
        // 좋아요 데이터 post에 저장
        // @ts-ignore
        post.dataValues.likes = likes;
        return res.json({ ok: true, row: post });
    }
    catch (error) {
        // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
        return res.status(400).json({ ok: false, message: error.message });
    }
});
exports.detailPost = detailPost;
/* 게시글 수정 기능 */
const editPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user: { user_id }, } = res.locals;
    const { post_id } = req.params;
    let { content } = req.body;
    // @ts-ignore
    let { path: image } = req.file || "";
    // 게시글 내용 또는 이미지 안보내줄 경우 기존 게시글 또는 이미지 사용
    if (!content || !image) {
        // @ts-ignore
        const post = yield post_1.default.findOne({ where: { post_id } });
        // @ts-ignore
        if (!content)
            content = post.content;
        // @ts-ignore
        if (!image)
            image = post.image;
    }
    try {
        // @ts-ignore
        yield post_1.default.update({ content, image }, { where: { post_id, user_id } });
        return res.json({ ok: true });
    }
    catch (error) {
        // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
        return res.status(400).json({ ok: false, message: error.message });
    }
});
exports.editPost = editPost;
/* 게시글 삭제 기능 */
const removePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user: { user_id }, } = res.locals;
    const { post_id } = req.params;
    try {
        // @ts-ignore
        const user = yield user_1.default.findOne({ where: user_id });
        // TODO: [요구사항 6] 관리자 권한 추가하여 모든 게시글, 댓글 삭제 가능하도록 (user의 role이 1이면 post_id만으로 삭제가능)
        // @ts-ignore
        if (user.role === 1) {
            // @ts-ignore
            yield post_1.default.destroy({ where: { post_id } });
        }
        else {
            // @ts-ignore
            yield post_1.default.destroy({ where: { post_id, user_id } });
        }
        return res.json({ ok: true });
    }
    catch (error) {
        // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
        return res.status(400).json({ ok: false, message: error.message });
    }
});
exports.removePost = removePost;
const toggleLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user: { user_id }, } = res.locals;
    const { post_id } = req.params;
    try {
        // @ts-ignore
        const like = yield like_1.default.findOne({ where: { user_id, post_id } });
        if (like) {
            // @ts-ignore
            yield like_1.default.destroy({ where: { user_id, post_id } });
        }
        else {
            // @ts-ignore
            yield like_1.default.create({ user_id, post_id });
        }
        return res.json({ ok: true });
    }
    catch (error) {
        // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
        return res.status(400).json({ ok: false, message: error.message });
    }
});
exports.toggleLike = toggleLike;
